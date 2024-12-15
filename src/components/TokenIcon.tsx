import { Image } from '@nextui-org/react';

import { ChainName, TokenSymbol } from '@/types';

const tokenIcons: Record<TokenSymbol | ChainName, string> = {
  [TokenSymbol.WETH]: '/assets/wETH.png',
  [TokenSymbol.RETH]: '/assets/rETH.svg',
  [ChainName.Arbitrum]: '/assets/arbitrum.png',
};

interface TokenIconProps {
  token?: TokenSymbol | ChainName;
  className?: string;
  size?: number;
}

export function TokenIcon({ token, className, size = 50 }: TokenIconProps) {
  if (!token) {
    return null;
  }
  return (
    <Image
      alt={`${token}'s icon`}
      src={tokenIcons[token]}
      width={size}
      height={size}
      className={className}
    />
  );
}
