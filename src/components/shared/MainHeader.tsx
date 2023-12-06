import { Box, Container, Flex, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import AccountSelection from '@/components/AccountSelection';
import WalletSelection from '@/components/dialog/WalletSelection';
import { useWalletContext } from '@/providers/WalletProvider';

const MENU_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'About', path: '#' },
];

export default function MainHeader() {
  const { pathname } = useLocation();
  const { injectedApi } = useWalletContext();
  const activeIndex = MENU_ITEMS.findIndex((one) => pathname == one.path || pathname.split('/').at(-1) === one.path);
  console.log(activeIndex);

  return (
    <Box borderBottom={1} borderStyle='solid' borderColor='chakra-border-color'>
      <Container
        maxWidth='container.lg'
        px={4}
        mx='auto'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        gap={4}
        h={16}>
        <Link to='/'>
          <Text fontSize='3xl' fontWeight='bold' color='primary.300'>
            inspace
          </Text>
        </Link>
        <Flex gap={4} fontWeight='semibold'>
          {MENU_ITEMS.map((one, index) => (
            <Link key={one.name} to={one.path}>
              <Text
                color={activeIndex === index ? 'primary.600' : 'gray.600'}
                textDecoration={activeIndex === index ? 'underline' : 'none'}>
                {one.name}
              </Text>
            </Link>
          ))}
        </Flex>
        <Flex gap={2} alignItems='center'>
          {!!injectedApi ? <AccountSelection /> : <WalletSelection />}
        </Flex>
      </Container>
    </Box>
  );
}
