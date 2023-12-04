import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputRightAddon,
  InputLeftElement,
  Circle,
  IconButton,
} from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import { isAddress } from '@polkadot/util-crypto';
import { useCall } from '@/hooks/useink/useCall';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberStatus } from '@/types';
import { AddIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import { pickDecoded } from 'useink/utils';
import * as yup from 'yup';

const MILLISECS_PER_DAY = 24 * 60 * 60 * 1000;

function toastErrAndReturnNothing(message: string) {
  toast.error(message);
  return;
}

function InviteMemberButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { contract } = useSpaceContext();
  const memberStatusCall = useCall<MemberStatus>(contract, 'memberStatus');
  const grantMembershipTx = useTx(contract, 'grantMembership');

  const formikInviteMember = useFormik({
    initialValues: { address: '', expire: undefined },
    validationSchema: yup.object().shape({
      address: yup.string().test('is_valid_address', 'Invalid address format', (value) => isAddress(value)),
      expire: yup.number().positive('Invalid expire time').integer('Invalid expire time'),
    }),
    onSubmit: async (values) => {
      await inviteMember(values.address, values.expire);
    },
  });

  const inviteMember = async (address: string, expireAfter?: number) => {
    if (!isAddress(address)) {
      return toastErrAndReturnNothing('Invalid address format');
    }

    const result = await memberStatusCall.send([address]);
    const status = pickDecoded(result);
    if (!status) {
      return toastErrAndReturnNothing('Cannot check member status of the address');
    }

    if (status === MemberStatus.Active) {
      return toastErrAndReturnNothing('The address is already an active member of the space!');
    }

    grantMembershipTx.signAndSend([address, expireAfter ? expireAfter * MILLISECS_PER_DAY : null], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toastErrAndReturnNothing(result.dispatchError.toString());
        } else {
          toast.success('Member invited');
        }

        onClose();
      }
    });
  };

  useEffect(() => {
    formikInviteMember.resetForm();
    // To avoid `Invite` button from being frozen
    grantMembershipTx.resetState();
  }, [isOpen]);

  return (
    <>
      <Button size='sm' onClick={onOpen} display={{ base: 'none', md: 'block' }}>
        Invite
      </Button>
      <IconButton
        aria-label={'Invite'}
        size='sm'
        onClick={onOpen}
        icon={<AddIcon />}
        display={{ base: 'block', md: 'none' }}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }}>
        <ModalOverlay />
        <ModalContent
          as={'form'}
          onSubmit={(e) => {
            formikInviteMember.handleSubmit(e as FormEvent<HTMLFormElement>);
          }}>
          <ModalHeader>Invite new member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              mb={4}
              isRequired
              isInvalid={!!formikInviteMember.values.address && !!formikInviteMember.errors.address}>
              <FormLabel>Address</FormLabel>
              <InputGroup>
                <InputLeftElement px='auto'>
                  {!!formikInviteMember.values.address && !formikInviteMember.errors.address ? (
                    <Identicon value={formikInviteMember.values.address} theme='polkadot' size={24} />
                  ) : (
                    <Circle bg='#ddd' size={6}></Circle>
                  )}
                </InputLeftElement>
                <Input
                  value={formikInviteMember.values.address}
                  onChange={formikInviteMember.handleChange}
                  placeholder='4INSPACE120321...'
                  name='address'
                />
              </InputGroup>
              {!!formikInviteMember.values.address && !!formikInviteMember.errors.address && (
                <FormErrorMessage>{formikInviteMember.errors.address}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!formikInviteMember.errors.expire}>
              <FormLabel>Expire after</FormLabel>
              <InputGroup width={{ md: '50%' }}>
                <Input
                  type='number'
                  value={formikInviteMember.values.expire}
                  onChange={formikInviteMember.handleChange}
                  placeholder='e.g: 365'
                  name='expire'
                />
                <InputRightAddon children={'days'} />
              </InputGroup>
              {!!formikInviteMember.errors.expire ? (
                <FormErrorMessage>{formikInviteMember.errors.expire}</FormErrorMessage>
              ) : (
                <FormHelperText>Leave empty for non-expiring membership</FormHelperText>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter gap='0.5rem'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              colorScheme='primary'
              isDisabled={
                grantMembershipTx.status === 'PendingSignature' || !!Object.keys(formikInviteMember.errors).length
              }>
              Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InviteMemberButton;
