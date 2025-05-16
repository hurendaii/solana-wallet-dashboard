import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';

function App() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / 1e9); // Convert lamports to SOL
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalance(null);
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  useEffect(() => {
    const fetchTokenAccounts = async () => {
      if (!publicKey) return;

      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
        );

        console.log("Raw tokenAccounts:", tokenAccounts);

        const filteredTokens = tokenAccounts.value.map((account) => {
          const info = account.account.data.parsed.info;
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmount,
            decimals: info.tokenAmount.decimals,
            owner: info.owner,  // add owner for debugging
          };
        });

        console.log("Parsed tokens:", filteredTokens);

        const tokensWithBalance = filteredTokens.filter(t => t.amount && t.amount > 0);

        console.log("Tokens with balance:", tokensWithBalance);

        setTokens(tokensWithBalance);
      } catch (err) {
        console.error("Error fetching tokens:", err);
      }
    };

    fetchTokenAccounts();
  }, [publicKey, connection]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="container max-w-xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Solana Wallet Dashboard</h1>
        <div className="flex justify-center mb-6">
          <WalletMultiButton />
        </div>

        {publicKey && (
          <div className="mb-6 text-left">
            <p className="break-all mb-2">
              <strong>Public Key:</strong> {publicKey.toBase58()}
            </p>
            <p>
              <strong>SOL Balance:</strong> {balance === null ? 'Loading...' : `${balance} SOL`}
            </p>
          </div>
        )}

        {publicKey && (
          <div className="text-left">
            <h2 className="font-semibold mb-2">SPL Tokens:</h2>
            {tokens.length > 0 ? (
              <ul className="list-disc list-inside">
                {tokens.map((token, idx) => (
                  <li key={idx}>
                    Mint: {token.mint} — Balance: {token.amount}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">You have no tokens associated with this account.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

}

export default App;
