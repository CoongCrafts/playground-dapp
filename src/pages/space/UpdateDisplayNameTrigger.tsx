import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { useFormik } from 'formik';
import * as yup from 'yup';

function UpdateDisplayNameTrigger() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { contract, memberInfo } = useSpaceContext();
  const setMemberInfo = useTx(contract, 'setMemberInfo');

  const updateDisplayName = (displayName?: string) => {
    setMemberInfo.signAndSend([displayName], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success('Display name updated');
        }
      }
    });
  };

  const formikSetDisplayName = useFormik({
    initialValues: { displayName: '' },
    validationSchema: yup.object().shape({
      displayName: yup
        .string()
        .min(3, 'Display name must be at least 3 characters')
        .max(30, 'Display name must be at most 30 characters')
        .matches(/^[A-Za-z0-9_\-\s]*$/, { message: 'Invalid display name' }),
    }),
    onSubmit: ({ displayName }) => {
      updateDisplayName(displayName);
      handleClose();
    },
  });

  const handleClose = () => {
    formikSetDisplayName.setValues({ displayName: '' });
    onClose();
  };
  return (
    <>
      <Text onClick={onOpen} width='100%' textAlign='left'>
        {memberInfo?.name ? 'Change Display Name' : 'Set Display Name'}
      </Text>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent as='form' onSubmit={(e) => formikSetDisplayName.handleSubmit(e as FormEvent<HTMLFormElement>)}>
          <ModalHeader>{memberInfo?.name ? 'Change Display Name' : 'Set Display Name'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!formikSetDisplayName.errors.displayName}>
              <FormLabel>Display name</FormLabel>
              <Input
                value={formikSetDisplayName.values.displayName}
                onChange={formikSetDisplayName.handleChange}
                placeholder={memberInfo?.name || ''}
                name='displayName'
              />
              {!!formikSetDisplayName.errors.displayName ? (
                <FormErrorMessage>{formikSetDisplayName.errors.displayName}</FormErrorMessage>
              ) : (
                <FormHelperText>Leave empty to reset name</FormHelperText>
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
              isDisabled={Object.keys(formikSetDisplayName.errors).length !== 0}>
              Set Name
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateDisplayNameTrigger;
