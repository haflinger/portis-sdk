declare global {
    interface Window { opera: any; }
}

export class Provider {
    requests: { [id: string]: { payload: Payload, cb: callbackFunction } } = {};
    queue: { payload: Payload, cb: callbackFunction }[] = [];
    iframe: HTMLIFrameElement;
    authenticated = false;
    account: string | null = null;
    network: string | null = null;
    isPortis = true;
    referrerAppOptions;

    constructor(opts: { network?: Network, appName?: string, appLogoUrl?: string, portisLocation?: string } = {}) {
        this.referrerAppOptions = {
            network: opts.network || 'ropsten',
            appHost: location.host,
            appName: opts.appName,
            appLogoUrl: opts.appLogoUrl,
            portisLocation: opts.portisLocation || 'https://app.portis.io',
        };
        this.listen();
        this.iframe = this.createIframe();
    }

    sendAsync(payload: Payload, cb: callbackFunction) {
        this.enqueue(payload, cb);
    }

    send(payload: Payload) {
        let result;

        switch (payload.method) {

            case 'eth_accounts':
                const account = this.account;
                result = account ? [account] : [];
                break;

            case 'eth_coinbase':
                result = this.account;
                break;

            case 'net_version':
                result = this.network;
                break;

            case 'eth_uninstallFilter':
                this.sendAsync(payload, (_) => _);
                result = true;
                break;

            default:
                throw new Error(`The Portis Web3 object does not support synchronous methods like ${payload.method} without a callback parameter.`);

        }

        return {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            result: result,
        }
    }

    isConnected() {
        return true;
    }

    private createIframe() {
        const iframe = document.createElement('iframe');
        const iframeStyleProps = {
            'position': 'fixed',
            'top': '20px',
            'right': '20px',
            'height': '525px',
            'width': '390px',
            'z-index': '2147483647',
            'margin-top': '0px',
            'transition': 'margin-top 0.7s',
            'box-shadow': 'rgba(0, 0, 0, 0.1) 7px 10px 60px 10px',
            'border-radius': '3px',
            'border': '1px solid #565656',
            'display': 'none',
        };
        const iframeMobileStyleProps = {
            'width': '100%',
            'height': '100%',
            'top': '0',
            'left': '0',
            'right': '0',
            'border': 'none',
            'border-radius': '0',
        };

        Object.keys(iframeStyleProps).forEach((prop: any) => iframe.style[prop] = (iframeStyleProps as any)[prop]);
        iframe.scrolling = 'no';

        if (this.isMobile()) {
            Object.keys(iframeMobileStyleProps).forEach((prop: any) => iframe.style[prop] = (iframeMobileStyleProps as any)[prop]);
        }

        iframe.id = 'PT_IFRAME';
        iframe.src = `${this.referrerAppOptions.portisLocation}/send/?p=${btoa(JSON.stringify(this.referrerAppOptions))}`;
        document.body.appendChild(iframe);
        return iframe;
    }

    private showIframe() {
        this.iframe.style.display = 'block';

        if (this.isMobile()) {
            document.body.style.overflow = 'hidden';
        }
    }

    private hideIframe() {
        this.iframe.style.display = 'none';

        if (this.isMobile()) {
            document.body.style.overflow = 'inherit';
        }
    }

    private enqueue(payload: Payload, cb: callbackFunction) {
        this.queue.push({ payload, cb });

        if (this.authenticated) {
            this.dequeue();
        } else if (this.queue.length == 1) {
            // show iframe in order to authenticate the user
            this.showIframe();
        }
    }

    private dequeue() {
        if (this.queue.length == 0) {
            return;
        }

        const { payload, cb } = this.queue.shift() as { payload: Payload, cb: callbackFunction };
        this.requests[payload.id] = { payload, cb };
        this.sendPostMessage(postMessages.PT_HANDLE_REQUEST, payload);
        this.dequeue();
    }

    private sendPostMessage(msgType: string, payload?: Object) {
        this.iframe.contentWindow.postMessage({ msgType, payload }, '*');
    }

    private listen() {
        window.addEventListener('message', (evt) => {
            if (evt.origin === this.referrerAppOptions.portisLocation) {
                switch (evt.data.msgType) {

                    case postMessages.PT_AUTHENTICATED: {
                        this.authenticated = true;
                        this.dequeue();
                        break;
                    }

                    case postMessages.PT_RESPONSE: {
                        const id = evt.data.response.id;
                        this.requests[id].cb(null, evt.data.response);

                        if (this.requests[id].payload.method === 'eth_accounts' || this.requests[id].payload.method === 'eth_coinbase') {
                            this.account = evt.data.response.result[0];
                        }

                        if (this.requests[id].payload.method === 'net_version') {
                            this.network = evt.data.response.result;
                        }

                        this.dequeue();
                        break;
                    }

                    case postMessages.PT_SHOW_IFRAME: {
                        this.showIframe();
                        break;
                    }

                    case postMessages.PT_HIDE_IFRAME: {
                        this.hideIframe();
                        break;
                    }

                    case postMessages.PT_USER_DENIED: {
                        const id = evt.data.response ? evt.data.response.id : null;

                        if (id) {
                            this.requests[id].cb(new Error('User denied transaction signature.'));
                        } else {
                            this.queue.forEach(item => item.cb(new Error('User denied transaction signature.')));
                        }

                        this.dequeue();
                        break;
                    }
                }
            }
        }, false);
    }

    private isMobile() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
}

export interface callbackFunction {
    (error: any, response?: any): void;
}

export interface Payload {
    id: number;
    jsonrpc: string;
    method: string;
    params: any[];
}

export type Network = 'mainnet' | 'ropsten' | 'kovan' | 'rinkeby';

export const postMessages = {
    PT_RESPONSE: 'PT_RESPONSE',
    PT_HANDLE_REQUEST: 'PT_HANDLE_REQUEST',
    PT_AUTHENTICATED: 'PT_AUTHENTICATED',
    PT_SHOW_IFRAME: 'PT_SHOW_IFRAME',
    PT_HIDE_IFRAME: 'PT_HIDE_IFRAME',
    PT_USER_DENIED: 'PT_USER_DENIED',
}
