import { useBalance } from "useink";
import { formatBalance } from "@polkadot/util";
import { NetworkInfo } from "@/types";

export default function useFreeBalance(account?: { address: string | undefined }, network?: NetworkInfo): string {
  const balance = useBalance(account, network?.id);
  if (!account || !account.address || !network || !balance) {
    return '0';
  }

  return formatBalance(
    balance.freeBalance.toBigInt(),
    {
      decimals: network.decimals,
      withUnit: false,
      forceUnit: network.symbol
    }
  );
}
