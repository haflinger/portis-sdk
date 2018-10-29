import { Payload, Network, ScopeType } from "./types";
export declare class PortisProvider {
    portisClient: string;
    requests: {
        [id: string]: {
            payload: Payload;
            cb;
        };
    };
    queue: {
        payload: Payload;
        cb;
    }[];
    elements: Promise<{
        wrapper: HTMLDivElement;
        iframe: HTMLIFrameElement;
    }>;
    iframeReady: boolean;
    account: string | null;
    network: string | null;
    isPortis: boolean;
    referrerAppOptions: any;
    events: {
        eventName: string;
        callback;
    }[];
    portisViewportMetaTag: any;
    dappViewportMetaTag: any;
    constructor(opts: {
        apiKey: string;
        network?: Network;
        infuraApiKey?: string;
        providerNodeUrl?: string;
        scope?: ScopeType[];
    });
    sendAsync(payload: Payload, cb: any): void;
    send(payload: Payload, cb?: any): {
        id: number;
        jsonrpc: string;
        result: any;
    } | undefined;
    isConnected(): boolean;
    setDefaultEmail(email: string, editable?: boolean): void;
    showPortis(callback: any): void;
    on(eventName: string, callback: any): void;
    enable(): Promise<{}>;
    private sendGenericPayload(method, params?, callback?);
    private createIframe();
    private showIframe();
    private hideIframe();
    private getDappViewportMetaTag();
    private setPortisViewport();
    private setDappViewport();
    private enqueue(payload, cb);
    private dequeue();
    private sendPostMessage(msgType, payload?);
    private listen();
}
