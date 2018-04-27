declare global  {
    interface Window {
        opera: any;
    }
}
export declare class Provider {
    requests: {
        [id: string]: {
            payload: Payload;
            cb: callbackFunction;
        };
    };
    queue: {
        payload: Payload;
        cb: callbackFunction;
    }[];
    iframe: HTMLIFrameElement;
    authenticated: boolean;
    account: string | null;
    network: string | null;
    isPortis: boolean;
    referrerAppOptions: any;
    constructor(opts?: {
        network?: Network;
        appName?: string;
        appLogoUrl?: string;
        portisLocation?: string;
    });
    sendAsync(payload: Payload, cb: callbackFunction): void;
    send(payload: Payload): {
        id: number;
        jsonrpc: string;
        result: any;
    };
    isConnected(): boolean;
    private createIframe();
    private showIframe();
    private hideIframe();
    private enqueue(payload, cb);
    private dequeue();
    private sendPostMessage(msgType, payload?);
    private listen();
    private isMobile();
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
export declare type Network = 'mainnet' | 'ropsten' | 'kovan' | 'rinkeby';
export declare const postMessages: {
    PT_RESPONSE: string;
    PT_HANDLE_REQUEST: string;
    PT_AUTHENTICATED: string;
    PT_SHOW_IFRAME: string;
    PT_HIDE_IFRAME: string;
    PT_USER_DENIED: string;
};
