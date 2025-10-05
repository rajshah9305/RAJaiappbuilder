'use client';
import { useState } from 'react';

const examples = [
  'Todo list with dark mode',
  'Weather dashboard',
  'Calculator app',
  'Timer with animations'
];

export default function PromptInput({ onGenerated, onAgentUpdate }: { onGenerated: (d: any) => void; onAgentUpdate: (a: any[]) => void }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    onAgentUpdate([]);
    
    const agents = [
      { name: '🎯 Product Manager', task: 'Creating technical spec', status: 'working' },
      { name: '🏗️ Architect', task: 'Designing system architecture', status: 'pending' },
      { name: '💻 Coder', task: 'Writing React component', status: 'pending' },
      { name: '🧪 QA Engineer', task: 'Generating tests', status: 'pending' },
      { name: '✅ Complete', task: 'Ready for preview', status: 'pending' }
    ];
    
    try {
      onAgentUpdate([...agents]);
      await new Promise(r => setTimeout(r, 800));
      
      agents[0].status = 'done';
      agents[1].status = 'working';
      onAgentUpdate([...agents]);
      await new Promise(r => setTimeout(r, 800));
      
      agents[1].status = 'done';
      agents[2].status = 'working';
      onAgentUpdate([...agents]);
      
      const res = await fetch('/api/generate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }) 
      });
      const json = await res.json();
      
      agents[2].status = 'done';
      agents[3].status = 'working';
      onAgentUpdate([...agents]);
      await new Promise(r => setTimeout(r, 500));
      
      agents[3].status = 'done';
      agents[4].status = 'done';
      onAgentUpdate([...agents]);
      
      onGenerated(json);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          className="w-full p-4 rounded-xl bg-slate-800/30 text-slate-100 border border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none placeholder:text-slate-500"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your application in natural language...

Example: Create a todo list app with dark mode and local storage"
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-500">
          {prompt.length} characters
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => setPrompt(ex)}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800/30 border border-slate-700/50 text-slate-400 hover:text-slate-300 hover:border-blue-500/50 transition-all"
          >
            {ex}
          </button>
        ))}
      </div>

      <button 
        onClick={submit} 
        disabled={loading || !prompt.trim()} 
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
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
