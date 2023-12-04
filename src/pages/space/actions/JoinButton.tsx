import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SpaceAvatar from '@/components/space/SpaceAvatar';
import useFreeBalance from '@/hooks/useFreeBalance';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { useWalletContext } from '@/providers/WalletProvider';
import { Pricing, RegistrationType } from '@/types';
import { shortenAddress, balanceToReadable, formatBalance } from '@/utils/string';
import pluralize from 'pluralize';
import { ContractSubmittableResult } from 'useink/core';
import { shouldDisable } from 'useink/utils';

export default function JoinButton() {
  const { config, membersCount, info, space, network, contract } = useSpaceContext();
  const { selectedAccount } = useWalletContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const payToJoinTx = useTx(contract, 'payToJoin');
  const registerMembershipTx = useTx(contract, 'registerMembership');
  const freeBalance = useFreeBalance(selectedAccount, network);

  const pricing = config
    ? typeof config.pricing === 'object'
      ? Object.keys(config.pricing)[0]
      : config.pricing
    : null;
  // @ts-ignore
  const pricingInfo = pricing && typeof config?.pricing === 'object' ? config.pricing[pricing] : null;

  const handleRequest = () => {
    const handleResponse = (result: ContractSubmittableResult | undefined, message: string) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success(message);
        }

        onClose();
      }
    };

    const priceValue = pricingInfo?.price.replaceAll(',', '');

    if (
      freeBalance === '0' ||
      (priceValue !== undefined && parseInt(formatBalance(priceValue, network)) > parseInt(freeBalance))
    ) {
      toast.error(`Your account balance is not enough to make transaction, current balance: ${freeBalance}`);
      return;
    }

    if (config?.registration === RegistrationType.PayToJoin) {
      payToJoinTx.signAndSend([null], { value: priceValue }, (result) => handleResponse(result, 'Joined'));
    } else if (config?.registration === RegistrationType.RequestToJoin) {
      registerMembershipTx.signAndSend([null], { value: priceValue }, (result) => handleResponse(result, 'Requested'));
    }
  };

  useEffect(() => {
    payToJoinTx.resetState();
    registerMembershipTx.resetState();
  }, [isOpen]);

  return (
    <>
      <Button colorScheme='primary' size='sm' width={100} onClick={onOpen}>
        Join
      </Button>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        {config && (
          <ModalContent>
            <ModalCloseButton />
            <ModalBody mt='1rem' display='flex' flexDirection='column' alignItems='center'>
              <SpaceAvatar space={space} info={info!} />
              <Text mt='0.5rem' fontWeight='semibold' fontSize='1.25rem'>
                {info?.name}
              </Text>
              <Flex textAlign='center' gap='0.2rem' flexDir='column'>
                <Text color='dimgray'>{info?.desc}</Text>
                <Text color='dimgray'>{`${shortenAddress(space.address)} • ${membersCount} ${pluralize(
                  'member',
                  membersCount,
                )}`}</Text>
                <Text>
                  Membership price:{' '}
                  <Text as='span' color='dimgray' fontWeight='semibold'>
                    {pricing === Pricing.Free ? 'Free' : `${balanceToReadable(pricingInfo.price, network)}`}
                    {pricing === Pricing.Subscription &&
                      ` / ${pricingInfo.duration} ${pluralize('day', pricingInfo.duration)}`}
                  </Text>
                </Text>
              </Flex>
            </ModalBody>
            <ModalFooter justifyContent='center' py='1rem'>
              <Button
                onClick={handleRequest}
                colorScheme='primary'
                minWidth='50%'
                isDisabled={shouldDisable(payToJoinTx) || shouldDisable(registerMembershipTx)}>
                {config.registration === RegistrationType.PayToJoin
                  ? (pricing === Pricing.Free && 'Join') ||
                    (pricing === Pricing.OneTimePaid &&
                      `Pay ${balanceToReadable(pricingInfo.price, network)} & Join`) ||
                    (pricing === Pricing.Subscription &&
                      `Pay ${balanceToReadable(pricingInfo.price, network)} & Subscribe`)
                  : // RegistrationType.RequestToJoin
                    (pricing === Pricing.Free && 'Request to Join') ||
                    (pricing === Pricing.OneTimePaid &&
                      `Pay ${balanceToReadable(pricingInfo.price, network)} & Request to Join`) ||
                    (pricing === Pricing.Subscription &&
                      `Pay ${balanceToReadable(pricingInfo.price, network)} & Request Subcription`)}
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
