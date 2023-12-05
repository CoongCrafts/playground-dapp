import { Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useToggle, useWindowScroll } from 'react-use';
import useMotherContract from '@/hooks/contracts/useMotherContract';
import usePagination from '@/hooks/usePagination';
import SpaceCard from '@/pages/space/Explore/SpaceCard';
import { NetworkInfo, Props, SpaceRecord } from '@/types';
import pluralize from 'pluralize';

const RECORD_PER_PAGE = 12;

interface ExplorerProps extends Props {
  network: NetworkInfo;
}

export default function Explorer({ network }: ExplorerProps) {
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

  console.log(document.body.offsetHeight - y);

  return (
    <Flex my={4} flexDir='column' gap={8}>
      <Flex justifyContent='end' alignItems='center' flexGrow={1}>
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
