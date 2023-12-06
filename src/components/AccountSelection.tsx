import {
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { useEffect, useMemo } from 'react';
import useDisplayAddress from '@/hooks/useDisplayAddress';
import { useWalletContext } from '@/providers/WalletProvider';
import { shortenAddress } from '@/utils/string';
import WebsiteWallet from '@/wallets/WebsiteWallet';
import { ChevronDownIcon } from '@chakra-ui/icons';

export default function AccountSelection() {
  const { accounts, injectedApi, signOut, connectedWallet, selectedAccount, setSelectedAccount } = useWalletContext();
  const accountsUpdateAvailable = useMemo(() => !!injectedApi?.accounts?.update, [injectedApi]);
  const displayAddress = useDisplayAddress(selectedAccount?.address);

  useEffect(() => {
    if (selectedAccount && accounts.map((one) => one.address).includes(selectedAccount.address)) {
      return;
    }

    setSelectedAccount(accounts[0]);
  }, [accounts]);

  if (!selectedAccount) {
    return <></>;
  }

  const updateAccounts = async () => {
    if (!accountsUpdateAvailable) {
      return;
    }

    // @ts-ignore
    await injectedApi.accounts.update();
  };

  const { name, address } = selectedAccount;

  return (
    <Box>
      <Menu autoSelect={false}>
        <MenuButton as={Button} variant='outline' size='sm' rightIcon={<ChevronDownIcon />}>
          <Flex align='center' gap={3}>
            <Identicon value={address} size={20} theme='polkadot' />
            <Flex gap={1} display={{ base: 'none', sm: 'flex' }}>
              <Text fontWeight='semibold'>{name}</Text>
              <Text>({shortenAddress(displayAddress)})</Text>
            </Flex>
          </Flex>
        </MenuButton>
        <MenuList>
          <Flex align='center' gap={3} flex={1} justify='center' pb={2}>
            <img src={connectedWallet?.logo} alt={connectedWallet?.name} width={24} />
            {connectedWallet instanceof WebsiteWallet ? (
              <Link href={connectedWallet.walletUrl} target='_blank'>
                <Text fontWeight='600' fontSize='14'>
                  {connectedWallet?.name} - v{connectedWallet?.version}
                </Text>
              </Link>
            ) : (
              <Text fontWeight='600' fontSize='14'>
                {connectedWallet?.name} - v{connectedWallet?.version}
              </Text>
            )}
          </Flex>
          <MenuGroup>
            {accounts.map((one) => (
              <MenuItem
                backgroundColor={one.address === address ? 'active-menu-item-bg' : ''}
                gap={2}
                key={one.address}
                onClick={() => setSelectedAccount(one)}>
                <Identicon value={one.address} size={20} theme='polkadot' />
                <span>
                  {one.name} ({shortenAddress(one.address)})
                </span>
              </MenuItem>
            ))}
          </MenuGroup>
          <MenuDivider />
          {accountsUpdateAvailable && (
            <MenuItem onClick={updateAccounts}>
              <span>Add/Remove Accounts</span>
            </MenuItem>
          )}
          <MenuItem onClick={signOut} color='red.500'>
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
