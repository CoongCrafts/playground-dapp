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
    <Flex
      p={2}
      gap={2}
      height='6rem'
      border={1}
      borderStyle='solid'
      borderColor='chakra-border-color'
      alignItems='center'>
      <Flex direction='column' flexShrink={0} gap={2} alignItems='center' width='25%'>
        <Identicon value={memberRecord.accountId} size={32} theme='polkadot' />
        <Badge fontSize='0.60rem' variant='solid' colorScheme={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      </Flex>
      <Box alignSelf='start'>
        <Text fontSize='0.8rem' color='dimgray' fontWeight='semibold' wordBreak='break-word'>
          {info.name || shortenAddress(memberRecord.accountId)}
        </Text>
        <Box color='darkgray' fontSize='0.75rem'>
          <Text>{info.name && shortenAddress(memberRecord.accountId)}</Text>
          <Text>{`Joined ${fromNow(info.joinedAt.toString())}`}</Text>
        </Box>
      </Box>
    </Flex>
  );
}

export default MemberCard;
