import { Link } from '@nextui-org/react';

import { ChainName } from '@/types';

const transactionLink: Record<ChainName, string> = {
  [ChainName.Arbitrum]: 'https://arbiscan.io/tx/',
};

interface TxLinkProps {
  txHash: string;
  chain?: ChainName;
}

export function TxLink({ txHash, chain = ChainName.Arbitrum }: TxLinkProps) {
  const tokenLink = transactionLink[chain] + txHash;
  return <Link href={tokenLink}>Transaction dedails</Link>;
}
