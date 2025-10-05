'use client';
import { useState } from 'react';

const examples = [
  { text: 'Todo list with drag and drop', icon: '📝' },
  { text: 'Weather dashboard', icon: '🌤️' },
  { text: 'Calculator app', icon: '🔢' },
  { text: 'Pomodoro timer', icon: '⏱️' }
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
    <div className="space-y-3 sm:space-y-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-lg sm:rounded-xl blur-md sm:blur-lg group-focus-within:blur-xl transition-all"></div>
        <textarea
          className="relative w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-900/50 text-slate-100 text-sm sm:text-base border border-cyan-500/30 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all resize-none placeholder:text-slate-500"
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
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-[10px] sm:text-xs text-slate-500 flex items-center gap-1 sm:gap-2">
          <span className="hidden sm:inline">{prompt.length} chars</span>
          <span className="text-cyan-400 hidden sm:inline">⌘+Enter</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {examples.map(({ text, icon }) => (
          <button
            key={text}
            onClick={() => setPrompt(text)}
            className="group relative px-2 sm:px-3 py-2 text-[11px] sm:text-xs rounded-md sm:rounded-lg bg-slate-900/30 border border-cyan-500/20 text-slate-400 hover:text-slate-200 hover:border-cyan-500/50 transition-all text-left"
          >
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base">{icon}</span>
              <span className="group-hover:text-cyan-400 transition-colors truncate">{text}</span>
            </span>
          </button>
        ))}
      </div>

      <button 
        onClick={submit} 
        disabled={loading || !prompt.trim()} 
        className="relative w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 group-hover:from-cyan-400 group-hover:to-emerald-400 transition-all"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 blur-lg opacity-50 group-hover:opacity-75 transition-all"></div>
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
  );}
}
