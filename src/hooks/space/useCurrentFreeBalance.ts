import useFreeBalance from '@/hooks/useFreeBalance';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { useWalletContext } from '@/providers/WalletProvider';
import { stringToNum } from '@/utils/number';

export default function useCurrentFreeBalance() {
  const { space } = useSpaceContext();
  const { selectedAccount } = useWalletContext();
  return stringToNum(useFreeBalance(selectedAccount, space.chainId)) as number;
}
