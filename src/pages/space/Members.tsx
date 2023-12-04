import { Box, Flex, IconButton, SimpleGrid, Tag, Text } from '@chakra-ui/react';
import { useState } from 'react';
import useContractState from '@/hooks/useContractState';
import MemberCard from '@/pages/space/MemberCard';
import InviteMemberButton from '@/pages/space/actions/InviteMemberButton';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberRecord, Pagination } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const RECORD_PER_PAGE = 3 * 3;

export default function Members() {
  const { membersCount, contract, isOwner } = useSpaceContext();
  const [pageIndex, setPageIndex] = useState(1);
  const { state: page } = useContractState<Pagination<MemberRecord>>(contract, 'listMembers', [
    (pageIndex - 1) * RECORD_PER_PAGE,
    RECORD_PER_PAGE,
  ]);
  const { items = [], total } = page || {};
  const numberOfPage = total ? Math.ceil(parseInt(total) / RECORD_PER_PAGE) : 1;

  return (
    <Flex flexDirection='column'>
      <Flex align='center' mb={4} gap={2} justify={'space-between'}>
        <Flex gap={2} align='center'>
          <Text fontSize='xl' fontWeight='semibold'>
            Members
          </Text>
          <Box>
            <Tag>{membersCount}</Tag>
          </Box>
        </Flex>
        {isOwner && <InviteMemberButton />}
      </Flex>
      <SimpleGrid flexGrow={1} columns={{ base: 1, lg: 2 }} gap={2}>
        {items.map((item) => (
          <MemberCard key={item.index} memberRecord={item} />
        ))}
      </SimpleGrid>
      <Flex mt={4} justifyContent='space-between' align='center'>
        <Text fontSize='sm'>{`Page ${pageIndex} / ${numberOfPage}`}</Text>
        <Flex alignItems='center' gap={2}>
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
