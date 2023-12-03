import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link as LinkRouter, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import SpaceAvatar from '@/components/space/SpaceAvatar';
import UpdateDisplayNameTrigger from '@/pages/space/UpdateDisplayNameTrigger';
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

  if (!plugins || !menuItems) {
    return null;
  }

  const activeIndex = menuItems.findIndex((one) => location.pathname.endsWith(one.path));

  return (
    <Box mt={2}>
      <Flex mb={4} justify='space-between'>
        <Flex gap={{ base: 4, sm: 6 }} flexDir={{ base: 'column', sm: 'row' }}>
          {info && <SpaceAvatar space={space} info={info} />}
          <Flex gap={{ base: 4, md: 8 }} flexDir={{ base: 'column', md: 'row' }}>
            <Box>
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
              <Text fontSize='md' color='gray' mt={2}>
                {info?.desc}
              </Text>
            </Box>
            <Box>
              {memberStatus === MemberStatus.None && (
                <Button colorScheme='primary' size='sm' width={100}>
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
                  <MenuButton
                    as={Button}
                    colorScheme='primary'
                    variant='outline'
                    size='sm'
                    width={100}
                    rightIcon={<ChevronDownIcon />}>
                    Joined
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <UpdateDisplayNameTrigger />
                    </MenuItem>
                    <MenuItem color='red'>Leave</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Flex mt={{ base: 0, md: 8 }} flexDir={{ base: 'column', md: 'row' }}>
        <Flex // Navigation bar for large screen
          direction='column'
          width={200}
          display={{ base: 'none', md: 'flex' }}>
          <Box position='sticky' top={4}>
            {menuItems.map((one, index) => (
              <Button
                key={one.name}
                leftIcon={one.icon}
                justifyContent={'start'}
                fontSize='sm'
                width='100%'
                gap={2}
                as={LinkRouter}
                variant='outline'
                colorScheme={activeIndex == index ? 'primary' : 'gray'}
                _active={{ background: 'transparent' }}
                _hover={{ background: 'transparent' }}
                borderRadius={0}
                to={one.path}>
                {one.name}
              </Button>
            ))}
          </Box>
        </Flex>
        <Tabs // Navigation bar for small screen
          index={activeIndex}
          position='relative'
          variant='unstyled'
          borderTop='1px solid'
          borderColor='chakra-border-color'
          overflowX='scroll'
          display={{ base: 'block', md: 'none' }}
          style={{ scrollbarWidth: 'none' }} // Hide scrollbar on Firefox
          css={{
            '&::-webkit-scrollbar': {
              display: 'none', // Hide scrollbar on Chromium
            },
          }}>
          <TabList>
            {menuItems.map((one) => (
              <Tab key={one.name} as={LinkRouter} to={one.path} _selected={{ boxShadow: 'none' }}>
                {one.name}
              </Tab>
            ))}
          </TabList>
          <TabIndicator mt='-3px' height='3px' bg='primary.500' borderRadius='2rem' />
        </Tabs>
        <Box
          flex={1}
          borderLeftWidth={{ base: 0, md: 1 }}
          borderTopWidth={{ base: 1, md: 0 }}
          borderColor='chakra-border-color'
          ml={{ base: 0, md: 3 }}
          pl={{ base: 0, md: 3 }}
          pt={{ base: 4, md: 1 }}>
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