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
import { shouldDisable } from 'useink/utils';

export default function LeaveSpaceButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { contract, info, space } = useSpaceContext();
  const leaveSpaceTx = useTx(contract, 'leave');
  const { selectedAccount } = useWalletContext();
  const freeBalance = useFreeBalance(selectedAccount, space.chainId);

  const doLeave = async () => {
    if (freeBalance == '0') {
      toast.error(`Your account balance is not enough to make transaction, current balance: ${freeBalance}`);
      return;
    }

    leaveSpaceTx.signAndSend([], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success('You left the space');
        }

        onClose();
      }
    });
  };

  useEffect(() => {
    leaveSpaceTx.resetState();
  }, [isOpen]);

  return (
    <>
      <Text onClick={onOpen} width='100%' textAlign='left'>
        Leave
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'md' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leaving {info?.name}?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Please confirm to leave {info?.name}, this action cannot be undone.</ModalBody>
          <ModalFooter gap={2}>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' onClick={doLeave} colorScheme='red' isDisabled={shouldDisable(leaveSpaceTx)}>
              Leave
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
