import { Box, Flex, Text } from '@chakra-ui/react';
import DangerZone from '@/pages/space/Settings/DangerZone';
import Membership from '@/pages/space/Settings/Membership';
import Plugins from '@/pages/space/Settings/Plugins';
import SpaceInfo from '@/pages/space/Settings/SpaceInfo';
import UpgradeVersion from '@/pages/space/Settings/UpgradeVersion';
import { useSpaceContext } from '@/providers/SpaceProvider';

export default function Settings() {
  const { isOwner } = useSpaceContext();

  return (
    <Box>
      <Flex gap={2}>
        <Text fontSize='xl' fontWeight='semibold'>
          Settings
        </Text>
      </Flex>
      <SpaceInfo />
      <Membership />
      <Plugins />
      <UpgradeVersion />
      {isOwner && <DangerZone />}
    </Box>
  );
}
