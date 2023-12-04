import { formatBalance } from '@polkadot/util';
import { NetworkInfo } from '@/types';
import { findNetwork } from '@/utils/networks';
import { useBalance } from 'useink';
import { ChainId } from 'useink/chains';

export default function useFreeBalance(
  account?: { address: string | undefined },
  network?: NetworkInfo | ChainId,
): string {
  if (typeof network === 'string') {
    network = findNetwork(network as ChainId);
  }

  const balance = useBalance(account, network?.id);
  if (!account || !account.address || !network || !balance) {
    return '0';
  }

  return formatBalance(balance.freeBalance.toBigInt(), {
    decimals: network.decimals,
    withUnit: false,
    forceUnit: network.symbol,
  });
}
