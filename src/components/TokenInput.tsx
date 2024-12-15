interface TokenInputProps {
  token: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ token, value, onChange }) => (
  <div className="mb-4">
    <label className="mb-2 block text-sm font-medium text-white">
      {token} Amount
    </label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={`Enter ${token} amount`}
      className="w-full rounded border border-gray-600 bg-gray-800 px-4 py-2 text-white"
    />
  </div>
);

export default TokenInput;
