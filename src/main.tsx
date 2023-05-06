import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from '@/App';
import ApiProvider from '@/providers/ApiProvider';
import WalletProvider from '@/providers/WalletProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ChakraProvider>
    <WalletProvider>
      <ApiProvider>
        <App />
        <ToastContainer
          position='top-right'
          closeOnClick
          pauseOnHover
          theme='colored'
          autoClose={5_000}
          hideProgressBar
          limit={2}
        />
      </ApiProvider>
    </WalletProvider>
  </ChakraProvider>,
);
