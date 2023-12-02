import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@polkadot/api-augment/polkadot';
import WalletProvider from '@/providers/WalletProvider';
import router from '@/router';
import { theme } from '@/theme';
import { UseInkProvider } from 'useink';
import { Development, RococoContractsTestnet } from 'useink/chains';

const DEFAULT_CALLER = '5FWgDBZM7KNnUrDZpxr8Dij7isrXny2NNzGsovxBDFdWZYSZ';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <UseInkProvider
    config={{
      dappName: 'InSpace',
      chains: [Development, RococoContractsTestnet],
      caller: { default: DEFAULT_CALLER },
    }}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <WalletProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position='top-right'
          closeOnClick
          pauseOnHover
          theme='colored'
          autoClose={5_000}
          hideProgressBar
          limit={2}
        />
      </WalletProvider>
    </ChakraProvider>
  </UseInkProvider>,
);
