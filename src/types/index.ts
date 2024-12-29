export enum ChainName {
  Arbitrum = 'Arbitrum',
}

export enum TokenSymbol {
  rETH = 'rETH',
  WETH = 'WETH',
  USDC = 'USDC',
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
  ratio: number;
}

export interface TokensCollection<T> {
  [key: string]: T;
}

export interface DepositValue {
  int?: string;
  bigInt?: bigint;
}

export interface DepositTokens extends TokensCollection<DepositValue> {}

export interface TokenDeposit {
  deposit?: string;
}

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
