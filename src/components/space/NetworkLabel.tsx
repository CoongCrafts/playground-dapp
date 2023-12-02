import { Avatar, Tooltip } from '@chakra-ui/react';
import { Props } from '@/types';
import { findNetwork } from '@/utils/networks';
import { ChainId } from 'useink/chains';

interface NetworkLabelProps extends Props {
  chainId: ChainId;
}

export default function NetworkLabel({ chainId }: NetworkLabelProps) {
  const network = findNetwork(chainId);
  return (
    <Tooltip label={network.name} id={network.name} placement='top'>
      <Avatar size='xs' src={network.logo} />
    </Tooltip>
  );
}
