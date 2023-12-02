import motherspace from '@/metadata/motherspace.json';
import { findNetwork } from '@/utils/networks';
import { useContract } from 'useink';
import { ChainId } from 'useink/chains';

export default function useMotherContract(chainId: ChainId) {
  const { motherAddress } = findNetwork(chainId);

  return useContract(motherAddress, motherspace, chainId);
}
