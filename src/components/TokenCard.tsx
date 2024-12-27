import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react';
import { useRouter } from 'next/router';

import { ButtonIcon, MyButton } from '@/components/MyButton';
import { TokenIcon } from '@/components/TokenIcon';
import type { StaticData } from '@/types';

function TokenCard({ vaultAddress, tokens, chain, stats }: StaticData) {
  const router = useRouter();
  return (
    <Card className=" w-full max-w-xs">
      <CardHeader className="flex gap-2">
        <TokenIcon token={tokens[0]} />
        <TokenIcon token={tokens[1]} className="relative -left-5" />
        <div className="flex flex-col">
          <p className="text-md">
            {tokens[0]} / {tokens[1]} vault
          </p>
          <div className="flex items-center">
            <TokenIcon token={chain} size={15} />
            <p className="ml-1 text-small text-default-500">{chain}</p>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-2">
          {Object.keys(stats).map((item) => {
            return (
              <div key={item} className="mx-1 my-4">
                <p className="text-xs text-gray-600">{item}</p>
                <p className="text-md">{stats[item]?.title}</p>
              </div>
            );
          })}
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <MyButton
          icon={ButtonIcon.ArrowRight}
          className="w-full text-white"
          onPress={() => router.push(`/modular/${vaultAddress}`)}
        >
          Go to Valult
        </MyButton>
      </CardFooter>
    </Card>
  );
}

export { TokenCard };
