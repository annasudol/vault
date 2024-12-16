export enum ChainName {
  Arbitrum = 'Arbitrum',
}

export enum TokenSymbol {
  rETH = 'rETH',
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

export interface TokenBalance {
  balanceInt?: number;
  balanceBigInt?: BigInt;
}
export interface TokenInfo extends TokenBalance {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  depositValue?: string;
}

export interface TokenKeySymbol {
  [key: string]: TokenInfo;
}

export interface VaultData {
  contractName: string;
  totalSupply?: BigInt;
  tokens: TokenKeySymbol;
}

export interface VaultByAddress {
  [key: string]: VaultData;
}

export type Address = `0x${string}`;
