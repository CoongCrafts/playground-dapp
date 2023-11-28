import { useContract } from "useink";
import motherspace from '@/metadata/motherspace.json';
import { ChainId } from "useink/chains";
import { findNetwork } from "@/utils/networks";

export default function useMotherContract(chainId: ChainId) {
  const { motherAddress } = findNetwork(chainId);

  return useContract(motherAddress, motherspace, chainId);
}
