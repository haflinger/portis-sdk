export interface Payload {
    id: number;
    jsonrpc: string;
    method: string;
    params: any[];
}
export declare type Network = 'mainnet' | 'ropsten' | 'kovan' | 'rinkeby' | 'core' | 'sokol';
export declare type ScopeType = 'email';
