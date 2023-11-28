import { Flex, Text } from '@chakra-ui/react';

function About() {
  return (
    <Flex justify='center'>
      <Flex gap={2} textAlign='center' direction='column' my={8}>
        <Text as='h1' fontSize='5xl' color='primary.300' fontWeight='semibold'>
          InSpace
        </Text>
        <Text fontSize='xl'>Bring your community on chain!</Text>
      </Flex>
    </Flex>
  );
}

export default About;
