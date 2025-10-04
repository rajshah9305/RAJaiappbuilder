'use client';
import { useState, useEffect } from 'react';

export default function CodeViewer({ code, test, sandboxUrl }: { code: string; test: string; sandboxUrl?: string }) {
  const [tab, setTab] = useState<'preview' | 'code' | 'test'>('preview');
  const [previewHtml, setPreviewHtml] = useState('');
  
  useEffect(() => {
    setTab('preview');
  }, [code]);
  
  const cleanCode = (str: string) => str.replace(/```[a-z]*\n?/g, '').trim();

  useEffect(() => {
    if (!code) return;
    const cleaned = cleanCode(code);
    const componentName = cleaned.match(/(?:function|const)\s+(\w+)/)?.[1] || 'App';
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { margin: 0; padding: 0; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${cleaned}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${componentName}));
  </script>
</body>
</html>`;
    setPreviewHtml(html);
  }, [code]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <div className="flex gap-1 bg-slate-800/30 p-1 rounded-lg">
          <button 
            onClick={() => setTab('preview')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              tab === 'preview' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </span>
          </button>
          <button 
            onClick={() => setTab('code')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              tab === 'code' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Code
            </span>
          </button>
          <button 
            onClick={() => setTab('test')}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              tab === 'test' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tests
            </span>
          </button>
        </div>
        {sandboxUrl && tab === 'preview' && (
          <a 
            href={sandboxUrl} 
            target="_blank" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/50 text-xs text-slate-400 hover:text-slate-300 hover:border-blue-500/50 transition-all"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in New Tab
          </a>
        )}
      </div>
      <div className="flex-1 overflow-hidden relative">
        {tab === 'preview' ? (
          sandboxUrl ? (
            <iframe 
              key={sandboxUrl}
              src={sandboxUrl}
              className="absolute inset-0 w-full h-full bg-white border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <iframe 
              key={previewHtml}
              srcDoc={previewHtml}
              className="absolute inset-0 w-full h-full bg-white border-0"
              sandbox="allow-scripts allow-same-origin"
              title="preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )
        ) : (
          <pre className="absolute inset-0 w-full h-full overflow-auto bg-slate-950 p-6 text-sm font-mono text-slate-300">
            <code>{tab === 'code' ? cleanCode(code) : cleanCode(test)}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
