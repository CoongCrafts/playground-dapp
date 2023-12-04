import { Box, Button, Flex, Tag, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import useContractState from '@/hooks/useContractState';
import { useTx } from '@/hooks/useink/useTx';
import { useSpaceContext } from '@/providers/SpaceProvider';
import { Pricing } from '@/types';
import { formatBalance, shortenAddress } from '@/utils/string';
import { shouldDisable } from 'useink/utils';

export default function Settings() {
  const { api, network, config, motherContract, codeHash, contract } = useSpaceContext();
  const { state: latestSpaceCode } = useContractState<string>(motherContract, 'latestSpaceCode');

  const pricing = config
    ? typeof config.pricing === 'object'
      ? Object.keys(config.pricing)[0]
      : config.pricing
    : null;
  // @ts-ignore
  const pricingInfo = pricing && typeof config?.pricing === 'object' ? config.pricing[pricing] : null;

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

  return (
    <Box>
      <Flex gap={2}>
        <Text fontSize='xl' fontWeight='semibold'>
          Settings
        </Text>
      </Flex>
      {config && (
        <Box mt={3}>
          <Text fontWeight='semibold'>Membership</Text>
          <Box ml={4}>
            <Text mt={3}>
              Registration type{' '}
              <Tag variant='solid' colorScheme='blue'>
                {config.registration}
              </Tag>
            </Text>
            <Text mt={3}>
              Pricing{' '}
              <Tag variant='solid' colorScheme='green'>
                {pricing}
              </Tag>
            </Text>
            {(pricing === Pricing.OneTimePaid || pricing === Pricing.Subscription) && (
              <Text mt={3}>
                Price <Tag>{formatBalance(pricingInfo.price, network, true)}</Tag>
              </Text>
            )}
            {pricing === Pricing.Subscription && (
              <Text mt={3}>
                Duration{' '}
                <Tag variant='solid' colorScheme='gray'>
                  {pricingInfo.duration} days
                </Tag>
              </Text>
            )}
          </Box>
        </Box>
      )}
      {codeHash && latestSpaceCode && (
        <Box mt={3}>
          <Text fontWeight='semibold'>Upgrade</Text>
          <Box ml={4}>
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
      )}
    </Box>
  );
}
