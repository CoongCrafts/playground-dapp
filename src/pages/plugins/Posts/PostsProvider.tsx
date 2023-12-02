import { createContext, useContext, useMemo } from 'react';
import usePostsContract from '@/hooks/contracts/plugins/usePostsContract';
import useContractState from '@/hooks/useContractState';
import { PluginInfo, Post, Props } from '@/types';
import { ChainContract } from 'useink';

interface PostsContextProps {
  info: PluginInfo;
  contract?: ChainContract;
  postsCount: number;
  postIds: number[];
  posts: Post[];
}

export const PostsContext = createContext<PostsContextProps>(null!);

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('PostsProvider is missing!');
  }

  return context;
};

interface PostsProviderProps extends Props {
  info: PluginInfo;
}

export default function PostsProvider({ info, children }: PostsProviderProps) {
  const contract = usePostsContract(info);
  const { state: postsCountStr = '0' } = useContractState<string>(contract, 'postsCount');
  const postsCount = parseInt(postsCountStr);
  const postIds = useMemo(() => [...Array(postsCount)].map((_, idx) => idx).reverse(), [postsCount]);
  const { state: rawPosts = [] } = useContractState<[string, any | null][]>(contract, 'postsByIds', [postIds]);
  const posts = rawPosts
    .filter(([_, raw]) => !!raw)
    .map(([idStr, rawPost]) => {
      const newPost = { ...rawPost };
      const id = parseInt(idStr);
      newPost.createdAt = newPost.createdAt && parseInt(newPost.createdAt.replaceAll(',', ''));
      newPost.updatedAt = newPost.updatedAt && parseInt(newPost.updatedAt.replaceAll(',', ''));

      return {
        id,
        ...newPost,
      } as Post;
    });

  return (
    <PostsContext.Provider value={{ info, postsCount, postIds, posts, contract }}>{children}</PostsContext.Provider>
  );
}
