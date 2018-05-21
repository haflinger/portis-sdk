import { Payload, Network } from "./types";
import { isMobile } from "./utils";

const sdkVersion = '1.2.0';
const postMessages = {
    PT_RESPONSE: 'PT_RESPONSE',
    PT_HANDLE_REQUEST: 'PT_HANDLE_REQUEST',
    PT_AUTHENTICATED: 'PT_AUTHENTICATED',
    PT_SHOW_IFRAME: 'PT_SHOW_IFRAME',
    PT_HIDE_IFRAME: 'PT_HIDE_IFRAME',
    PT_USER_DENIED: 'PT_USER_DENIED',
}

export class PortisProvider {
    portisClient = 'https://app.portis.io';
    requests: { [id: string]: { payload: Payload, cb } } = {};
    queue: { payload: Payload, cb }[] = [];
    iframe: Promise<HTMLIFrameElement>;
    authenticated = false;
    account: string | null = null;
    network: string | null = null;
    isPortis = true;
    referrerAppOptions;

    constructor(opts: { apiKey: string, network?: Network }) {
        if (!opts.apiKey) {
            throw 'apiKey is missing. Please check your apiKey in the Portis dashboard: https://app.portis.io/dashboard';
        }

        this.referrerAppOptions = {
            sdkVersion,
            network: opts.network || 'mainnet',
            apiKey: opts.apiKey,
        };
        this.iframe = this.createIframe();
        this.listen();
    }

    sendAsync(payload: Payload, cb) {
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

    private createIframe(): Promise<HTMLIFrameElement> {
        return new Promise((resolve, reject) => {
            window.addEventListener('load', () => {
                const iframe = document.createElement('iframe');
                const iframeStyleProps = {
                    'display': 'none',
                    'position': 'fixed',
                    'top': '10px',
                    'right': '20px',
                    'height': '525px',
                    'width': '390px',
                    'z-index': '2147483647',
                    'box-shadow': '0 5px 40px rgba(0,0,0,.16)',
                    'border-radius': '8px',
                    'border': 'none',
                    'animation': 'portis-entrance 250ms ease-in-out forwards',
                    'opacity': '0',
                };
                const iframeMobileStyleProps = {
                    'display': 'none',
                    'position': 'fixed',
                    'z-index': '2147483647',
                    'width': '100%',
                    'height': '100%',
                    'top': '0',
                    'left': '0',
                    'right': '0',
                    'border': 'none',
                };
                const style = document.createElement('style');
                style.innerHTML = '@keyframes portis-entrance { 100% { opacity: 1; top: 20px; } }';

                if (isMobile()) {
                    Object.keys(iframeMobileStyleProps).forEach((prop: any) => iframe.style[prop] = (iframeMobileStyleProps as any)[prop]);
                } else {
                    Object.keys(iframeStyleProps).forEach((prop: any) => iframe.style[prop] = (iframeStyleProps as any)[prop]);
                }

                iframe.scrolling = 'no';
                iframe.id = 'PT_IFRAME';
                iframe.src = `${this.portisClient}/send/?p=${btoa(JSON.stringify(this.referrerAppOptions))}`;
                document.body.appendChild(iframe);
                document.head.appendChild(style);
                resolve(iframe);
            }, false);
        });
    }

    private showIframe() {
        this.iframe.then(iframe => {
            iframe.style.display = 'block'

            if (isMobile()) {
                document.body.style.overflow = 'hidden';
            }
        });
    }

    private hideIframe() {
        this.iframe.then(iframe => {
            iframe.style.display = 'none';

            if (isMobile()) {
                document.body.style.overflow = 'inherit';
            }
        });
    }

    private enqueue(payload: Payload, cb) {
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

        const item = this.queue.shift();

        if (item) {
            const payload = item.payload;
            const cb = item.cb;
            this.sendPostMessage(postMessages.PT_HANDLE_REQUEST, payload);
            this.requests[payload.id] = { payload, cb };
            this.dequeue();
        }
    }

    private sendPostMessage(msgType: string, payload?: Object) {
        this.iframe.then(iframe => {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({ msgType, payload }, '*');
            }
        });
    }

    private listen() {
        window.addEventListener('message', (evt) => {
            if (evt.origin === this.portisClient) {
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
}
