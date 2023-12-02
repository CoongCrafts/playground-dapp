import { Box, Button, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link as LinkRouter, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import SpaceAvatar from '@/components/space/SpaceAvatar';
import SpaceProvider, { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberStatus } from '@/types';
import { PLUGIN_POSTS } from '@/utils/plugins';
import { shortenAddress } from '@/utils/string';
import { CalendarIcon, ChevronDownIcon, InfoIcon, SettingsIcon } from '@chakra-ui/icons';
import pluralize from 'pluralize';
import { ChainId } from 'useink/chains';

type MenuItem = { name: string; path: string; icon: React.ReactElement };

const MENU_ITEMS: MenuItem[] = [
  { name: 'Members', path: 'members', icon: <InfoIcon /> },
  { name: 'Settings', path: 'settings', icon: <SettingsIcon /> },
];

const PLUGIN_MENU_ITEMS: Record<string, MenuItem> = {
  [PLUGIN_POSTS]: { name: 'Posts', path: 'posts', icon: <CalendarIcon /> },
};

function SpaceContent() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>();
  const navigate = useNavigate();
  const location = useLocation();
  const { info, space, membersCount, memberStatus, plugins } = useSpaceContext();

  useEffect(() => {
    if (!plugins) return;

    const pluginMenuItems = plugins.map(({ id }) => PLUGIN_MENU_ITEMS[id]).filter((x) => x);
    const menuItems = [...pluginMenuItems, ...MENU_ITEMS];

    if (location.pathname.endsWith(space.address)) {
      navigate(menuItems[0].path);
    }

    setMenuItems(menuItems);
  }, [plugins]);

  if (!plugins) {
    return null;
  }

  const activePath = menuItems?.find((one) => location.pathname.endsWith(one.path))?.path;

  return (
    <Box mt={2}>
      <Flex justify='space-between'>
        <Flex gap={6}>
          {info && <SpaceAvatar space={space} info={info} />}
          <Box mt={2}>
            <Heading size='md' mb={1}>
              {info?.name}
            </Heading>
            <Text as='span' fontSize='md' fontWeight='semibold' color='gray'>
              {shortenAddress(space.address)}
            </Text>{' '}
            •{' '}
            <Text as='span' fontSize='md' color='gray'>
              {membersCount} {pluralize('member', membersCount)}
            </Text>
            <Text fontSize='md' color='gray'>
              {info?.desc}
            </Text>
          </Box>
        </Flex>
        <Box mt={2}>
          {memberStatus === MemberStatus.None && (
            <Button colorScheme='primary' variant='outline' size='sm' width={100}>
              Join
            </Button>
          )}
          {memberStatus === MemberStatus.Inactive && (
            <Button colorScheme='primary' variant='outline' size='sm' width={100}>
              Reactive
            </Button>
          )}
          {memberStatus === MemberStatus.Active && (
            <Menu>
              <MenuButton as={Button} variant='outline' size='sm' width={100} rightIcon={<ChevronDownIcon />}>
                Joined
              </MenuButton>
              <MenuList>
                <MenuItem>Set Display Name</MenuItem>
                <MenuItem color='red'>Leave</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </Flex>

      <Flex gap={2} mt={6}>
        <Flex direction='column' width={200}>
          {menuItems?.map((one) => (
            <Button
              justifyContent='start'
              px={4}
              key={one.name}
              size='sm'
              leftIcon={one.icon}
              as={LinkRouter}
              variant={activePath == one.path ? 'solid' : 'outline'}
              colorScheme={activePath == one.path ? 'blackAlpha' : 'gray'}
              borderRadius={0}
              to={one.path}>
              {one.name}
            </Button>
          ))}
        </Flex>
        <Box flex={1} borderLeftWidth={1} borderColor='chakra-border-color' ml={2} pl={4}>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
}

export default function Space() {
  const { chainId, spaceAddress } = useParams();

  return (
    <SpaceProvider space={{ address: spaceAddress!, chainId: chainId as ChainId }}>
      <SpaceContent />
    </SpaceProvider>
  );
}
