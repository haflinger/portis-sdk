import { Payload, Network } from "./types";
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
    constructor(opts: {
        apiKey: string;
        network?: Network;
        infuraApiKey?: string;
        providerNodeUrl?: string;
    });
    sendAsync(payload: Payload, cb: any): void;
    send(payload: Payload): {
        id: number;
        jsonrpc: string;
        result: any;
    };
    isConnected(): boolean;
    setDefaultEmail(email: string): void;
    showPortis(callback: any): void;
    private sendGenericPayload(method, params?, callback?);
    private createIframe();
    private showIframe();
    private hideIframe();
    private enqueue(payload, cb);
    private dequeue();
    private sendPostMessage(msgType, payload?);
    private listen();
}
