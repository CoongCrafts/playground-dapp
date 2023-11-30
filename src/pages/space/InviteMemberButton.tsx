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
} from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { isAddress } from '@polkadot/util-crypto';
import EmptySpace from '@/components/shared/EmptySpace';
import { useCall } from '@/hooks/useink/useCall';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberStatus } from '@/types';
import { useFormik } from 'formik';
import { pickDecoded } from 'useink/utils';
import * as yup from 'yup';

const MILISECS_PER_DAY = 24 * 60 * 60 * 1000;

function toastErrAndOut(message: string) {
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
      address: yup.string().test('is-address', 'Invalid address', (value) => isAddress(value)),
      expire: yup.number().positive('Invalid expire time').integer('Invalid expire time'),
    }),
    onSubmit: async (values) => {
      await inviteMember(values.address, values.expire);
    },
  });

  const inviteMember = async (address: string, expireAfter?: number) => {
    if (!isAddress(address)) {
      return toastErrAndOut('Invalid address format');
    }

    const result = await memberStatusCall.send([address]);
    const status = pickDecoded(result);
    if (!status) {
      return toastErrAndOut('Cannot check member status of the address');
    }

    if (status !== MemberStatus.None) {
      return toastErrAndOut('The address is already a member of the space!');
    }

    grantMembershipTx.signAndSend([address, expireAfter ? expireAfter * MILISECS_PER_DAY : null], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success('Invited');
        }
      }
    });
  };

  const handleClose = () => {
    formikInviteMember.setValues({ address: '', expire: undefined });
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>Invite</Button>
      <Modal isOpen={isOpen} onClose={handleClose} size='xl'>
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
              mb='0.5rem'
              isRequired
              isInvalid={!!formikInviteMember.values.address && !!formikInviteMember.errors.address}>
              <FormLabel>Address</FormLabel>
              <InputGroup>
                <InputLeftElement px='auto'>
                  {!!formikInviteMember.values.address && !formikInviteMember.errors.address ? (
                    <Identicon value={formikInviteMember.values.address} theme='polkadot' size={30} />
                  ) : (
                    <Circle bg='#ddd' size={30}></Circle>
                  )}
                </InputLeftElement>
                <Input
                  value={formikInviteMember.values.address}
                  onChange={formikInviteMember.handleChange}
                  placeholder='4INSPACE120321...'
                  name='address'
                />
              </InputGroup>
              {!!formikInviteMember.values.address && !!formikInviteMember.errors.address ? (
                <FormErrorMessage>{formikInviteMember.errors.address}</FormErrorMessage>
              ) : (
                <EmptySpace />
              )}
            </FormControl>
            <FormControl isInvalid={!!formikInviteMember.errors.expire} width='50%'>
              <FormLabel>Expire after</FormLabel>
              <InputGroup>
                <Input
                  type='number'
                  value={formikInviteMember.values.expire}
                  onChange={formikInviteMember.handleChange}
                  placeholder='365'
                  name='expire'
                />
                <InputRightAddon children={'Days'} />
              </InputGroup>
              {!!formikInviteMember.errors.expire ? (
                <FormErrorMessage>{formikInviteMember.errors.expire}</FormErrorMessage>
              ) : (
                <FormHelperText>Leave empty for non-expiring membership</FormHelperText>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter gap='0.5rem'>
            <Button variant='outline' onClick={handleClose}>
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
