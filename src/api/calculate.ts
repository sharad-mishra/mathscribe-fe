// src/api/calculate.ts
export async function calculateSum(numbers: number[]): Promise<number> {
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_URL}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ numbers }),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate sum');
  }

  const data = await response.json();
  return data.result;
}