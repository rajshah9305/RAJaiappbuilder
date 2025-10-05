'use client';
import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';

interface CodeViewerProps {
  code: string;
  test: string;
}

export default function CodeViewer({ code, test }: CodeViewerProps) {
  const [tab, setTab] = useState<'preview' | 'code' | 'test'>('preview');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  
  useEffect(() => {
    setTab('preview');
  }, [code]);
  
  const cleanCode = (str: string) => {
    if (!str) return '';
    return str.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '').trim();
  };

  useEffect(() => {
    if (!code) return;
    
    try {
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
    try {
      const { useState, useEffect, useRef } = React;
      ${cleaned.replace(/export\s+default\s+/g, '')}
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(${componentName}));
    } catch (error) {
      document.getElementById('root').innerHTML = '<div style="padding: 20px; color: red;">Error rendering component: ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
      setPreviewHtml(html);
      setPreviewError(null);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Failed to generate preview');
    }
  }, [code]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-2 sm:p-4 border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <div className="flex gap-1 sm:gap-2 w-full">
          {[
            { id: 'preview', label: 'Preview', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
            { id: 'code', label: 'Code', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
            { id: 'test', label: 'Tests', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map(({ id, label, icon }) => (
            <button 
              key={id}
              onClick={() => setTab(id as any)}
              type="button"
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap touch-manipulation ${
                tab === id 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
              }`}
              aria-label={`View ${label}`}
              aria-pressed={tab === id}
            >
              <span className="flex items-center justify-center gap-1.5 sm:gap-2">
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
          previewError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-6">
              <div className="text-center max-w-md">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview Error</h3>
                <p className="text-sm text-gray-600">{previewError}</p>
              </div>
            </div>
          ) : previewHtml ? (
            <iframe 
              key={previewHtml}
              srcDoc={previewHtml}
              className="absolute inset-0 w-full h-full bg-white border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Component preview"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-orange-600 flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" role="status" aria-label="Loading">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading preview...</span>
              </div>
            </div>
          )
        ) : (
          <Editor
            height="100%"
            language="javascript"
            value={tab === 'code' ? cleanCode(code) : cleanCode(test)}
            theme="vs-dark"
            loading={<div className="flex items-center justify-center h-full"><span className="text-gray-500">Loading editor...</span></div>}
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
              wordWrap: 'on',
              contextmenu: false
            }}
          />
        )}
      </div>
    </div>
  );
}
