import { useState } from 'react';
import { useAsync, useToggle } from 'react-use';
import { DelightfulApi, WsProvider } from 'delightfuldot';

export default function useApi(networkEndpoint?: string) {
  const [ready, setReady] = useToggle(false);
  const [provider, setProvider] = useState<WsProvider>();
  const [api, setApi] = useState<DelightfulApi>();

  useAsync(async () => {
    if (!networkEndpoint) {
      return;
    }

    if (api) {
      await api.disconnect();
    }

    setReady(false);

    const wsProvider = new WsProvider(networkEndpoint);
    setProvider(wsProvider);
    setApi(await DelightfulApi.create({ provider: wsProvider }));

    setReady(true);
  }, [networkEndpoint]);

  return { ready, api, provider };
}
