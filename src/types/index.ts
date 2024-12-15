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
