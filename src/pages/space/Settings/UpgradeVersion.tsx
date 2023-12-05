import { Box, Button, Tag, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import useContractState from '@/hooks/useContractState';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { shortenAddress } from '@/utils/string';
import { shouldDisable } from 'useink/utils';

export default function UpgradeVersion() {
  const { api, motherContract, codeHash, contract } = useSpaceContext();
  const { state: latestSpaceCode } = useContractState<string>(motherContract, 'latestSpaceCode');

  const setCodeHashTx = useTx(contract, 'upgradeable::setCodeHash');

  const upgradeToLatestVersion = async () => {
    if (codeHash === latestSpaceCode) return;
    const confirm = window.confirm('Are you sure to upgrade the space to latest version?');
    if (!confirm) return;

    setCodeHashTx.signAndSend([latestSpaceCode], {}, (result) => {
      if (!result) return;

      if (result.isInBlock) {
        if (result.isError || result.dispatchError) {
          if (result.dispatchError?.isModule) {
            console.log(api!.registry.findMetaError(result.dispatchError?.asModule));
          }
          console.error(result.toHuman());
          toast.error('Extrinsic failed!');
        } else {
          toast.success('Space has been upgraded to the latest version!');
        }
      }
    });
  };

  if (!(codeHash && latestSpaceCode)) {
    return null;
  }

  return (
    <Box mt={3} border='1px' borderColor='gray.200' p={4} borderRadius={4} mb={4}>
      <Text fontWeight='semibold'>Version & Upgrade</Text>
      <Box ml={2}>
        <Text mt={3}>
          Current Version:{' '}
          <Tag variant='solid' colorScheme='gray'>
            {shortenAddress(codeHash)}
          </Tag>
        </Text>

        {codeHash !== latestSpaceCode && (
          <>
            <Text mt={3}>
              New Version:{' '}
              <Tag variant='solid' colorScheme='green'>
                {shortenAddress(latestSpaceCode)}
              </Tag>
            </Text>
            <Button
              mt={4}
              size='sm'
              colorScheme='red'
              onClick={upgradeToLatestVersion}
              isDisabled={shouldDisable(setCodeHashTx)}>
              Upgrade
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
