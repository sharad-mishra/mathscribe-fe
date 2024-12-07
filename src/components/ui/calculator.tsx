// src/components/ui/calculator.tsx
import React, { useState } from 'react';
import { calculateSum } from '../../api/calculate';

const Calculator: React.FC = () => {
  const [numbers, setNumbers] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setError(null);
    setResult(null);
    const numArray = numbers.split(',').map(Number).filter(n => !isNaN(n));

    try {
      const sum = await calculateSum(numArray);
      setResult(sum);
    } catch (err) {
      setError('Calculation failed.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Calculator</h2>
      <input
        type="text"
        value={numbers}
        onChange={(e) => setNumbers(e.target.value)}
        placeholder="Enter numbers separated by commas"
        className="border p-2 w-full mb-2"
      />
      <button onClick={handleCalculate} className="bg-blue-500 text-white p-2">
        Calculate Sum
      </button>
      {result !== null && <p className="mt-2">Result: {result}</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default Calculator;