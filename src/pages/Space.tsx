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
  Tag,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link as LinkRouter, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import SpaceAvatar from '@/components/space/SpaceAvatar';
import CancelRequestButton from '@/pages/space/actions/CancelRequestButton';
import JoinButton from '@/pages/space/actions/JoinButton';
import LeaveSpaceButton from '@/pages/space/actions/LeaveSpaceButton';
import UpdateDisplayNameButton from '@/pages/space/actions/UpdateDisplayNameButton';
import SpaceProvider, { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberStatus, RegistrationType } from '@/types';
import { PLUGIN_FLIPPER, PLUGIN_POSTS } from '@/utils/plugins';
import { shortenAddress } from '@/utils/string';
import { CalendarIcon, ChevronDownIcon, HamburgerIcon, InfoIcon, SettingsIcon, StarIcon } from '@chakra-ui/icons';
import pluralize from 'pluralize';
import { ChainId } from 'useink/chains';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactElement;
};

const MENU_ITEMS: MenuItem[] = [
  { name: 'Members', path: 'members', icon: <InfoIcon /> },
  { name: 'Pending Members', path: 'pending-members', icon: <HamburgerIcon /> },
  { name: 'Settings', path: 'settings', icon: <SettingsIcon /> },
];

const PLUGIN_MENU_ITEMS: Record<string, MenuItem> = {
  [PLUGIN_POSTS]: { name: 'Posts', path: 'posts', icon: <CalendarIcon /> },
  [PLUGIN_FLIPPER]: { name: 'Flipper', path: 'flipper', icon: <StarIcon /> },
};

function SpaceContent() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>();
  const navigate = useNavigate();
  const location = useLocation();
  const { info, config, space, membersCount, pendingRequestsCount, memberStatus, isOwner, plugins, pendingRequest } =
    useSpaceContext();

  const showPendingMembers = config?.registration === RegistrationType.RequestToJoin && isOwner;

  useEffect(() => {
    if (!plugins) return;

    const pluginMenuItems = plugins
      .filter(({ disabled }) => !disabled)
      .map(({ id }) => PLUGIN_MENU_ITEMS[id])
      .filter((x) => x);
    let menuItems = [...pluginMenuItems, ...MENU_ITEMS];
    if (!showPendingMembers) {
      menuItems = menuItems.filter((x) => x.path !== 'pending-members');
    }

    if (location.pathname.endsWith(space.address)) {
      navigate(menuItems[0].path);
    }

    setMenuItems(menuItems);
  }, [plugins]);

  if (!plugins || !menuItems) {
    return null;
  }

  const activeIndex = menuItems.findIndex((one) => location.pathname.split('/').at(-1) === one.path);
  const showJoinBtn = config?.registration !== RegistrationType.InviteOnly;

  return (
    <Box mt={2}>
      <Flex mb={4} gap={{ base: 4, sm: 6 }} flexDir={{ base: 'column', sm: 'row' }}>
        <Box>{info && <SpaceAvatar space={space} info={info} />}</Box>
        <Flex flex={1} justify='space-between' gap={{ base: 4, md: 8 }} flexDir={{ base: 'column', md: 'row' }}>
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
            {showJoinBtn &&
              (memberStatus === MemberStatus.None || memberStatus === MemberStatus.Left) &&
              (pendingRequest ? <CancelRequestButton /> : <JoinButton />)}
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
                    <UpdateDisplayNameButton />
                  </MenuItem>
                  {!isOwner && (
                    <MenuItem color='red'>
                      <LeaveSpaceButton />
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            )}
          </Box>
        </Flex>
      </Flex>
      <Flex mt={{ base: 0, md: 8 }} flexDir={{ base: 'column', md: 'row' }}>
        <Flex // Navigation bar for large screen
          direction='column'
          width={220}
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
                {one.path === 'pending-members' && !!pendingRequestsCount && (
                  <Tag size='sm' colorScheme='red' variant='solid'>
                    {pendingRequestsCount}
                  </Tag>
                )}
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
              <Tab key={one.name} as={LinkRouter} to={one.path} _selected={{ boxShadow: 'none' }} whiteSpace='nowrap'>
                {one.name}
                {one.path === 'pending-members' && !!pendingRequestsCount && (
                  <Tag ml={2} size='sm' colorScheme='red' variant='solid'>
                    {pendingRequestsCount}
                  </Tag>
                )}
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
