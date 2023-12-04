import { Flex, Tag, Text, IconButton, Button } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { useState } from 'react';
import { toast } from 'react-toastify';
import usePagination from '@/hooks/usePagination';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { MembershipRequest, RequestApproval } from '@/types';
import { fromNow } from '@/utils/date';
import { shortenAddress } from '@/utils/string';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';
import { shouldDisable } from 'useink/utils';

export default function PendingMembers() {
  const { contract } = useSpaceContext();
  const submitRequestApprovalsTx = useTx(contract, 'submitRequestApprovals');
  const [requestApprovals, setRequestApprovals] = useState<RequestApproval[]>([]);
  const { pageIndex, setPageIndex, numberOfPage, items, total } = usePagination<MembershipRequest>(
    'pendingRequests',
    9,
  );

  const submitApprovals = (requestApprovals: RequestApproval[]) => {
    if (requestApprovals.length === 0) {
      return;
    }

    submitRequestApprovalsTx.signAndSend([requestApprovals], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success('Approved');
        }
      }

      setRequestApprovals([]);
    });
  };

  const handleSelect = (requestApproval: RequestApproval) => {
    setRequestApprovals((prevState) => {
      const index = prevState.findIndex(([address]) => address === requestApproval[0]);
      if (index >= 0) {
        if (requestApproval[1] === prevState[index][1]) {
          return prevState.toSpliced(index, 1);
        }
        return prevState.toSpliced(index, 1, requestApproval);
      }

      return [...prevState, requestApproval];
    });
  };

  return (
    <Flex flexDirection='column'>
      <Flex justifyContent='space-between' gap='1rem'>
        <Flex alignItems='center' gap='0.5rem' width='75%'>
          <Text fontSize={{ md: 'xl' }} fontWeight='semibold'>
            Pending Membership Request
          </Text>
          <Tag size='sm'>{total}</Tag>
        </Flex>
        <Button
          onClick={() => submitApprovals(requestApprovals)}
          flexGrow={1}
          isDisabled={requestApprovals.length === 0 || shouldDisable(submitRequestApprovalsTx)}>
          Submit Approval
        </Button>
      </Flex>
      <Flex mt='1rem' flexDirection='column' gap='0.5rem' flexGrow={1}>
        {items.map((one) => (
          <>
            <Flex alignItems='center' key={one.who} gap='1rem'>
              <Flex
                p={2}
                alignItems='center'
                borderStyle='solid'
                borderWidth={2}
                borderColor='chakra-border-color'
                width='75%'>
                <Flex alignItems='center' gap='0.5rem' flex='0 0 70%'>
                  <Identicon value={one.who} size={28} theme='polkadot' />
                  <Text fontWeight='semibold' fontSize='1rem' color='dimgray'>
                    {shortenAddress(one.who)}
                  </Text>
                </Flex>
                <Text fontSize='0.8rem'>{`Requested ${fromNow(one.requestedAt.toString())}`}</Text>
              </Flex>
              <Flex flexGrow={1} gap='2rem' justifyContent='center'>
                <IconButton
                  onClick={() => handleSelect([one.who, true])}
                  colorScheme={
                    requestApprovals.some(([address, isApprove]) => address === one.who && isApprove) ? 'green' : 'gray'
                  }
                  aria-label={'Approve'}
                  icon={<CheckIcon />}
                  isRound={true}
                />
                <IconButton
                  onClick={() => handleSelect([one.who, false])}
                  colorScheme={
                    requestApprovals.some(([address, isApprove]) => address === one.who && !isApprove) ? 'red' : 'gray'
                  }
                  aria-label={'Refuse'}
                  icon={<CloseIcon />}
                  isRound={true}
                />
              </Flex>
            </Flex>
          </>
        ))}
      </Flex>
      <Flex alignSelf='end' alignItems='center' gap={2}>
        <Text fontSize='sm'>{`Page ${pageIndex}/${numberOfPage}`}</Text>
        <IconButton
          onClick={() => setPageIndex((pre) => pre - 1)}
          aria-label='Back'
          size='sm'
          icon={<ChevronLeftIcon fontSize='1.2rem' />}
          isDisabled={pageIndex === 1}
        />
        <IconButton
          onClick={() => setPageIndex((pre) => pre + 1)}
          aria-label='Next'
          size='sm'
          icon={<ChevronRightIcon fontSize='1.2rem' />}
          isDisabled={pageIndex === numberOfPage}
        />
      </Flex>
    </Flex>
  );
}
