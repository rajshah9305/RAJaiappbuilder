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
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="flex gap-2">
          <button 
            onClick={() => setTab('preview')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              tab === 'preview' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
            }`}
          >
            Preview
          </button>
          <button 
            onClick={() => setTab('code')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              tab === 'code' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
            }`}
          >
            Code
          </button>
          <button 
            onClick={() => setTab('test')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              tab === 'test' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
            }`}
          >
            Tests
          </button>
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
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 to-purple-950">
              <div className="text-purple-400">Loading preview...</div>
            </div>
          )
        ) : (
          <Editor
            height="100%"
            language={tab === 'code' ? 'javascript' : 'javascript'}
            value={tab === 'code' ? cleanCode(code) : cleanCode(test)}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 }
            }}
          />
        )}
      </div>
    </div>
  );
}
