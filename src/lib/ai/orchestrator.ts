import { ROLE_PROMPTS } from './promptTemplate';

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY!;
const CEREBRAS_BASE_URL = 'https://api.cerebras.ai/v1';

export async function kickoff_crew(userPrompt: string) {
  const coderPrompt = `${ROLE_PROMPTS.CODER}\n\nUser request: ${userPrompt}\n\nGenerate a complete React component with Tailwind CSS.`;
  const jsx = await callCerebras([{ role: 'user', content: coderPrompt }]);

  const testPrompt = `${ROLE_PROMPTS.QA}\n\nComponent code:\n${jsx}\n\nGenerate a Jest test.`;
  const test = await callCerebras([{ role: 'user', content: testPrompt }]);

  return { 
    spec: `Technical spec for: ${userPrompt}`, 
    arch: 'React + Tailwind CSS + Vite', 
    jsx, 
    test 
  };
}

async function callCerebras(messages: any[]) {
  const res = await fetch(`${CEREBRAS_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CEREBRAS_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama3.1-70b',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  const data = await res.json();
  if (!data.choices || !data.choices[0]) {
    throw new Error(`API Error: ${JSON.stringify(data)}`);
  }
  const msg = data.choices[0].message;
  return msg.content || msg.reasoning || '';
}
