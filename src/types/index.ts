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

export interface TokenInfo extends TokenBalance {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  depositValue?: string;
  maxDepositValue?: number;
}

export interface TokenCollection {
  [key: string]: TokenInfo;
}

export interface TokenAllowance {
  allowanceInt: string;
  allowanceBigInt: bigint;
}

export interface TokenAllowanceBySymbol {
  [x: string]: TokenAllowance;
}

export interface TokenAllowanceReponse {
  [x: string]: AsyncResponse<bigint>;
}

export interface VaultData {
  contractName: string;
  tokens: TokenCollection;
  totalSupply: bigint;
  totalUnderlying?: [bigint, bigint];
}

export interface VaultByAddress {
  [key: string]: VaultData;
}

export type Address = `0x${string}`;

export enum StepType {
  Deposit = 'Deposit',
  Allowance = 'Allowance',
  Liquidity = 'Liquidity',
}

export interface DepositSubmitData {
  [key: string]: string;
}

export interface AllowanceToken {
  [key: string]: string;
}
