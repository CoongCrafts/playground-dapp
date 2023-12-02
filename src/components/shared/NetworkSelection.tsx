import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ChainEnvironments, NetworkInfo, Props } from '@/types';
import { SUPPORTED_NETWORKS } from '@/utils/networks';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface NetworkSelectionProps extends Props {
  onSelect: (network: NetworkInfo) => void;
  defaultNetwork?: NetworkInfo;
}

export default function NetworkSelection({ onSelect, defaultNetwork }: NetworkSelectionProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkInfo>();
  const [smallest] = useMediaQuery('(max-width: 325px)');

  useEffect(() => {
    setSelectedNetwork(defaultNetwork);
  }, [defaultNetwork]);

  const doSelect = (network: NetworkInfo) => {
    setSelectedNetwork(network);
    onSelect(network);
  };

  return (
    <Menu autoSelect={false}>
      <MenuButton as={Button} minWidth={250} rightIcon={<ChevronDownIcon />}>
        <Flex direction='row' align='center' gap={2}>
          {selectedNetwork ? (
            <>
              <Avatar size='xs' src={selectedNetwork.logo} />
              {!smallest && <span>{selectedNetwork.name}</span>}
            </>
          ) : (
            <Text>Select a network</Text>
          )}
        </Flex>
      </MenuButton>
      <MenuList>
        {ChainEnvironments.map((env) => (
          <MenuGroup key={env} title={env}>
            {SUPPORTED_NETWORKS[env].map((one) => (
              <MenuItem
                key={one.id}
                onClick={() => doSelect(one)}
                isDisabled={one.disabled}
                backgroundColor={one.id === selectedNetwork?.id ? 'active-menu-item-bg' : ''}>
                <Flex direction='row' align='center' gap={2}>
                  <Avatar size='xs' src={one.logo} />
                  <span>{one.name}</span>
                </Flex>
              </MenuItem>
            ))}
          </MenuGroup>
        ))}
      </MenuList>
    </Menu>
  );
}
