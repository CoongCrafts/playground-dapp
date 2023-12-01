import { Box, Flex, Tag, Text } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import useContractState from '@/hooks/useContractState';
import InviteMemberButton from '@/pages/space/InviteMemberButton';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberRecord, Pagination } from '@/types';
import { numToDecimalPointRemovedNum } from '@/utils/number';
import { shortenAddress } from '@/utils/string';

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
    <Box>
      <Flex justify='space-between' align='center' mb={4} gap={2}>
        <Text fontSize='xl' fontWeight='semibold'>
          Members
        </Text>
        <Flex gap={2}>{isOwner && <InviteMemberButton />}</Flex>
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
      <Flex wrap='wrap' gap={2}>
        {items.map((item) => {
          const isActive =
            item.info.nextRenewalAt === null || numToDecimalPointRemovedNum(item.info.nextRenewalAt) > Date.now();
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
