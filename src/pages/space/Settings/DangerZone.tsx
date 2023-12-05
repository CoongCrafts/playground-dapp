import { Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';

export default function DangerZone() {
  const comingSoon = (message: string = '') => {
    toast.info(message || 'Coming soon!');
  };

  return (
    <Box mt={3} border='1px' borderColor='red.300' backgroundColor='red.50' p={4} borderRadius={4} mb={4}>
      <Text fontWeight='semibold'>Danger Zone</Text>
      <Flex justify='space-between' align='center' py={4}>
        <Box>
          <Text fontSize='lg' fontWeight='semibold'>
            Transfer ownership
          </Text>
          <Text fontSize='sm'>Transfer current ownership to a different address</Text>
        </Box>
        <Box>
          <Button colorScheme='red' onClick={() => comingSoon('Transfer ownership coming soon!')}>
            Transfer Ownership
          </Button>
        </Box>
      </Flex>

      <Divider />

      <Flex justify='space-between' align='center' pt={4}>
        <Box>
          <Text fontSize='lg' fontWeight='semibold'>
            Archive Space
          </Text>
          <Text fontSize='sm'>Set the space to read-only mode</Text>
        </Box>
        <Box>
          <Button colorScheme='red' onClick={() => comingSoon('Archive space coming soon!')}>
            Archive Space
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
