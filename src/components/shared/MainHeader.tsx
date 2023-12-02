import { Box, Container, Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import AccountSelection from '@/components/AccountSelection';
import WalletSelection from '@/components/dialog/WalletSelection';
import { useWalletContext } from '@/providers/WalletProvider';

export default function MainHeader() {
  const { injectedApi } = useWalletContext();

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
          <Text fontSize='3xl' color='primary.300'>
            inspace
          </Text>
        </Link>
        <Flex gap={2} alignItems='center'>
          {!!injectedApi ? <AccountSelection /> : <WalletSelection />}
        </Flex>
      </Container>
    </Box>
  );
}
