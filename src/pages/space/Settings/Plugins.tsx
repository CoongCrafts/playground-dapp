import { Badge, Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import useCurrentFreeBalance from '@/hooks/space/useCurrentFreeBalance';
import { useTx } from '@/hooks/useink/useTx';
import InstallPluginsButton from '@/pages/space/actions/InstallPluginsButton';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { messages } from '@/utils/messages';

export default function Plugins() {
  const { info, plugins, isOwner, contract } = useSpaceContext();
  const freeBalance = useCurrentFreeBalance();
  const disablePluginTx = useTx(contract, 'disablePlugin');
  const enablePluginTx = useTx(contract, 'enablePlugin');

  if (!info) {
    return null;
  }

  const disable = (pluginId: string) => {
    if (freeBalance === 0) {
      toast.error(messages.insufficientBalance);
      return;
    }

    disablePluginTx.signAndSend([pluginId], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success('Plugin disabled');
        }
      }
    });
  };

  const enable = (pluginId: string) => {
    if (freeBalance === 0) {
      toast.error(messages.insufficientBalance);
      return;
    }

    enablePluginTx.signAndSend([pluginId], {}, (result) => {
      if (result?.isInBlock) {
        if (result.dispatchError) {
          toast.error(result.dispatchError.toString());
        } else {
          toast.success('Plugin enabled');
        }
      }
    });
  };

  return (
    <Box mt={3} borderWidth={1} borderColor='chakra-border-color' p={4} borderRadius={4} mb={4}>
      <Flex justify='space-between' align='center'>
        <Text fontWeight='semibold'>Plugins</Text>
        <Box>{isOwner && <InstallPluginsButton />}</Box>
      </Flex>
      <Box>
        {plugins?.map((one, index) => (
          <Box key={one.id}>
            <Flex py={4} justify='space-between' align='center' borderRadius={4}>
              <Box>
                <Flex gap={2}>
                  <Text fontSize='lg'>{one.name}</Text>
                  {one.disabled && (
                    <Box>
                      <Badge size='xs' variant='solid' colorScheme='red'>
                        Disabled
                      </Badge>
                    </Box>
                  )}
                </Flex>
                <Text fontSize='sm' color='gray.500'>
                  {one.description}
                </Text>
              </Box>
              <Box>
                <Button
                  variant='outline'
                  size='xs'
                  isDisabled={!isOwner}
                  colorScheme={one.disabled ? 'green' : 'red'}
                  onClick={one.disabled ? () => enable(one.id) : () => disable(one.id)}>
                  {one.disabled ? 'Enable' : 'Disable'}
                </Button>
              </Box>
            </Flex>
            {index < plugins.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
