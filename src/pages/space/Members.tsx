import { Box, Button, Flex, Tag, Text } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { toast } from 'react-toastify';
import { isAddress } from '@polkadot/util-crypto';
import useContractState from '@/hooks/useContractState';
import { useCall } from '@/hooks/useink/useCall';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberRecord, MemberStatus, Pagination } from '@/types';
import { shortenAddress } from '@/utils/string';
import { pickDecoded } from 'useink/utils';

export default function Members() {
  const { membersCount, contract, isOwner } = useSpaceContext();
  const { state: page } = useContractState<Pagination<MemberRecord>>(contract, 'listMembers', [0, 50]);
  const memberStatusCall = useCall<MemberStatus>(contract, 'memberStatus');
  const grantMembershipTx = useTx(contract, 'grantMembership');

  let { items = [] } = page || {};
  // TODO add pagination

  const invite = async () => {
    const address = window.prompt('Address to invite:');
    if (!address) {
      return;
    }

    if (isAddress(address)) {
      const result = await memberStatusCall.send([address]);
      const status = pickDecoded(result);
      if (!status) {
        toast.error('Cannot check member status of the address');
        return;
      }

      if (status === MemberStatus.None) {
        grantMembershipTx.signAndSend([address, null], {}, (result) => {
          if (result?.isInBlock) {
            if (result.dispatchError) {
              toast.error(result.dispatchError.toString());
            } else {
              toast.success('Invited');
            }
          }
        });
      } else {
        toast.error('The address is already a member of the space!');
      }
    } else {
      toast.error('Invalid address format');
    }
  };

  return (
    <Box>
      <Flex justify='space-between' align='center' mb={4} gap={2}>
        <Text fontSize='xl' fontWeight='semibold'>
          Members
        </Text>
        <Flex gap={2}>
          {isOwner && (
            <Button variant='outline' size='sm' colorScheme='primary' onClick={invite}>
              Invite
            </Button>
          )}
        </Flex>
      </Flex>
      <Flex wrap='wrap' gap={2}>
        {items.map((item) => {
          const isActive = item.info.nextRenewalAt === null || item.info.nextRenewalAt > Date.now();

          return (
            <Flex
              key={item.index}
              px={4}
              py={3}
              gap={2}
              border={1}
              borderStyle='solid'
              borderColor='chakra-border-color'>
              <Identicon value={item.accountId} size={32} theme='polkadot' />
              <Flex direction='column' gap={1}>
                <Text color='gray' fontWeight='semibold'>
                  {item.info.name || shortenAddress(item.accountId)}
                </Text>
                <Box>
                  {isActive ? (
                    <Tag size='sm' variant='solid' colorScheme='green'>
                      Active
                    </Tag>
                  ) : (
                    <Tag size='sm' variant='solid' colorScheme='red'>
                      Inactive
                    </Tag>
                  )}
                </Box>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      <Flex mt={4}>
        <Flex align='center' gap={2}>
          <Text fontSize='sm'>Total members:</Text>
          <Tag size='sm'>{membersCount}</Tag>
        </Flex>
      </Flex>
    </Box>
  );
}
