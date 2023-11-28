import { useContract } from "useink";
import spaceMetadata from '@/metadata/space.json';
import { OnChainSpace } from "@/types";

export default function useSpaceContract(space: OnChainSpace) {
  return useContract(space.address, spaceMetadata, space.chainId);
}
