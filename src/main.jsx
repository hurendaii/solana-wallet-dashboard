import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { clusterApiUrl } from '@solana/web3.js';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';

import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';

const AppWrapper = () => {
  const endpoint = clusterApiUrl('devnet');
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
