'use client';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeViewer({ code, test }: { code: string; test: string }) {
  const [tab, setTab] = useState<'preview' | 'code' | 'test'>('preview');
  const [previewHtml, setPreviewHtml] = useState('');
  
  useEffect(() => {
    setTab('preview');
  }, [code]);
  
  const cleanCode = (str: string) => {
    if (!str) return '';
    return str.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '').trim();
  };

  useEffect(() => {
    if (!code) return;
    
    const cleaned = cleanCode(code);
    const componentName = cleaned.match(/(?:export\s+default\s+)?(?:function|const)\s+(\w+)/)?.[1] || 'App';
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { margin: 0; padding: 0; min-height: 100vh; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    ${cleaned.replace(/export\s+default\s+/g, '')}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${componentName}));
  </script>
</body>
</html>`;
    setPreviewHtml(html);
  }, [code]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 sm:p-4 border-b border-cyan-500/20 bg-slate-900/30 overflow-x-auto">
        <div className="flex gap-1 sm:gap-2 w-full min-w-max">
          {[
            { id: 'preview', label: 'Preview', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
            { id: 'code', label: 'Code', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
            { id: 'test', label: 'Tests', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map(({ id, label, icon }) => (
            <button 
              key={id}
              onClick={() => setTab(id as any)}
              className={`relative flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                tab === id 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === id && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-md sm:rounded-lg blur-sm"></div>
              )}
              <span className={`relative flex items-center justify-center gap-1.5 sm:gap-2 ${tab === id ? 'drop-shadow-lg' : ''}`}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                <span>{label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {tab === 'preview' ? (
          previewHtml ? (
            <iframe 
              key={previewHtml}
              srcDoc={previewHtml}
              className="absolute inset-0 w-full h-full bg-white border-0"
              sandbox="allow-scripts allow-same-origin"
              title="preview"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
              <div className="text-cyan-400 flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading preview...
              </div>
            </div>
          )
        ) : (
          <Editor
            height="100%"
            language="javascript"
            value={tab === 'code' ? cleanCode(code) : cleanCode(test)}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 16, bottom: typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 16 },
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              fontLigatures: true,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              renderLineHighlight: 'none',
              wordWrap: 'on'
            }}
          />
        )}
      </div>
    </div>
  );
}
