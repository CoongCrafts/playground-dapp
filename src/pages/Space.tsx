import {
  Box,
  Button,
  Divider,
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
import React from 'react';
import { Link as LinkRouter, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import SpaceAvatar from '@/components/space/SpaceAvatar';
import UpdateDisplayNameTrigger from '@/pages/space/UpdateDisplayNameTrigger';
import SpaceProvider, { useSpaceContext } from '@/providers/SpaceProvider';
import { MemberStatus } from '@/types';
import { shortenAddress } from '@/utils/string';
import { ChevronDownIcon, InfoIcon, SettingsIcon } from '@chakra-ui/icons';
import pluralize from 'pluralize';
import { ChainId } from 'useink/chains';

type MenuItem = { name: string; path: string; icon: React.ReactElement };

const MENU_ITEMS: MenuItem[] = [
  { name: 'Members', path: 'members', icon: <InfoIcon /> },
  { name: 'Settings', path: 'settings', icon: <SettingsIcon /> },
];

function SpaceContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { info, space, membersCount, memberStatus } = useSpaceContext();

  useEffectOnce(() => {
    if (location.pathname.endsWith(space.address)) {
      navigate(MENU_ITEMS[0].path);
    }
  });

  const activePath = MENU_ITEMS.find((one) => location.pathname.endsWith(one.path))?.path;

  return (
    <Box mt={2}>
      <Flex mb={4} justify='space-between' flexDir={{ base: 'column', md: 'row' }}>
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
        <Box mt={2} alignSelf='end'>
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
                <MenuItem>
                  <UpdateDisplayNameTrigger />
                </MenuItem>
                <MenuItem color='red'>Leave</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </Flex>
      <Divider display={{ base: 'block', md: 'none' }} />
      <Flex mt={{ base: 0, md: 8 }} flexDir={{ base: 'column', md: 'row' }}>
        <Flex direction='column' width={200} display={{ base: 'none', md: 'flex' }}>
          {MENU_ITEMS.map((one) => (
            <Button
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
        <Tabs
          variant='unstyled'
          overflowX='scroll'
          display={{ base: 'block', md: 'none' }}
          style={{ scrollbarWidth: 'none' }} // Hide scrollbar on Firefox
          css={{
            '&::-webkit-scrollbar': {
              display: 'none', // Hide scrollbar on Chromium
            },
          }}>
          <TabList>
            {MENU_ITEMS.map((one) => (
              <Tab key={one.name} as={LinkRouter} to={one.path}>
                {one.name}
              </Tab>
            ))}
          </TabList>
          <TabIndicator mt='-3px' height='3px' bg='blue.500' borderRadius='2rem' />
        </Tabs>
        <Box flex={1} borderWidth={1} borderColor='chakra-border-color' p={4}>
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
