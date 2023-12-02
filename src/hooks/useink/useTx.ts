import { useMemo, useState } from 'react';
import { useDryRun } from '@/hooks/useink/useDryRun';
import { useWalletContext } from '@/providers/WalletProvider';
import { ChainContract, useTxEvents } from 'useink';
import {
  ApiBase,
  ContractSubmittableResult,
  EventRecord,
  LazyContractOptions,
  toContractOptions,
  TransactionStatus,
} from 'useink/core';

export type ContractSubmittableResultCallback = (
  result?: ContractSubmittableResult,
  api?: ApiBase<'promise'>,
  error?: unknown,
) => void;

export type SignAndSend = (args?: unknown[], o?: LazyContractOptions, cb?: ContractSubmittableResultCallback) => void;

export interface Tx<_T> {
  signAndSend: SignAndSend;
  status: TransactionStatus;
  result: ContractSubmittableResult | undefined;
  resetState: () => void;
  events: EventRecord[];
}

export function useTx<T>(chainContract: ChainContract | undefined, message: string): Tx<T> {
  const { selectedAccount, injectedApi } = useWalletContext();
  const [status, setStatus] = useState<TransactionStatus>('None');
  const [result, setResult] = useState<ContractSubmittableResult>();
  const dryRun = useDryRun(chainContract, message);
  const txEvents = useTxEvents({ status, result });

  const signAndSend: SignAndSend = useMemo(
    () => (params, options, cb) => {
      if (!chainContract?.contract || !selectedAccount || !injectedApi) {
        return;
      }

      dryRun
        .send(params, options)
        .then((response) => {
          console.log('response', params, options);
          if (!response || !response.ok) return;
          setStatus('PendingSignature');

          const { gasRequired } = response.value.raw;
          const tx = chainContract?.contract.tx[message];

          if (!tx) {
            cb?.(undefined, chainContract.contract.api, `'${message}' not found on contract instance`);
            return;
          }

          tx({ gasLimit: gasRequired, ...toContractOptions(options) }, ...(params || []))
            .signAndSend(
              selectedAccount.address,
              { signer: injectedApi.signer },
              (response: ContractSubmittableResult) => {
                setResult(response);
                setStatus(response.status.type);
                cb?.(response, chainContract?.contract.api);
              },
            )
            .catch((e: unknown) => {
              cb?.(undefined, chainContract.contract.api, e);
              setStatus('None');
            });
        })
        .catch((e) => {
          cb?.(undefined, chainContract.contract.api, e);
          setStatus('None');
        });
    },
    [selectedAccount, injectedApi?.signer, chainContract?.contract],
  );

  return {
    signAndSend,
    status,
    result,
    resetState: () => {
      setResult(undefined);
      setStatus('None');
      txEvents.resetState();
    },
    events: txEvents.events,
  };
}
