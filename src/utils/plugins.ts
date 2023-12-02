const POSTS_ID = 'POST';

export interface Plugin {
  id: string;
  name: string;
}

const REGISTERED_PLUGINS: Plugin[] = [
  {
    id: POSTS_ID,
    name: 'Posts'
  }
]

export const findPlugin = (id: string): Plugin | undefined => {
  return REGISTERED_PLUGINS.find(p => p.id === id);
}

export default REGISTERED_PLUGINS;
