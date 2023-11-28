import { Props } from "@/types";
import { ChainId } from "useink/chains";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { findNetwork } from "@/utils/networks";

interface NetworkLabelProps extends Props {
  chainId: ChainId
}

export default function NetworkLabel({chainId}: NetworkLabelProps) {
  const network = findNetwork(chainId);
  return (
    <Tooltip label={network.name} id={network.name} placement='top'>
      <Avatar size='xs' src={network.logo}/>
    </Tooltip>
  )
}
