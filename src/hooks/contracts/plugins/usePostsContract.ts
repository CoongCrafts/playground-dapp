import posts from '@/metadata/posts.json';
import { useContract } from "useink";
import { PluginInfo } from "@/types";

export default function usePostsContract(plugin: PluginInfo) {
  return useContract(plugin.address, posts, plugin.chainId);
}
