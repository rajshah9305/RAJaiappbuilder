'use client';
import { useState } from 'react';

const examples = [
  { text: 'Todo list with drag and drop', icon: '📝' },
  { text: 'Weather dashboard', icon: '🌤️' },
  { text: 'Calculator app', icon: '🔢' },
  { text: 'Pomodoro timer', icon: '⏱️' }
];

interface Agent {
  name: string;
  status: 'pending' | 'working' | 'done';
}

interface PromptInputProps {
  onGenerated: (data: { jsx: string; test: string; spec: string; arch: string }) => void;
  onAgentUpdate: (agents: Agent[]) => void;
}

export default function PromptInput({ onGenerated, onAgentUpdate }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      const decoder = new TextDecoder();
      let code = '';
      let test = '';
      let spec = '';
      let arch = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.trim().startsWith('data:'));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.replace('data: ', ''));
            
            if (data.stage === 'error') {
              throw new Error(data.error || 'Generation failed');
            }
            
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
          } catch (parseError) {
            console.error('Parse error:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate application');
      onAgentUpdate([
        { name: '🎯 Analyzing', status: 'done' },
        { name: '💻 Generating Code', status: 'done' },
        { name: '🧪 Creating Tests', status: 'done' },
        { name: '✨ Finalizing', status: 'done' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {error && (
        <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Generation Error</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative group">
        <textarea
          className="relative w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white text-gray-900 text-sm sm:text-base border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all resize-none placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !loading) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={loading}
          placeholder="Describe your application in natural language...

Example: Create a todo list app with dark mode and local storage"
          aria-label="Application description"
        />
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 sm:gap-2">
          <span className="hidden sm:inline">{prompt.length} chars</span>
          <span className="text-orange-600 hidden sm:inline">⌘+Enter</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {examples.map(({ text, icon }) => (
          <button
            key={text}
            type="button"
            onClick={() => setPrompt(text)}
            disabled={loading}
            className="group relative px-2 sm:px-3 py-2 text-[11px] sm:text-xs rounded-md sm:rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-orange-300 hover:bg-orange-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            aria-label={`Use example: ${text}`}
          >
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base" aria-hidden="true">{icon}</span>
              <span className="group-hover:text-orange-600 transition-colors truncate">{text}</span>
            </span>
          </button>
        ))}
      </div>

      <button 
        type="button"
        onClick={submit} 
        disabled={loading || !prompt.trim()} 
        className="relative w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all group overflow-hidden bg-orange-500 hover:bg-orange-600 active:bg-orange-700 shadow-sm hover:shadow-md touch-manipulation"
        aria-label="Generate application"
      >
        <span className="relative text-white flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="hidden sm:inline">Generating Application...</span>
              <span className="sm:hidden">Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden sm:inline">Generate Application</span>
              <span className="sm:hidden">Generate</span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
