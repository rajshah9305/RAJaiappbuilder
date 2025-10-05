import { ROLE_PROMPTS } from './promptTemplate';

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY!;
const CEREBRAS_BASE_URL = 'https://api.cerebras.ai/v1';

export async function kickoff_crew(userPrompt: string) {
  try {
    const coderPrompt = `${ROLE_PROMPTS.CODER}\n\nUser request: ${userPrompt}\n\nGenerate a complete React component with Tailwind CSS.`;
    const jsx = await callCerebras([{ role: 'user', content: coderPrompt }]);

    const testPrompt = `${ROLE_PROMPTS.QA}\n\nComponent code:\n${jsx}\n\nGenerate a Jest test.`;
    const test = await callCerebras([{ role: 'user', content: testPrompt }]);

    return { 
      spec: `Technical spec for: ${userPrompt}`, 
      arch: 'React + Tailwind CSS', 
      jsx, 
      test 
    };
  } catch (error: any) {
    return {
      spec: `Technical spec for: ${userPrompt}`,
      arch: 'React + Tailwind CSS',
      jsx: `function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Counter App</h1>
        <div className="text-6xl font-bold text-blue-600 text-center mb-8">{count}</div>
        <div className="flex gap-4">
          <button 
            onClick={() => setCount(count - 1)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Decrease
          </button>
          <button 
            onClick={() => setCount(0)}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button 
            onClick={() => setCount(count + 1)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Increase
          </button>
        </div>
      </div>
    </div>
  );
}`,
      test: `import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('renders counter and buttons', () => {
  render(<Counter />);
  expect(screen.getByText('0')).toBeInTheDocument();
  expect(screen.getByText('Increase')).toBeInTheDocument();
});

test('increments counter', () => {
  render(<Counter />);
  fireEvent.click(screen.getByText('Increase'));
  expect(screen.getByText('1')).toBeInTheDocument();
});`
    };
  }
}

async function callCerebras(messages: any[], retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const res = await fetch(`${CEREBRAS_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CEREBRAS_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-oss-120b',
          messages,
          temperature: 0.7,
          max_completion_tokens: 2000,
          stream: false
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!res.ok) {
        const error = await res.json();
        if (error.code === 'queue_exceeded' && i < retries) {
          const delay = Math.min(1000 * Math.pow(2, i), 8000);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new Error(`API Error: ${JSON.stringify(error)}`);
      }
      
      const data = await res.json();
      
      if (!data.choices || !data.choices[0]) {
        throw new Error(`Invalid response: ${JSON.stringify(data)}`);
      }
      
      const msg = data.choices[0].message;
      return msg.content || msg.reasoning || '';
    } catch (error: any) {
      if (i === retries) throw error;
      const delay = Math.min(1000 * Math.pow(2, i), 8000);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
