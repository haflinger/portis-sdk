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
    iframe: Promise<HTMLIFrameElement>;
    authenticated: boolean;
    account: string | null;
    network: string | null;
    isPortis: boolean;
    referrerAppOptions: any;
    constructor(opts: {
        apiKey: string;
        network?: Network;
    });
    sendAsync(payload: Payload, cb: any): void;
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
}
