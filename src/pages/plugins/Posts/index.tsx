import { Box, Flex, Tag, Text } from "@chakra-ui/react";
import { useSpaceContext } from "@/providers/SpaceProvider";
import { MemberStatus } from "@/types";
import { PLUGIN_POSTS } from "@/utils/plugins";
import PostsProvider, { usePostsContext } from "@/pages/plugins/Posts/PostsProvider";
import NewPostButton from "@/pages/plugins/Posts/NewPostButton";
import { Identicon } from "@polkadot/react-identicon";
import { shortenAddress } from "@/utils/string";
import { fromNow } from "@/utils/date";


function PostsContent() {
  const { memberStatus } = useSpaceContext();
  const { postsCount, posts } = usePostsContext();

  return (
    <Box>
      <Flex justify='space-between' align='center' mb={4} gap={2}>
        <Flex gap={2} align='center'>
          <Text fontSize='xl' fontWeight='semibold'>Posts</Text>
          <Box><Tag>{postsCount}</Tag></Box>
        </Flex>
        <Flex gap={2}>
          {memberStatus === MemberStatus.Active && <NewPostButton />}
        </Flex>
      </Flex>
      <Box>
        {posts.map((post) => (
          <Box key={post.id} border='1px' borderColor='gray.200' p={4} borderRadius={4} mb={4}>
            <Flex alignItems='center' gap={2} mb={1}>
              <Flex gap={2} alignItems='center'>
                <Identicon value={post.author} size={24} theme='polkadot'/>
                <Text fontWeight='semibold' color='gray.600'>{shortenAddress(post.author)}</Text>
              </Flex>
              <Text fontSize='sm' color='gray.500'>{fromNow(post.createdAt)}</Text>
            </Flex>

            <Text mt={3}>{post.content.Raw || ''}</Text>
          </Box>)
        )}
      </Box>
    </Box>
  )
}

export default function Posts() {
  const { plugins } = useSpaceContext();
  const postPlugin = plugins?.find(p => p.id === PLUGIN_POSTS);
  if (!postPlugin) {
    return null;
  }

  return (
    <PostsProvider info={postPlugin}>
      <PostsContent />
    </PostsProvider>
  )
}
