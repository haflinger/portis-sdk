export interface Payload {
    id: number;
    jsonrpc: string;
    method: string;
    params: any[];
}

export type Network = 'mainnet' | 'ropsten' | 'kovan' | 'rinkeby' | 'core' | 'sokol';
export type ScopeType = 'email';
