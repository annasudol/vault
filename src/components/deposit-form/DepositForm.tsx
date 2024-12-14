import { useState } from 'react';

const DepositForm = () => {
  const [wethAmount, setWethAmount] = useState('');
  const [rethAmount, setRethAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!wethAmount || !rethAmount) {
      setError('Both fields are required.');
      return;
    }
    try {
      setLoading(true);
      // Call transaction logic here
      setLoading(false);
      // alert('Transaction successful!');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Transaction failed.');
    }
  };

  return (
    <div className="rounded bg-white p-4 shadow-md">
      <h1 className="mb-4 text-xl font-bold">Deposit Funds</h1>
      <div>
        <label className="mb-2 block">WETH Amount:</label>
        <input
          type="number"
          value={wethAmount}
          onChange={(e) => setWethAmount(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>
      <div className="mt-4">
        <label className="mb-2 block">RETH Amount:</label>
        <input
          type="number"
          value={rethAmount}
          onChange={(e) => setRethAmount(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        {loading ? 'Processing...' : 'Deposit'}
      </button>
    </div>
  );
};

export { DepositForm };
