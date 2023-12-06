import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import SpaceAvatar from '@/components/space/SpaceAvatar';
import useSpace from '@/hooks/useSpace';
import CancelRequestButton from '@/pages/space/actions/CancelRequestButton';
import JoinButton from '@/pages/space/actions/JoinButton';
import SpaceProvider from '@/providers/SpaceProvider';
import { OnChainSpace, Props, RegistrationType, SpaceId } from '@/types';
import pluralize from 'pluralize';
import { ChainId } from 'useink/chains';

interface SpaceCardProps extends Props {
  spaceId: SpaceId;
  chainId: ChainId;
}

export default function SpaceCard({ spaceId, chainId }: SpaceCardProps) {
  const navigate = useNavigate();
  const space = { address: spaceId, chainId } as OnChainSpace;
  const { info, config, membersCount, pendingRequest } = useSpace(space);

  const showJoinButton = config?.registration !== RegistrationType.InviteOnly;

  if (!info) return null;

  return (
    <SpaceProvider space={space}>
      <Flex
        flexDir='column'
        alignItems='center'
        textAlign='center'
        border='1px'
        borderColor='chakra-border-color'
        p={4}
        borderRadius={4}
        transitionDuration='200ms'
        _hover={{ borderColor: 'gray.400' }}
        cursor='pointer'
        onClick={() => navigate(`/${space.chainId}/spaces/${space.address}`)}>
        <Heading mb={4} size='md' noOfLines={1}>
          {info?.name}
        </Heading>
        {info && <SpaceAvatar info={info} space={space} />}

        <Text fontSize='sm' fontWeight='semibold' mt={4}>
          {membersCount} {pluralize('member', membersCount)}
        </Text>
        <Box mt={3}>
          {showJoinButton ? (
            pendingRequest ? (
              <CancelRequestButton buttonProps={{ width: 'fit-content' }} />
            ) : (
              <JoinButton />
            )
          ) : (
            <Button size='sm' isDisabled>
              Invite Only
            </Button>
          )}
        </Box>
      </Flex>
    </SpaceProvider>
  );
}
