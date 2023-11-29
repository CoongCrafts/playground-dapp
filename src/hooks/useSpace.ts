import useSpaceContract from "@/hooks/contracts/useSpaceContract";
import useContractState from "@/hooks/useContractState";
import { MemberStatus, OnChainSpace, SpaceConfig, SpaceInfo } from "@/types";
import { useWalletContext } from "@/providers/WalletProvider";
import { stringToNum } from "@/utils/number";

export default function useSpace(space: OnChainSpace) {
  const spaceContract = useSpaceContract(space);
  const { selectedAccount } = useWalletContext();

  const { state: info } = useContractState<SpaceInfo>(spaceContract, 'info');
  const { state: membersCountStr } = useContractState<string>(spaceContract, 'membersCount');
  const { state: memberStatus } = useContractState<MemberStatus>(spaceContract, 'memberStatus', [selectedAccount?.address]);
  const { state: config } = useContractState<SpaceConfig>(spaceContract, 'config');
  const { state: codeHash } = useContractState<string>(spaceContract, 'upgradeable::codeHash');
  const { state: ownerId } = useContractState<string>(spaceContract, 'ownerId');


  return {info, config, membersCount: stringToNum(membersCountStr), codeHash, ownerId, memberStatus}
}
