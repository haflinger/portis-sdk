import { isMobile } from "./utils";
var sdkVersion = '1.2.0';
var postMessages = {
    PT_RESPONSE: 'PT_RESPONSE',
    PT_HANDLE_REQUEST: 'PT_HANDLE_REQUEST',
    PT_AUTHENTICATED: 'PT_AUTHENTICATED',
    PT_SHOW_IFRAME: 'PT_SHOW_IFRAME',
    PT_HIDE_IFRAME: 'PT_HIDE_IFRAME',
    PT_USER_DENIED: 'PT_USER_DENIED',
};
var PortisProvider = /** @class */ (function () {
    function PortisProvider(opts) {
        this.portisClient = 'https://app.portis.io';
        this.requests = {};
        this.queue = [];
        this.authenticated = false;
        this.account = null;
        this.network = null;
        this.isPortis = true;
        if (!opts.apiKey) {
            throw 'apiKey is missing. Please check your apiKey in the Portis dashboard: https://app.portis.io/dashboard';
        }
        this.referrerAppOptions = {
            sdkVersion: sdkVersion,
            network: opts.network || 'mainnet',
            apiKey: opts.apiKey,
        };
        this.iframe = this.createIframe();
        this.listen();
    }
    PortisProvider.prototype.sendAsync = function (payload, cb) {
        this.enqueue(payload, cb);
    };
    PortisProvider.prototype.send = function (payload) {
        var result;
        switch (payload.method) {
            case 'eth_accounts':
                var account = this.account;
                result = account ? [account] : [];
                break;
            case 'eth_coinbase':
                result = this.account;
                break;
            case 'net_version':
                result = this.network;
                break;
            case 'eth_uninstallFilter':
                this.sendAsync(payload, function (_) { return _; });
                result = true;
                break;
            default:
                throw new Error("The Portis Web3 object does not support synchronous methods like " + payload.method + " without a callback parameter.");
        }
        return {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            result: result,
        };
    };
    PortisProvider.prototype.isConnected = function () {
        return true;
    };
    PortisProvider.prototype.createIframe = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            window.addEventListener('load', function () {
                var iframe = document.createElement('iframe');
                var iframeStyleProps = {
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
                var iframeMobileStyleProps = {
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
                var style = document.createElement('style');
                style.innerHTML = '@keyframes portis-entrance { 100% { opacity: 1; top: 20px; } }';
                if (isMobile()) {
                    Object.keys(iframeMobileStyleProps).forEach(function (prop) { return iframe.style[prop] = iframeMobileStyleProps[prop]; });
                }
                else {
                    Object.keys(iframeStyleProps).forEach(function (prop) { return iframe.style[prop] = iframeStyleProps[prop]; });
                }
                iframe.scrolling = 'no';
                iframe.id = 'PT_IFRAME';
                iframe.src = _this.portisClient + "/send/?p=" + btoa(JSON.stringify(_this.referrerAppOptions));
                document.body.appendChild(iframe);
                document.head.appendChild(style);
                resolve(iframe);
            }, false);
        });
    };
    PortisProvider.prototype.showIframe = function () {
        this.iframe.then(function (iframe) {
            iframe.style.display = 'block';
            if (isMobile()) {
                document.body.style.overflow = 'hidden';
            }
        });
    };
    PortisProvider.prototype.hideIframe = function () {
        this.iframe.then(function (iframe) {
            iframe.style.display = 'none';
            if (isMobile()) {
                document.body.style.overflow = 'inherit';
            }
        });
    };
    PortisProvider.prototype.enqueue = function (payload, cb) {
        this.queue.push({ payload: payload, cb: cb });
        if (this.authenticated) {
            this.dequeue();
        }
        else if (this.queue.length == 1) {
            // show iframe in order to authenticate the user
            this.showIframe();
        }
    };
    PortisProvider.prototype.dequeue = function () {
        if (this.queue.length == 0) {
            return;
        }
        var item = this.queue.shift();
        if (item) {
            var payload = item.payload;
            var cb = item.cb;
            this.sendPostMessage(postMessages.PT_HANDLE_REQUEST, payload);
            this.requests[payload.id] = { payload: payload, cb: cb };
            this.dequeue();
        }
    };
    PortisProvider.prototype.sendPostMessage = function (msgType, payload) {
        this.iframe.then(function (iframe) {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({ msgType: msgType, payload: payload }, '*');
            }
        });
    };
    PortisProvider.prototype.listen = function () {
        var _this = this;
        window.addEventListener('message', function (evt) {
            if (evt.origin === _this.portisClient) {
                switch (evt.data.msgType) {
                    case postMessages.PT_AUTHENTICATED: {
                        _this.authenticated = true;
                        _this.dequeue();
                        break;
                    }
                    case postMessages.PT_RESPONSE: {
                        var id = evt.data.response.id;
                        _this.requests[id].cb(null, evt.data.response);
                        if (_this.requests[id].payload.method === 'eth_accounts' || _this.requests[id].payload.method === 'eth_coinbase') {
                            _this.account = evt.data.response.result[0];
                        }
                        if (_this.requests[id].payload.method === 'net_version') {
                            _this.network = evt.data.response.result;
                        }
                        _this.dequeue();
                        break;
                    }
                    case postMessages.PT_SHOW_IFRAME: {
                        _this.showIframe();
                        break;
                    }
                    case postMessages.PT_HIDE_IFRAME: {
                        _this.hideIframe();
                        break;
                    }
                    case postMessages.PT_USER_DENIED: {
                        var id = evt.data.response ? evt.data.response.id : null;
                        if (id) {
                            _this.requests[id].cb(new Error('User denied transaction signature.'));
                        }
                        else {
                            _this.queue.forEach(function (item) { return item.cb(new Error('User denied transaction signature.')); });
                        }
                        _this.dequeue();
                        break;
                    }
                }
            }
        }, false);
    };
    return PortisProvider;
}());
export { PortisProvider };
//# sourceMappingURL=provider.js.map