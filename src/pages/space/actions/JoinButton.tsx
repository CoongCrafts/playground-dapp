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
import useCurrentFreeBalance from '@/hooks/space/useCurrentFreeBalance';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { Pricing, RegistrationType } from '@/types';
import { messages } from '@/utils/messages';
import { stringToNum } from '@/utils/number';
import { formatBalance, shortenAddress } from '@/utils/string';
import pluralize from 'pluralize';
import { ContractSubmittableResult } from 'useink/core';
import { shouldDisable } from 'useink/utils';

export default function JoinButton() {
  const { config, membersCount, info, space, network, contract } = useSpaceContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const payToJoinTx = useTx(contract, 'payToJoin');
  const registerMembershipTx = useTx(contract, 'registerMembership');
  const freeBalance = useCurrentFreeBalance();

  const pricing = config
    ? typeof config.pricing === 'object'
      ? Object.keys(config.pricing)[0]
      : config.pricing
    : null;
  // @ts-ignore
  const pricingInfo = pricing && typeof config?.pricing === 'object' ? config.pricing[pricing] : null;

  const handleRequest = () => {
    const priceValue = pricingInfo?.price.replaceAll(',', '');
    if (freeBalance === 0 || (priceValue && parseInt(formatBalance(priceValue, network, false, true)) >= freeBalance)) {
      toast.error(`${messages.insufficientBalance}, current balance: ${freeBalance}`);
      return;
    }

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

    const value = priceValue ? stringToNum(priceValue) : undefined;
    if (config?.registration === RegistrationType.PayToJoin) {
      payToJoinTx.signAndSend([null], { value }, (result) => handleResponse(result, `Joined ${info?.name}`));
    } else if (config?.registration === RegistrationType.RequestToJoin) {
      registerMembershipTx.signAndSend([null], { value }, (result, _, error) => {
        console.log(error);
        handleResponse(result, 'Your membership request has been submitted');
      });
    }
  };

  useEffect(() => {
    payToJoinTx.resetState();
    registerMembershipTx.resetState();
  }, [isOpen]);

  const price = formatBalance(pricingInfo.price, network);

  if (!config) {
    return null;
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme='primary' size='sm' width={100}>
        Join
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} size={{ base: 'full', md: 'sm' }}>
        <ModalOverlay />
        {config && (
          <ModalContent>
            <ModalCloseButton />
            <ModalBody mt={4} display='flex' flexDirection='column' textAlign='center' alignItems='center'>
              <SpaceAvatar space={space} info={info!} />
              <Text mt={2} fontWeight='semibold' fontSize='1.25rem'>
                {info?.name}
              </Text>
              <Flex gap={1} flexDir='column' mt={2}>
                <Text color='dimgray' noOfLines={3}>
                  {info?.desc}
                </Text>
                <Text color='dimgray'>{`${shortenAddress(space.address)} • ${membersCount} ${pluralize(
                  'member',
                  membersCount,
                )}`}</Text>
                <Text mt={2}>
                  Membership price:{' '}
                  <Text as='span' color='primary.500' fontWeight='semibold'>
                    {pricing === Pricing.Free ? 'Free' : `${price}`}
                    {pricing === Pricing.Subscription &&
                      ` / ${pricingInfo.duration} ${pluralize('day', pricingInfo.duration)}`}
                  </Text>
                </Text>
              </Flex>
            </ModalBody>
            <ModalFooter justifyContent='center' py={4} pb={8}>
              <Button
                onClick={handleRequest}
                colorScheme='primary'
                minWidth='50%'
                isDisabled={shouldDisable(payToJoinTx) || shouldDisable(registerMembershipTx)}>
                {config.registration === RegistrationType.PayToJoin
                  ? (pricing === Pricing.Free && 'Join') ||
                    (pricing === Pricing.OneTimePaid && `Pay ${price} & Join`) ||
                    (pricing === Pricing.Subscription && `Pay ${price} & Subscribe`)
                  : // RegistrationType.RequestToJoin
                    (pricing === Pricing.Free && 'Request to Join') ||
                    (pricing === Pricing.OneTimePaid && `Pay ${price} & Request to Join`) ||
                    (pricing === Pricing.Subscription && `Pay ${price} & Request Subscription`)}
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
