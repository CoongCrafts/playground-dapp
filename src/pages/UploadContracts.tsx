import { Box, Flex, Text } from "@chakra-ui/react";
import UploadCode from "@/components/contracts/UploadCode";

export default function UploadContracts() {
  return (
    <>
      <Text fontSize='2xl' fontWeight='semibold' mb={2}>
        Upload Contracts Code
      </Text>
      <Flex direction='column' gap={4}>
        <Box>
          <UploadCode />
        </Box>
      </Flex>
    </>
  );
}
