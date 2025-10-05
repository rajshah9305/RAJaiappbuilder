/**
 * RAJ AI APP BUILDER - AI Generation API Route
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 * 
 * Streams AI-generated code using Cerebras GPT-OSS-120B
 */

import { NextRequest } from 'next/server';

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY!;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  
  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Prompt required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Stage 1: Generate Code
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stage: 'code', status: 'generating' })}\n\n`));
        
        const codePrompt = `Create a beautiful, interactive React component for: ${prompt}

Requirements:
- Use function syntax: function ComponentName() {}
- Use React.useState for state
- Use Tailwind CSS for styling (gradients, shadows, animations)
- Make it visually stunning and fully functional
- NO imports, NO exports
- Return ONLY the component code`;

        const codeResponse = await fetch('https://api.cerebras.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CEREBRAS_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-oss-120b',
            messages: [{ role: 'user', content: codePrompt }],
            temperature: 1,
            top_p: 1,
            max_completion_tokens: 65536,
            stream: true
          })
        });

        let fullCode = '';
        const reader = codeResponse.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));
            
            for (const line of lines) {
              const data = line.replace('data: ', '').trim();
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  fullCode += content;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    stage: 'code', 
                    status: 'streaming',
                    content: content 
                  })}\n\n`));
                }
              } catch (e) {}
            }
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          stage: 'code', 
          status: 'complete',
          fullContent: fullCode
        })}\n\n`));

        // Stage 2: Generate Tests
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stage: 'test', status: 'generating' })}\n\n`));

        const testPrompt = `Generate Jest tests for this React component:\n\n${fullCode}\n\nReturn ONLY the test code.`;

        const testResponse = await fetch('https://api.cerebras.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CEREBRAS_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-oss-120b',
            messages: [{ role: 'user', content: testPrompt }],
            temperature: 1,
            top_p: 1,
            max_completion_tokens: 65536,
            stream: true
          })
        });

        let fullTest = '';
        const testReader = testResponse.body?.getReader();

        if (testReader) {
          while (true) {
            const { done, value } = await testReader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));
            
            for (const line of lines) {
              const data = line.replace('data: ', '').trim();
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  fullTest += content;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    stage: 'test', 
                    status: 'streaming',
                    content: content 
                  })}\n\n`));
                }
              } catch (e) {}
            }
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          stage: 'test', 
          status: 'complete',
          fullContent: fullTest
        })}\n\n`));

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          stage: 'done',
          spec: `Technical specification for: ${prompt}`,
          arch: 'React + Tailwind CSS'
        })}\n\n`));

        controller.close();
      } catch (error: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          stage: 'error',
          error: error.message 
        })}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
