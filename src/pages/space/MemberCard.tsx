import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { MemberRecord, Props } from '@/types';
import { fromNow, now, timestampToDate } from '@/utils/date';
import { shortenAddress } from '@/utils/string';

interface MemberCardProps extends Props {
  memberRecord: MemberRecord;
}

function MemberCard({ memberRecord }: MemberCardProps) {
  const { info } = memberRecord;
  const isActive = info.nextRenewalAt === null || timestampToDate(info.nextRenewalAt.toString()) > now();

  return (
    <Flex p={2} gap={2} border={1} borderStyle='solid' borderColor='chakra-border-color' alignItems='center'>
      <Flex px={2} gap={2} alignItems='center'>
        <Identicon value={memberRecord.accountId} size={30} theme='polkadot' />
      </Flex>
      <Box>
        <Flex align='center' gap={2}>
          <Text noOfLines={1} fontSize='1rem' color='dimgray' fontWeight='semibold' wordBreak='break-word'>
            {info.name || shortenAddress(memberRecord.accountId)}
          </Text>
          <Box>
            <Badge fontSize='0.60rem' mb={1} variant='solid' colorScheme={isActive ? 'green' : 'red'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </Box>
        </Flex>
        <Flex gap={2} color='darkgray' fontSize='xs'>
          {info.name && (
            <>
              <Text fontWeight='semibold'>{shortenAddress(memberRecord.accountId)}</Text>
              <Text>•</Text>
            </>
          )}
          <Text>{`Joined ${fromNow(info.joinedAt.toString())}`}</Text>
        </Flex>
      </Box>
    </Flex>
  );
}

export default MemberCard;