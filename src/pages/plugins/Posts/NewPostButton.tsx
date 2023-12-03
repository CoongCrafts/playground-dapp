import {
  Button,
  FormControl,
  IconButton,
  FormErrorMessage,
  FormHelperText,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTx } from '@/hooks/useink/useTx';
import { usePostsContext } from '@/pages/plugins/Posts/PostsProvider';
import { AddIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import { shouldDisable } from 'useink/utils';
import * as yup from 'yup';

export default function NewPostButton() {
  const { contract } = usePostsContext();
  const newPostTx = useTx<number>(contract, 'newPost');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: yup.object().shape({
      content: yup.string().required().max(200),
    }),
    onSubmit: (values, formikHelpers) => {
      const { content } = values;
      const postContent = { Raw: content };
      newPostTx.signAndSend([postContent], undefined, (result) => {
        console.log(result);
        if (!result) {
          return;
        }

        if (result?.isInBlock) {
          if (result.isError || result.dispatchError) {
            console.error(result.toHuman());
            toast.error('ExtrinsicFailed');
          } else {
            onClose();
            toast.success('Post created successfully!');
          }

          formikHelpers.setSubmitting(false);
        }
      });
    },
  });

  useEffect(() => {
    newPostTx.resetState();
    formik.resetForm();
  }, [isOpen]);

  const processing = shouldDisable(newPostTx);

  return (
    <>
      <Button size='sm' onClick={onOpen} display={{ base: 'none', md: 'block' }}>
        New
      </Button>
      <IconButton
        aria-label={'New post'}
        size='sm'
        onClick={onOpen}
        icon={<AddIcon />}
        display={{ base: 'block', md: 'none' }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New post</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={formik.handleSubmit}>
            <ModalBody>
              <FormControl isInvalid={formik.touched.content && !!formik.errors.content}>
                <Textarea
                  id='content'
                  name='content'
                  value={formik.values.content}
                  placeholder='What do you want to share?'
                  autoFocus
                  onChange={formik.handleChange}
                />
                {formik.touched.content && !!formik.errors.content ? (
                  <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                ) : (
                  <FormHelperText>Markdown supported, maximum 200 characters</FormHelperText>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button size='sm' variant='ghost' mr={2} onClick={onClose} isDisabled={processing}>
                Close
              </Button>
              <Button
                size='sm'
                colorScheme='primary'
                type='submit'
                width={100}
                isDisabled={formik.isSubmitting || processing || !formik.values.content}>
                {processing ? 'Posting...' : 'Post'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
