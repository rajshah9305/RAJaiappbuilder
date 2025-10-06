/**
 * RAJ AI APP BUILDER - Code Viewer Component
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeViewerProps {
  code: string;
  testCode: string;
}

export default function CodeViewer({ code, testCode }: CodeViewerProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'tests'>('code');
  const [liveCode, setLiveCode] = useState('');
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (code && code !== liveCode) {
      setLiveCode(code);
    }
  }, [code, liveCode]);

  const cleanCode = (str: string) => {
    if (!str) return '';
    return str.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '').trim();
  };

  useEffect(() => {
    if (!liveCode) return;

    setIsPreviewLoading(true);
    const timer = setTimeout(() => {
      setIframeKey((prev) => prev + 1);
      setTimeout(() => setIsPreviewLoading(false), 500);
    }, 300);

    return () => clearTimeout(timer);
  }, [liveCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode(code));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([cleanCode(code)], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-component.jsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      code: cleanCode(code),
      testCode: cleanCode(testCode),
      timestamp: new Date().toISOString(),
    };
    
    const encoded = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}?shared=${encoded}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setShareLink(url);
      setTimeout(() => setShareLink(''), 3000);
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const generatePreviewHTML = (componentCode: string) => {
    const cleaned = cleanCode(componentCode);
    
    // Extract component name if present, default to App
    const componentNameMatch = cleaned.match(/function\s+(\w+)\s*\(/);
    const componentName = componentNameMatch ? componentNameMatch[1] : 'App';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      background: white;
      min-height: 100vh;
    }
    #root { 
      min-height: calc(100vh - 40px);
      width: 100%;
    }
    .error-container {
      padding: 20px;
      background: #fee;
      border: 2px solid #fcc;
      border-radius: 8px;
      color: #c00;
      font-family: monospace;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    (function() {
      try {
        const { useState, useEffect, useRef, useCallback, useMemo, Fragment } = React;
        
        ${cleaned}
        
        const rootElement = document.getElementById('root');
        const root = ReactDOM.createRoot(rootElement);
        
        const ComponentToRender = typeof ${componentName} !== 'undefined' ? ${componentName} : (typeof App !== 'undefined' ? App : null);
        
        if (ComponentToRender) {
          root.render(<ComponentToRender />);
        } else {
          rootElement.innerHTML = '<div class="error-container">Error: No component found. Make sure your component is named "App" or another valid name.</div>';
        }
      } catch (error) {
        const rootElement = document.getElementById('root');
        rootElement.innerHTML = '<div class="error-container"><strong>Preview Error:</strong><br/><br/>' + error.toString() + '<br/><br/><strong>Stack:</strong><br/>' + (error.stack || 'No stack trace') + '</div>';
        console.error('Preview rendering error:', error);
      }
    })();
  </script>
</body>
</html>`;
  };

  const tabs = [
    { id: 'code' as const, label: 'Code', icon: '💻' },
    { id: 'preview' as const, label: 'Preview', icon: '👁️' },
    { id: 'tests' as const, label: 'Tests', icon: '🧪' },
  ];

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Compact Header with Tabs and Actions */}
      <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {code && (
            <>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
                title="Copy code"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Download code"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative"
                title="Share"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {shareLink && (
                  <span className="absolute -top-10 right-0 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap shadow-lg">
                    ✓ Copied!
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title={isFullscreen ? 'Minimize' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white overflow-hidden">
        {activeTab === 'code' && (
          <div className="h-full relative">
            {code ? (
              <>
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={cleanCode(code)}
                  theme="vs-light"
                  loading={<LoadingState icon="💻" message="Loading code editor..." />}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                    fontLigatures: true,
                    padding: { top: 12, bottom: 12 },
                    renderLineHighlight: 'all',
                    smoothScrolling: true,
                    automaticLayout: true,
                  }}
                />
              </>
            ) : (
              <EmptyState
                icon="💻"
                title="No code generated yet"
                description="Enter a prompt and generate your app to see the code here"
              />
            )}
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-full bg-white relative">
            {liveCode ? (
              <>
                {isPreviewLoading && (
                  <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
                    <LoadingState icon="👁️" message="Rendering preview..." />
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  srcDoc={generatePreviewHTML(liveCode)}
                  className="w-full h-full border-0"
                  title="Component Preview"
                  sandbox="allow-scripts allow-same-origin"
                  onLoad={() => setIsPreviewLoading(false)}
                />
              </>
            ) : (
              <EmptyState
                icon="👁️"
                title="Preview will appear here"
                description="Generate code to see a live preview of your component"
              />
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="h-full">
            {testCode ? (
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={cleanCode(testCode)}
                theme="vs-light"
                loading={<LoadingState icon="🧪" message="Loading test suite..." />}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                  fontLigatures: true,
                  padding: { top: 12, bottom: 12 },
                  automaticLayout: true,
                }}
              />
            ) : (
              <EmptyState
                icon="🧪"
                title="Test suite will appear here"
                description="AI-generated tests will be shown once code generation completes"
              />
            )}
          </div>
        )}
      </div>

      {/* Compact Status Bar */}
      {code && (
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Ready
            </span>
            <span>{cleanCode(code).split('\n').length} lines</span>
            <span>{(cleanCode(code).length / 1024).toFixed(1)} KB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">React</span>
            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">Tailwind</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-3 opacity-50">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

interface LoadingStateProps {
  icon: string;
  message: string;
}

function LoadingState({ icon, message }: LoadingStateProps) {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-3 animate-pulse opacity-70">{icon}</div>
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
