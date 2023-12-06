import { Text, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTx } from '@/hooks/useink/useTx';
import { usePostsContext } from '@/pages/plugins/Posts/PostsProvider';
import EditPostModal from '@/pages/plugins/Posts/action/EditPostModal';
import { Post, PostContent, Props } from '@/types';
import { shouldDisable } from 'useink/utils';

interface UpdatePostButton extends Props {
  post: Post;
  postId: number;
}

export default function UpdatePostButton({ post, postId }: UpdatePostButton) {
  const { contract } = usePostsContext();
  const updatePostTx = useTx(contract, 'updatePost');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = (values: { content: string }) => {
    const { content } = values;
    const postContent = { Raw: content };
    updatePostTx.signAndSend([postId, postContent], undefined, (result) => {
      if (!result) {
        return;
      }

      if (result?.isInBlock) {
        if (result.isError || result.dispatchError) {
          console.error(result.toHuman());
          toast.error('ExtrinsicFailed');
        } else {
          onClose();
          toast.success('Post updated successfully!');
        }
      }
    });
  };

  useEffect(() => {
    updatePostTx.resetState();
  }, [isOpen]);

  const processing = shouldDisable(updatePostTx);

  if (!(PostContent.Raw in post.content)) {
    return null;
  }

  return (
    <>
      <Text onClick={onOpen} width='100%'>
        Edit Post
      </Text>
      <EditPostModal
        title='Edit Post'
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        onSubmit={handleSubmit}
        defaultValue={post.content.Raw}
        shouldDisable={processing}
        action='Update'
      />
    </>
  );
}
