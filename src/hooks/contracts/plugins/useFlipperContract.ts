import flipper from '@/metadata/flipper.json';
import { PluginInfo } from '@/types';
import { useContract } from 'useink';

export default function useFlipperContract(plugin: PluginInfo) {
  return useContract(plugin.address, flipper, plugin.chainId);
}
