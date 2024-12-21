import { useParams } from 'next/navigation';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

import { MyButton } from '@/components/MyButton';
import { addLiquidity } from '@/lib/contractHelpers/addLiquidity';
import { useStore } from '@/store/store';

const LiquidityForm = () => {
  const params = useParams<{ address: string }>();

  const { vault, depositValue } = useStore();
  const { address } = useAccount();

  const handleWriteContract = async () => {
    if ('data' in vault && depositValue && params?.address) {
      if (params?.address) {
        const tsx = await addLiquidity(
          depositValue,
          params.address as Address,
          address as Address,
        );
        // eslint-disable-next-line no-console
        console.log(tsx);
      }
    }
  };
  return (
    <div>
      <h1>Liquidity Form</h1>
      <MyButton onPress={handleWriteContract}>Submit</MyButton>
    </div>
  );
};

export { LiquidityForm };
