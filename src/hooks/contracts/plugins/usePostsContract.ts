import posts from '@/metadata/posts.json';
import { PluginInfo } from '@/types';
import { useContract } from 'useink';

export default function usePostsContract(plugin: PluginInfo) {
  return useContract(plugin.address, posts, plugin.chainId);
}
