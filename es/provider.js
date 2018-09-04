import { isMobile, isLocalhost, randomId } from "./utils";
import { css } from './style';
var sdkVersion = '1.2.10';
var postMessages = {
    PT_RESPONSE: 'PT_RESPONSE',
    PT_HANDLE_REQUEST: 'PT_HANDLE_REQUEST',
    PT_GREEN_LIGHT: 'PT_GREEN_LIGHT',
    PT_SHOW_IFRAME: 'PT_SHOW_IFRAME',
    PT_HIDE_IFRAME: 'PT_HIDE_IFRAME',
    PT_USER_DENIED: 'PT_USER_DENIED',
    PT_USER_LOGGED_IN: 'PT_USER_LOGGED_IN',
};
var portisPayloadMethods = {
    SET_DEFAULT_EMAIL: 'SET_DEFAULT_EMAIL',
    SHOW_PORTIS: 'SHOW_PORTIS',
};
var PortisProvider = /** @class */ (function () {
    function PortisProvider(opts) {
        this.portisClient = 'https://app.portis.io';
        this.requests = {};
        this.queue = [];
        this.account = null;
        this.network = null;
        this.isPortis = true;
        this.events = [];
        if (!isLocalhost() && !opts.apiKey) {
            throw 'apiKey is missing. Please check your apiKey in the Portis dashboard: https://app.portis.io/dashboard';
        }
        if (opts.infuraApiKey && opts.providerNodeUrl) {
            throw 'Invalid parameters. \'infuraApiKey\' and \'providerNodeUrl\' cannot be both provided. Refer to the Portis documentation for more info.';
        }
        this.referrerAppOptions = {
            sdkVersion: sdkVersion,
            network: opts.network || 'mainnet',
            apiKey: opts.apiKey,
            infuraApiKey: opts.infuraApiKey,
            providerNodeUrl: opts.providerNodeUrl,
        };
        this.elements = this.createIframe();
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
    PortisProvider.prototype.setDefaultEmail = function (email) {
        this.sendGenericPayload(portisPayloadMethods.SET_DEFAULT_EMAIL, [email]);
    };
    PortisProvider.prototype.showPortis = function (callback) {
        this.sendGenericPayload(portisPayloadMethods.SHOW_PORTIS, [], callback);
    };
    PortisProvider.prototype.on = function (eventName, callback) {
        this.events.push({ eventName: eventName, callback: callback });
    };
    PortisProvider.prototype.sendGenericPayload = function (method, params, callback) {
        if (params === void 0) { params = []; }
        if (callback === void 0) { callback = function (_) { return _; }; }
        var payload = {
            id: randomId(),
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        this.enqueue(payload, callback);
    };
    PortisProvider.prototype.createIframe = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var onload = function () {
                var mobile = isMobile();
                var wrapper = document.createElement('div');
                var iframe = document.createElement('iframe');
                var styleElem = document.createElement('style');
                var viewportMetaTag = document.createElement('meta');
                wrapper.className = mobile ? 'mobile-wrapper' : 'wrapper';
                iframe.className = mobile ? 'mobile-iframe' : 'iframe';
                iframe.src = _this.portisClient + "/send/?p=" + btoa(JSON.stringify(_this.referrerAppOptions));
                styleElem.innerHTML = css;
                viewportMetaTag.name = 'viewport';
                viewportMetaTag.content = 'width=device-width, initial-scale=1';
                wrapper.appendChild(iframe);
                document.body.appendChild(wrapper);
                document.head.appendChild(styleElem);
                _this.portisViewportMetaTag = viewportMetaTag;
                _this.dappViewportMetaTag = _this.getDappViewportMetaTag();
                resolve({ wrapper: wrapper, iframe: iframe });
            };
            if (['loaded', 'interactive', 'complete'].indexOf(document.readyState) > -1) {
                onload();
            }
            else {
                window.addEventListener('load', onload.bind(_this), false);
            }
        });
    };
    PortisProvider.prototype.showIframe = function () {
        var _this = this;
        this.elements.then(function (elements) {
            elements.wrapper.style.display = 'block';
            if (isMobile()) {
                document.body.style.overflow = 'hidden';
                _this.setPortisViewport();
            }
        });
    };
    PortisProvider.prototype.hideIframe = function () {
        var _this = this;
        this.elements.then(function (elements) {
            elements.wrapper.style.display = 'none';
            if (isMobile()) {
                document.body.style.overflow = 'inherit';
                _this.setDappViewport();
            }
        });
    };
    PortisProvider.prototype.getDappViewportMetaTag = function () {
        var metaTags = document.head.querySelectorAll('meta[name=viewport]');
        return metaTags.length ? metaTags[metaTags.length - 1] : null;
    };
    PortisProvider.prototype.setPortisViewport = function () {
        document.head.appendChild(this.portisViewportMetaTag);
        if (this.dappViewportMetaTag) {
            this.dappViewportMetaTag.remove();
        }
    };
    PortisProvider.prototype.setDappViewport = function () {
        if (this.portisViewportMetaTag) {
            this.portisViewportMetaTag.remove();
        }
        if (this.dappViewportMetaTag) {
            document.head.appendChild(this.dappViewportMetaTag);
        }
    };
    PortisProvider.prototype.enqueue = function (payload, cb) {
        this.queue.push({ payload: payload, cb: cb });
        if (this.iframeReady) {
            this.dequeue();
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
        this.elements.then(function (elements) {
            if (elements.iframe.contentWindow) {
                elements.iframe.contentWindow.postMessage({ msgType: msgType, payload: payload }, '*');
            }
        });
    };
    PortisProvider.prototype.listen = function () {
        var _this = this;
        window.addEventListener('message', function (evt) {
            if (evt.origin === _this.portisClient) {
                switch (evt.data.msgType) {
                    case postMessages.PT_GREEN_LIGHT: {
                        _this.iframeReady = true;
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
                    case postMessages.PT_USER_LOGGED_IN: {
                        _this.events
                            .filter(function (event) { return event.eventName == 'login'; })
                            .forEach(function (event) { return event.callback({
                            provider: 'portis',
                            address: evt.data.response.address,
                        }); });
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