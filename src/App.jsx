import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

function App() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / 1e9); // lamports to SOL
    };

    fetchBalance();
  }, [publicKey, connection]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Solana Wallet Dashboard</h1>
      <WalletMultiButton />

      {publicKey && (
        <div className="mt-6">
          <p className="break-all mb-2">
            <strong>Public Key:</strong> {publicKey.toBase58()}
          </p>
          <p>
            <strong>SOL Balance:</strong> {balance === null ? 'Loading...' : `${balance} SOL`}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
