export enum ChainName {
  Arbitrum = 'Arbitrum',
}

export enum TokenSymbol {
  RETH = 'RETH',
  WETH = 'WETH',
}

export interface StaticData {
  vaultAddress: string;
  chain: ChainName;
  tokens: TokenSymbol[];
  stats: {
    [key: string]: {
      title: string;
      desc?: string;
    };
  };
}

export enum ResponseStatus {
  Success = 'success',
  Error = 'error',
  Pending = 'pending',
}

interface SuccessResponse<T> {
  status: ResponseStatus.Success;
  data: T;
}

interface ErrorResponse {
  status: ResponseStatus.Error;
  message?: string;
}

interface PendingResponse {
  status: ResponseStatus.Pending;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse | PendingResponse;

export interface VaultData {
  name: string;
  totalSupply?: BigInt;
  token0?: Address;
  token1?: Address;
}

export interface VaultByAddress {
  [key: string]: VaultData;
}

export type Address = `0x${string}`;
