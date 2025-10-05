'use client';
import { useState } from 'react';

const examples = [
  'Todo list with drag and drop',
  'Weather dashboard with animations',
  'Calculator with history',
  'Pomodoro timer with stats'
];

export default function PromptInput({ onGenerated, onAgentUpdate }: any) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!prompt.trim()) return;
    
    setLoading(true);
    onAgentUpdate([
      { name: '🎯 Analyzing', status: 'working' },
      { name: '💻 Generating Code', status: 'pending' },
      { name: '🧪 Creating Tests', status: 'pending' },
      { name: '✨ Finalizing', status: 'pending' }
    ]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let code = '';
      let test = '';
      let spec = '';
      let arch = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(l => l.trim().startsWith('data:'));

          for (const line of lines) {
            const data = JSON.parse(line.replace('data: ', ''));
            
            if (data.stage === 'code') {
              onAgentUpdate([
                { name: '🎯 Analyzing', status: 'done' },
                { name: '💻 Generating Code', status: data.status === 'complete' ? 'done' : 'working' },
                { name: '🧪 Creating Tests', status: 'pending' },
                { name: '✨ Finalizing', status: 'pending' }
              ]);
              
              if (data.content) code += data.content;
              if (data.fullContent) code = data.fullContent;
              
              onGenerated({ jsx: code, test, spec, arch });
            }
            
            if (data.stage === 'test') {
              onAgentUpdate([
                { name: '🎯 Analyzing', status: 'done' },
                { name: '💻 Generating Code', status: 'done' },
                { name: '🧪 Creating Tests', status: data.status === 'complete' ? 'done' : 'working' },
                { name: '✨ Finalizing', status: 'pending' }
              ]);
              
              if (data.content) test += data.content;
              if (data.fullContent) test = data.fullContent;
              
              onGenerated({ jsx: code, test, spec, arch });
            }
            
            if (data.stage === 'done') {
              spec = data.spec;
              arch = data.arch;
              onAgentUpdate([
                { name: '🎯 Analyzing', status: 'done' },
                { name: '💻 Generating Code', status: 'done' },
                { name: '🧪 Creating Tests', status: 'done' },
                { name: '✨ Finalizing', status: 'done' }
              ]);
              onGenerated({ jsx: code, test, spec, arch });
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          className="w-full p-4 rounded-xl bg-purple-950/30 text-purple-100 border border-purple-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition-all resize-none placeholder:text-purple-400"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              submit();
            }
          }}
          placeholder="Describe your application in natural language...

Example: Create a todo list app with dark mode and local storage"
        />
        <div className="absolute bottom-3 right-3 text-xs text-purple-400">
          {prompt.length} characters • ⌘+Enter to generate
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => setPrompt(ex)}
            className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 hover:border-pink-500/50 transition-all"
          >
            {ex}
          </button>
        ))}
      </div>

      <button 
        onClick={submit} 
        disabled={loading || !prompt.trim()} 
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/50 hover:shadow-pink-500/50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Application...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Application
          </span>
        )}
      </button>
    </div>
  );
}
