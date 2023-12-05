import { Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useToggle, useWindowScroll } from 'react-use';
import NetworkSelection from '@/components/shared/NetworkSelection';
import useMotherContract from '@/hooks/contracts/useMotherContract';
import usePagination from '@/hooks/usePagination';
import SpaceCard from '@/pages/space/Explorer/SpaceCard';
import { NetworkInfo, SpaceRecord } from '@/types';
import { SUPPORTED_NETWORKS } from '@/utils/networks';
import pluralize from 'pluralize';

const RECORD_PER_PAGE = 12;

export default function Explorer() {
  const [network, setNetwork] = useState<NetworkInfo>(SUPPORTED_NETWORKS.Development[0]);
  const contract = useMotherContract(network.id);
  const [loadMore, toggleLoadMore] = useToggle(false);
  const [onLoad, setOnLoad] = useToggle(true);
  const [storage, setStorage] = useState<SpaceRecord[]>([]);
  const {
    items,
    setPageIndex,
    pageIndex,
    numberOfPage,
    total: numberOfSpace,
    hasNextPage,
  } = usePagination<SpaceRecord>(contract, 'listSpaces', RECORD_PER_PAGE);
  const { y } = useWindowScroll();

  useEffect(() => {
    if (items.length > 0 && onLoad) {
      setOnLoad(false);

      setStorage((preState) => [...preState, ...items]);
    }
  }, [items]);

  useEffect(() => {
    if (!loadMore || onLoad || pageIndex === numberOfPage) return;

    if (document.body.offsetHeight - y <= innerHeight + 50) {
      setOnLoad(true);
      setPageIndex(pageIndex + 1);
    }
  }, [loadMore, onLoad, y]);

  return (
    <Flex my={4} flexDir='column' gap={8}>
      <Flex justifyContent='space-between' alignItems='center' flexGrow={1}>
        <NetworkSelection
          onSelect={(network) => setNetwork(network)}
          defaultNetwork={SUPPORTED_NETWORKS.Development[0]}
        />
        <Text color='dimgray' fontWeight='semibold' whiteSpace='nowrap'>
          {`${numberOfSpace} ${pluralize('space', numberOfSpace)} `}
        </Text>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={8}>
        {storage.map((record) => (
          <SpaceCard class='space-card' key={record.spaceId} spaceRecord={record} chainId={network.id} />
        ))}
      </SimpleGrid>
      {onLoad && <Spinner alignSelf='center' />}
      {hasNextPage && !loadMore && (
        <Button onClick={toggleLoadMore} variant='outline'>
          Load more
        </Button>
      )}
    </Flex>
  );
}
