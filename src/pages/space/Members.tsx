import { Box, Flex, Tag, Text } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import useContractState from '@/hooks/useContractState';
import InviteMemberButton from '@/pages/space/InviteMemberButton';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberRecord, Pagination } from '@/types';
import { shortenAddress } from '@/utils/string';

export default function Members() {
  const { membersCount, contract, isOwner } = useSpaceContext();
  const { state: page } = useContractState<Pagination<MemberRecord>>(contract, 'listMembers', [0, 50]);

  let { items = [] } = page || {};
  // TODO add pagination

  return (
    <Box>
      <Flex justify='space-between' align='center' mb={4} gap={2}>
        <Text fontSize='xl' fontWeight='semibold'>
          Members
        </Text>
        <Flex gap={2}>{isOwner && <InviteMemberButton />}</Flex>
      </Flex>
      <Flex wrap='wrap' gap={2}>
        {items.map((item) => {
          const isActive =
            item.info.nextRenewalAt === null ||
            parseInt(item.info.nextRenewalAt.toString().replaceAll(',', '')) > Date.now();
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
                  {shortenAddress(item.accountId)}
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
