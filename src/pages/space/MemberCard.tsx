import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { MemberRecord, Props } from '@/types';
import { timestampToNum } from '@/utils/number';
import { shortenAddress } from '@/utils/string';
import moment from 'moment';

interface MemberCardProps extends Props {
  memberRecord: MemberRecord;
}

function MemberCard({ memberRecord }: MemberCardProps) {
  const { info } = memberRecord;
  const isActive = info.nextRenewalAt === null || timestampToNum(info.nextRenewalAt) > Date.now();

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
          <Text>
            {`Joined ${moment(new Date(timestampToNum(info.joinedAt)))
              .fromNow()
              .toString()}`}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}

export default MemberCard;
