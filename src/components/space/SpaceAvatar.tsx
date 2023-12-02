import { Avatar, AvatarBadge } from '@chakra-ui/react';
import NetworkLabel from '@/components/space/NetworkLabel';
import { OnChainSpace, Props, SpaceInfo } from '@/types';

interface SpaceAvatarProps extends Props {
  space: OnChainSpace;
  info: SpaceInfo;
}

export default function SpaceAvatar({ info, space }: SpaceAvatarProps) {
  const { logo } = info;
  if (logo) {
    const { Url } = logo;
    if (Url) {
      return (
        <Avatar src={Url} size='xl' borderWidth={1} borderColor='primary.100' p={3}>
          <AvatarBadge borderColor='primary.200' borderWidth='2px' bg='white' bottom={2}>
            <NetworkLabel chainId={space.chainId} />
          </AvatarBadge>
        </Avatar>
      );
    }
  }

  return (
    <Avatar name={info.name} size='xl'>
      <AvatarBadge borderColor='primary.200' borderWidth='3px'>
        <NetworkLabel chainId={space.chainId} />
      </AvatarBadge>
    </Avatar>
  );
}
