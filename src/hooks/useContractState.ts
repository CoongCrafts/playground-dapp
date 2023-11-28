import { ChainContract, useBlockHeader, useCall, useWallet } from "useink";
import { ContractPromise } from "@polkadot/api-contract";
import { useState } from "react";
import { useAsync } from "react-use";
import { pickDecoded } from "useink/utils";

export default function useContractState<T>(contract: ChainContract<ContractPromise> | undefined, message: string, args: unknown[] = [], defaultCaller = true) {
  const [state, setState] = useState<T>();
  const call = useCall<T>(contract, message);
  const blockNumber = useBlockHeader()?.blockNumber;
  const { account } = useWallet();

  useAsync(async () => {
    const result = await call.send(args, { defaultCaller });
    setState(pickDecoded<T>(result));
  }, [account, call.send, blockNumber])

  return { state };
}
