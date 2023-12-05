import { Plugin } from '@/types';

export const PLUGIN_POSTS = 'POST';
export const PLUGIN_FLIPPER = 'FLIP';

const REGISTERED_PLUGINS: Plugin[] = [
  {
    id: PLUGIN_POSTS,
    name: 'Posts',
    description: 'Keep space members updated with posts and announcements',
  },
  {
    id: PLUGIN_FLIPPER,
    name: 'Flipper',
    description: 'Flip a boolean value, only active member can flip',
  },
];

export const findPlugin = (id: string): Plugin | undefined => {
  return REGISTERED_PLUGINS.find((p) => p.id === id);
};

export default REGISTERED_PLUGINS;
