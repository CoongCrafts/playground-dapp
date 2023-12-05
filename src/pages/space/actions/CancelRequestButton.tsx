import {
  Button,
  ButtonProps,
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
import useCurrentFreeBalance from '@/hooks/space/useCurrentFreeBalance';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { Props } from '@/types';
import { messages } from '@/utils/messages';
import { formatBalance } from '@/utils/string';
import { shouldDisable } from 'useink/utils';

interface CancelRequestButtonProps extends Props {
  buttonProps?: ButtonProps;
}

export default function CancelRequestButton({ buttonProps }: CancelRequestButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { contract, pendingRequest, network } = useSpaceContext();
  const cancelRequestTx = useTx(contract, 'cancelRequest');
  const freeBalance = useCurrentFreeBalance();

  const doCancelRequest = async () => {
    if (freeBalance === 0) {
      toast.error(messages.insufficientBalance);
      return;
    }

    cancelRequestTx.signAndSend([], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success('Request canceled');
        }

        onClose();
      }
    });
  };

  const handleOpen = (event: any) => {
    // Prevent navigating into space when clicking on the button.
    event.stopPropagation();
    onOpen();
  };

  useEffect(() => {
    cancelRequestTx.resetState();
  }, [isOpen]);

  if (!pendingRequest) {
    return null;
  }

  return (
    <>
      <Button onClick={handleOpen} size='sm' variant='outline' width='100%' {...buttonProps}>
        Cancel Request
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'md' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel membership request?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure to cancel your membership request?</Text>
            <Text mt={2}>
              The payment of
              <Text as={'span'} fontWeight='semibold'>
                {` ${formatBalance(pendingRequest!.paid.toString(), network)} `}
              </Text>
              will be refunded to your account on canceling.
            </Text>
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
