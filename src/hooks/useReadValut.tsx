import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { isAddress } from 'viem';

import type { VaultData } from '@/lib/readVaultData';
import { readVaultData } from '@/lib/readVaultData';
import type { Response } from '@/types';
import { ResponseStatus } from '@/types';

export function useReadValut(vaultAddress: string) {
  const [response, setResponse] = useState<Response<VaultData>>({
    status: ResponseStatus.Pending,
  });

  useEffect(() => {
    if (!isAddress(vaultAddress)) {
      setResponse({
        status: ResponseStatus.Error,
        message: `The token address ${vaultAddress} is invalid.`,
      });
    } else {
      const fetchData = async () => {
        try {
          const result = await readVaultData(vaultAddress as Address);
          setResponse(result);
        } catch {
          setResponse({ status: ResponseStatus.Error });
        }
      };

      fetchData();
    }
  }, [vaultAddress]);

  return response;
}
