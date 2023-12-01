import { Button, Flex, IconButton, SimpleGrid, Tag, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { isAddress } from '@polkadot/util-crypto';
import useContractState from '@/hooks/useContractState';
import { useCall } from '@/hooks/useink/useCall';
import { useTx } from '@/hooks/useink/useTx';
import MemberCard from '@/pages/space/MemberCard';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberRecord, MemberStatus, Pagination } from '@/types';
import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { pickDecoded } from 'useink/utils';

const RECORD_PER_PAGE = 3 * 3;

export default function Members() {
  const { membersCount, contract, isOwner } = useSpaceContext();
  const [pageIndex, setPageIndex] = useState(1);
  const { state: page } = useContractState<Pagination<MemberRecord>>(contract, 'listMembers', [
    (pageIndex - 1) * RECORD_PER_PAGE,
    RECORD_PER_PAGE,
  ]);
  const memberStatusCall = useCall<MemberStatus>(contract, 'memberStatus');
  const grantMembershipTx = useTx(contract, 'grantMembership');
  const { items = [], total } = page || {};
  const numberOfPage = total ? Math.ceil(parseInt(total) / RECORD_PER_PAGE) : 1;

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
    <Flex flexDirection='column' height={{ base: 'fit-content', md: '25rem' }}>
      <Flex justify={{ base: 'end', md: 'space-between' }} align='center' mb={4} gap={2}>
        <Text display={{ base: 'none', md: 'block' }} fontSize='xl' fontWeight='semibold'>
          Members
        </Text>
        <Flex gap={2}>
          {isOwner && (
            <>
              <Button
                display={{ base: 'none', md: 'block' }}
                variant='outline'
                size='sm'
                colorScheme='primary'
                onClick={invite}>
                Invite
              </Button>
              <IconButton
                aria-label={'Invite'}
                size='sm'
                onClick={invite}
                icon={<AddIcon />}
                display={{ base: 'block', md: 'none' }}
              />
            </>
          )}
        </Flex>
      </Flex>
      <SimpleGrid flexGrow={1} columns={{ base: 1, lg: 3 }} gap={2}>
        {items.map((item) => (
          <MemberCard key={item.index} memberRecord={item} />
        ))}
      </SimpleGrid>
      <Flex mt={4} justifyContent='space-between'>
        <Flex align='center' gap={2}>
          <Text fontSize='sm'>Total members:</Text>
          <Tag size='sm'>{membersCount}</Tag>
        </Flex>
        <Flex alignItems='center' gap={2}>
          <Text fontSize='sm'>{`Page ${pageIndex}/${numberOfPage}`}</Text>
          <IconButton
            onClick={() => setPageIndex((pre) => pre - 1)}
            aria-label='Back'
            size='sm'
            icon={<ChevronLeftIcon fontSize='1.2rem' />}
            isDisabled={pageIndex === 1}
          />
          <IconButton
            onClick={() => setPageIndex((pre) => pre + 1)}
            aria-label='Next'
            size='sm'
            icon={<ChevronRightIcon fontSize='1.2rem' />}
            isDisabled={pageIndex === numberOfPage}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
