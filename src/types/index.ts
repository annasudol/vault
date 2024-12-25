export enum ChainName {
  Arbitrum = 'Arbitrum',
}

export enum TokenSymbol {
  rETH = 'rETH',
  WETH = 'WETH',
  wstETH = 'wstETH',
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
  address?: Address;
  symbol?: string;
  decimals?: number;
}

export interface VaultData {
  contractName: string;
  tokens: TokensCollection<TokenInfo>;
  totalUnderlying: [bigint, bigint];
}

export interface VaultCollection<T> {
  [key: Address]: T;
}

export interface TokensCollection<T> {
  [key: string]: T;
}

export interface TokenValue {
  int?: string;
  bigInt?: bigint;
}

export interface DepositTokens extends TokensCollection<TokenValue> {}

export interface TokenDeposit {
  depositValue: string;
  maxDepositValue?: number;
}

export type TokenAllowanceResponse = AsyncResponse<string>;

export type Address = `0x${string}`;

export type TxHash = `0x${string}`;

export enum StepType {
  Deposit = 'Deposit',
  Allowance = 'Allowance',
  Liquidity = 'Liquidity',
}

export interface CallContractStatus {
  isLoading: boolean;
  isError: boolean;
  isSuccess?: boolean;
}
