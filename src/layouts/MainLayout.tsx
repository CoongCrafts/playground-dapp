import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import MainFooter from '@/components/shared/MainFooter';
import MainHeader from '@/components/shared/MainHeader';

export default function MainLayout() {
  return (
    <Flex direction='column' minHeight='100vh'>
      <MainHeader />
      <Box maxWidth='container.lg' mx='auto' mt={4} mb={10} px={4} flex={1} w='full'>
        <Outlet />
      </Box>
      <MainFooter />
    </Flex>
  );
}
