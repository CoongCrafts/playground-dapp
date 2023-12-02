import { Plugin } from '@/types';

export const PLUGIN_POSTS = 'POST';

const REGISTERED_PLUGINS: Plugin[] = [
  {
    id: PLUGIN_POSTS,
    name: 'Posts'
  }
]

export const findPlugin = (id: string): Plugin | undefined => {
  return REGISTERED_PLUGINS.find(p => p.id === id);
}

export default REGISTERED_PLUGINS;
