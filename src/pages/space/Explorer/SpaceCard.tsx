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
        gap={3}
        py={6}
        borderRadius={4}
        transitionDuration='200ms'
        _hover={{ borderColor: 'gray.400' }}
        cursor='pointer'
        onClick={() => navigate(`/${space.chainId}/spaces/${space.address}`)}>
        <SpaceAvatar info={info!} space={space} />
        <Box>
          <Heading size='md' mb={1}>
            {info?.name}
          </Heading>
          <Text fontWeight='semibold' fontSize='md' color='gray'>
            {membersCount} {pluralize('member', membersCount)}
          </Text>
        </Box>
        {showJoinButton ? (
          pendingRequest ? (
            <CancelRequestButton buttonProps={{ size: 'md', width: 'fit-content' }} />
          ) : (
            <JoinButton buttonProps={{ variant: 'outline', colorScheme: 'gray', size: 'md', _disabled: {} }} />
          )
        ) : (
          <Button isDisabled>Invite only</Button>
        )}
      </Flex>
    </SpaceProvider>
  );
}
