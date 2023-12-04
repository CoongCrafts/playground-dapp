import useSpaceContract from '@/hooks/contracts/useSpaceContract';
import useContractState from '@/hooks/useContractState';
import { useWalletContext } from '@/providers/WalletProvider';
import { MemberInfo, MembershipRequest, MemberStatus, OnChainSpace, SpaceConfig, SpaceInfo } from '@/types';
import { stringToNum } from '@/utils/number';

export default function useSpace(space: OnChainSpace) {
  const spaceContract = useSpaceContract(space);
  const { selectedAccount } = useWalletContext();

  const { state: info } = useContractState<SpaceInfo>(spaceContract, 'info');
  const { state: membersCountStr } = useContractState<string>(spaceContract, 'membersCount');
  const { state: memberStatus } = useContractState<MemberStatus>(spaceContract, 'memberStatus', [
    selectedAccount?.address,
  ]);
  const { state: config } = useContractState<SpaceConfig>(spaceContract, 'config');
  const { state: codeHash } = useContractState<string>(spaceContract, 'upgradeable::codeHash');
  const { state: ownerId } = useContractState<string>(spaceContract, 'ownerId');
  const { state: memberInfo } = useContractState<MemberInfo>(spaceContract, 'memberInfo', [selectedAccount?.address]);
  const { state: pendingRequest } = useContractState<MembershipRequest>(spaceContract, 'pendingRequestFor', [
    selectedAccount?.address,
  ]);

  return {
    info,
    config,
    membersCount: stringToNum(membersCountStr),
    codeHash,
    ownerId,
    memberStatus,
    memberInfo,
    pendingRequest,
  };
}
