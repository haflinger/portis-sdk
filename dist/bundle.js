(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('portis', ['exports'], factory) :
	(factory((global.Portis = {})));
}(this, (function (exports) { 'use strict';

function isMobile() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
        check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
function isLocalhost() {
    return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}
function randomId() {
    var upperBound = Math.pow(10, 7);
    var lowerBound = 1;
    return Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
}

var css = "\n.portis-wrapper {\n    display: none;\n    position: fixed;\n    top: 10px;\n    right: 20px;\n    height: 525px;\n    width: 390px;\n    border-radius: 8px;\n    z-index: 2147483647;\n    box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 40px;\n    animation: portis-entrance 250ms ease-in-out forwards;\n    opacity: 0;\n}\n\n.portis-iframe {\n    display: block;\n    width: 100%;\n    height: 100%;\n    border: none;\n    border-radius: 8px;\n}\n\n.portis-mobile-wrapper {\n    display: none;\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 2147483647;\n}\n\n.portis-mobile-iframe {\n    display: block;\n    width: 100%;\n    height: 100%;\n    border: none;\n}\n\n@keyframes portis-entrance {\n    100% { opacity: 1; top: 20px; }\n}\n";

var sdkVersion = '1.2.16';
var postMessages = {
    PT_RESPONSE: 'PT_RESPONSE',
    PT_HANDLE_REQUEST: 'PT_HANDLE_REQUEST',
    PT_GREEN_LIGHT: 'PT_GREEN_LIGHT',
    PT_SHOW_IFRAME: 'PT_SHOW_IFRAME',
    PT_HIDE_IFRAME: 'PT_HIDE_IFRAME',
    PT_USER_DENIED: 'PT_USER_DENIED',
    PT_USER_LOGGED_IN: 'PT_USER_LOGGED_IN',
    PT_PURCHASE_INITIATED: 'PT_PURCHASE_INITIATED',
    PT_ON_DATA: 'PT_ON_DATA',
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
            scope: opts.scope,
        };
        this.elements = this.createIframe();
        this.listen();
    }
    PortisProvider.prototype.sendAsync = function (payload, cb) {
        this.enqueue(payload, cb);
    };
    PortisProvider.prototype.send = function (payload, cb) {
        if (cb) {
            this.sendAsync(payload, cb);
            return;
        }
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
    PortisProvider.prototype.setDefaultEmail = function (email, editable) {
        if (editable === void 0) { editable = true; }
        this.sendGenericPayload(portisPayloadMethods.SET_DEFAULT_EMAIL, [email, editable]);
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
                wrapper.className = mobile ? 'portis-mobile-wrapper' : 'portis-wrapper';
                iframe.className = mobile ? 'portis-mobile-iframe' : 'portis-iframe';
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
            var id = Array.isArray(payload) ?
                payload.map(function (i) { return i.id; }).join(':') :
                payload.id;
            this.sendPostMessage(postMessages.PT_HANDLE_REQUEST, payload);
            this.requests[id] = { payload: payload, cb: cb };
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
                        var id = Array.isArray(evt.data.response) ?
                            evt.data.response.map(function (i) { return i.id; }).join(':') :
                            evt.data.response.id;
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
                            email: evt.data.response.email,
                        }); });
                        break;
                    }
                    case postMessages.PT_PURCHASE_INITIATED: {
                        _this.events
                            .filter(function (event) { return event.eventName == 'purchase-initiated'; })
                            .forEach(function (event) { return event.callback({
                            provider: 'portis',
                            purchaseId: evt.data.response.purchaseId,
                        }); });
                        break;
                    }
                    case postMessages.PT_ON_DATA: {
                        _this.events
                            .filter(function (event) { return event.eventName == 'data'; })
                            .forEach(function (event) { return event.callback(evt.data.response); });
                        break;
                    }
                }
            }
        }, false);
    };
    return PortisProvider;
}());

exports.PortisProvider = PortisProvider;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.js.map
