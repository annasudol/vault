import { cn, Image } from '@nextui-org/react';

import { ChainName, TokenSymbol } from '@/types';

const tokenIcons: Record<TokenSymbol | ChainName, string> = {
  [TokenSymbol.USDC]: '/assets/USDC.svg',
  [TokenSymbol.WETH]: '/assets/ETH.png',
  [TokenSymbol.rETH]: '/assets/rETH.svg',
  [TokenSymbol.wstETH]: '/assets/wstETH.png',
  [ChainName.Arbitrum]: '/assets/arbitrum.png',
};

interface TokenIconProps {
  token?: TokenSymbol | ChainName | string;
  className?: string;
  size?: number;
}

export function TokenIcon({ token, className, size = 50 }: TokenIconProps) {
  if (!token) {
    return null;
  }
  if (
    typeof token === 'string' &&
    !tokenIcons[token as TokenSymbol | ChainName]
  ) {
    return (
      <div
        style={{
          width: size,
          height: size,
        }}
        className={`flex items-center justify-center rounded-full border-2 border-gray-700 bg-gray-100 ${className}`}
      >
        <span style={{ fontSize: size / 3 }}>?</span>
      </div>
    );
  }
  return (
    <Image
      alt={`${token}'s icon`}
      src={tokenIcons[token as TokenSymbol | ChainName]}
      width={size}
      height={size}
      className={cn(className, 'rounded-full bg-white')}
    />
  );
}
