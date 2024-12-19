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

export type AsyncResponse<T> =
  | SuccessResponse<T>
  | ErrorResponse
  | PendingResponse;

export interface TokenBalance {
  balanceInt?: string;
  balanceBigInt?: bigint;
}

export interface TokenInfo {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
}

export interface TokenAllowance {
  allowanceInt: string;
  allowanceBigInt: bigint;
}

export interface VaultData {
  contractName: string;
  tokens: TokensCollection<TokenInfo>;
  totalUnderlying?: [bigint, bigint];
}

export interface TokensCollection<T> {
  [key: string]: T;
}

export interface DepositTokens extends TokensCollection<string> {}

export type Address = `0x${string}`;

export enum StepType {
  Deposit = 'Deposit',
  Allowance = 'Allowance',
  Liquidity = 'Liquidity',
}
