import { Box, Text } from '@chakra-ui/react';
import { useSpaceContext } from '@/providers/SpaceProvider';

export default function Plugins() {
  const { info } = useSpaceContext();

  if (!info) {
    return null;
  }

  return (
    <Box mt={3} border='1px' borderColor='gray.200' p={4} borderRadius={4} mb={4}>
      <Text fontWeight='semibold'>Plugins</Text>
    </Box>
  );
}
