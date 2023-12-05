import { Flex } from '@chakra-ui/react';
import { useState } from 'react';
import NetworkSelection from '@/components/shared/NetworkSelection';
import Explorer from '@/pages/space/Explore/Explorer';
import { NetworkInfo } from '@/types';
import { SUPPORTED_NETWORKS } from '@/utils/networks';

export default function Explore() {
  const [network, setNetwork] = useState<NetworkInfo>(SUPPORTED_NETWORKS.Development[0]);

  return (
    <>
      <Flex justifyContent='end'>
        <NetworkSelection
          onSelect={(network) => setNetwork(network)}
          defaultNetwork={SUPPORTED_NETWORKS.Development[0]}
        />
      </Flex>
      <Explorer network={network} />
    </>
  );
}
