import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useFreeBalance from '@/hooks/useFreeBalance';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { useWalletContext } from '@/providers/WalletProvider';
import { balanceToReadable } from '@/utils/string';
import { shouldDisable } from 'useink/utils';

export default function CancelRequestButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { contract, pendingRequest, network, space } = useSpaceContext();
  const cancelRequestTx = useTx(contract, 'cancelRequest');
  const { selectedAccount } = useWalletContext();
  const freeBalance = useFreeBalance(selectedAccount, space.chainId);

  const doCancelRequest = async () => {
    if (freeBalance == '0') {
      toast.error(`Your account balance is not enough to make transaction, current balance: ${freeBalance}`);
      return;
    }

    cancelRequestTx.signAndSend([], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success('You canceled request');
        }

        onClose();
      }
    });
  };

  useEffect(() => {
    cancelRequestTx.resetState();
  }, [isOpen]);

  return (
    <>
      <Button onClick={onOpen} size='sm' variant='outline' width='100%' textAlign='left'>
        Cancel Request
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'md' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure to cancel your membership request?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            The payment of{' '}
            <Text as={'span'} fontWeight='semibold'>
              {balanceToReadable(pendingRequest!.paid.toString(), network)}{' '}
            </Text>{' '}
            will be refunded to your account
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              onClick={doCancelRequest}
              colorScheme='red'
              isDisabled={shouldDisable(cancelRequestTx)}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
