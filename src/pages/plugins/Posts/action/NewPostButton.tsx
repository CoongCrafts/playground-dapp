import { Button, IconButton, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTx } from '@/hooks/useink/useTx';
import { usePostsContext } from '@/pages/plugins/Posts/PostsProvider';
import EditPostModal from '@/pages/plugins/Posts/action/EditPostModal';
import { AddIcon } from '@chakra-ui/icons';
import { shouldDisable } from 'useink/utils';

export default function NewPostButton() {
  const { contract } = usePostsContext();
  const newPostTx = useTx<number>(contract, 'newPost');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (values: { content: string }) => {
    const { content } = values;
    const postContent = { Raw: content };
    newPostTx.signAndSend([postContent], undefined, (result) => {
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
      }
    });
  };

  useEffect(() => {
    newPostTx.resetState();
  }, [isOpen]);

  const processing = shouldDisable(newPostTx);

  return (
    <>
      <Button
        variant='outline'
        colorScheme='primary'
        size='sm'
        onClick={onOpen}
        display={{ base: 'none', md: 'block' }}>
        New
      </Button>
      <IconButton
        aria-label={'New post'}
        colorScheme='primary'
        variant='outline'
        size='sm'
        onClick={onOpen}
        icon={<AddIcon />}
        display={{ base: 'block', md: 'none' }}
      />
      <EditPostModal
        title='New Post'
        onClose={onClose}
        isOpen={isOpen}
        onSubmit={handleSubmit}
        shouldDisable={processing}
        action='Post'
      />
    </>
  );
}
