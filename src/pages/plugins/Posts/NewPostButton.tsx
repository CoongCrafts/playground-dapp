import {
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { shouldDisable } from "useink/utils";
import { useTx } from "@/hooks/useink/useTx";
import { usePostsContext } from "@/pages/plugins/Posts/PostsProvider";


export default function NewPostButton() {
  const { contract } = usePostsContext();
  const newPostTx = useTx<number>(contract, 'newPost');
  const {isOpen, onOpen, onClose} = useDisclosure();

  const formik = useFormik({
    initialValues: {
      content: '',
    },
    onSubmit: (values, formikHelpers) => {
      const {content} = values;
      const postContent = { Raw: content }
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
      })
    }
  });

  useEffect(() => {
    newPostTx.resetState();
    formik.resetForm();
  }, [isOpen]);

  const processing = shouldDisable(newPostTx);

  return (
    <>
      <Button size='sm' colorScheme='primary' variant='outline' onClick={onOpen}>New</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>New post</ModalHeader>
          <ModalCloseButton/>
          <form onSubmit={formik.handleSubmit}>
            <ModalBody>
              <FormControl>
                <Textarea id='content' name='content' value={formik.values.content}
                          placeholder='What do you want to share?' autoFocus
                          onChange={formik.handleChange}/>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button size='sm' variant='ghost' mr={2} onClick={onClose} isDisabled={processing}>
                Close
              </Button>
              <Button size='sm' colorScheme='primary' type='submit' width={100}
                      isDisabled={formik.isSubmitting || processing || !formik.values.content}>{processing ? 'Posting...' : 'Post'}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
