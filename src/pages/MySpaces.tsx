import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpaceCard from '@/components/space/SpaceCard';
import useSpaces from '@/hooks/useSpaces';
import { useWalletContext } from '@/providers/WalletProvider';
import { Development, RococoContractsTestnet } from 'useink/chains';

export default function MySpaces() {
  const navigate = useNavigate();
  const { selectedAccount } = useWalletContext();
  const devSpaces = useSpaces(Development.id);
  const rococoSpaces = useSpaces(RococoContractsTestnet.id);

  const spaces = [...devSpaces, ...rococoSpaces];

  useEffect(() => {
    if (!selectedAccount) {
      navigate('/');
    }
  }, [selectedAccount]);

  return (
    <Box>
      <Flex flex={1} justify='space-between' alignItems='center' mb={4}>
        <Text fontSize='xl' fontWeight='semibold'>
          My Spaces
        </Text>
        <Button onClick={() => navigate('/launch')}>New Space</Button>
      </Flex>
      <Flex gap={4} flexWrap='wrap'>
        {spaces?.map((space) => (
          <SpaceCard
            w={{ base: '100%', md: 'calc((100% - 2rem)/3)', lg: 'calc((100% - 3rem)/4)' }}
            space={space}
            key={space.address}
          />
        ))}
      </Flex>
    </Box>
  );
}
