import { useState } from 'react';
import useContractState from '@/hooks/useContractState';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { Pagination } from '@/types';
import { stringToNum } from '@/utils/number';

export default function usePagination<T>(paginationMessage: string, recordPerPage: number) {
  const { contract } = useSpaceContext();
  const [pageIndex, setPageIndex] = useState(1);
  const { state: page } = useContractState<Pagination<T>>(contract, paginationMessage, [
    (pageIndex - 1) * recordPerPage,
    recordPerPage,
  ]);

  const { items = [], total } = page || {};
  const numberOfPage = stringToNum(total) ? Math.ceil(parseInt(total!) / recordPerPage) : 1;

  return { pageIndex, setPageIndex, numberOfPage, items, total: stringToNum(total) };
}
