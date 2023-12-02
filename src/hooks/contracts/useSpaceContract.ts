import spaceMetadata from '@/metadata/space.json';
import { OnChainSpace } from '@/types';
import { useContract } from 'useink';

export default function useSpaceContract(space: OnChainSpace) {
  return useContract(space.address, spaceMetadata, space.chainId);
}
