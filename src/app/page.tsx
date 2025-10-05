/**
 * RAJ AI APP BUILDER - Main Application Page
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 */

'use client';

import { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import CodeViewer from '@/components/CodeViewer';
import AgentProgress, { AgentStage } from '@/components/AgentProgress';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedTests, setGeneratedTests] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<AgentStage>('idle');
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState('');

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setGeneratedCode('');
    setGeneratedTests('');
    setCurrentStage('analyzing');
    setProgress(0);
    setStageMessage('Analyzing your requirements...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let codeBuffer = '';
      let testBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace('data: ', '').trim();
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.stage === 'code') {
              setCurrentStage('code');
              setProgress(30);
              setStageMessage('Generating production-ready code...');

              if (parsed.status === 'streaming' && parsed.content) {
                codeBuffer += parsed.content;
                setGeneratedCode(codeBuffer);
                setProgress(Math.min(30 + (codeBuffer.length / 50), 65));
              } else if (parsed.status === 'complete') {
                setGeneratedCode(parsed.fullContent);
                setProgress(65);
              }
            } else if (parsed.stage === 'test') {
              setCurrentStage('testing');
              setProgress(70);
              setStageMessage('Creating comprehensive test suite...');

              if (parsed.status === 'streaming' && parsed.content) {
                testBuffer += parsed.content;
                setGeneratedTests(testBuffer);
                setProgress(Math.min(70 + (testBuffer.length / 50), 95));
              } else if (parsed.status === 'complete') {
                setGeneratedTests(parsed.fullContent);
                setProgress(95);
              }
            } else if (parsed.stage === 'done') {
              setCurrentStage('complete');
              setProgress(100);
              setStageMessage('✨ Generation complete!');
              setTimeout(() => {
                setIsGenerating(false);
                setCurrentStage('idle');
              }, 2000);
            } else if (parsed.stage === 'error') {
              console.error('Generation error:', parsed.error);
              setIsGenerating(false);
              setCurrentStage('idle');
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      setCurrentStage('idle');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-orange rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                R
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">
                  RAJ <span className="gradient-text">AI</span> APP BUILDER
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">Elite AI-Powered Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Online
              </span>
              <a
                href="https://github.com/rajshah9305/NLPtoapp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input & Progress */}
          <div className="space-y-6">
            <PromptInput onGenerate={handleGenerate} isLoading={isGenerating} />
            
            {isGenerating && (
              <AgentProgress
                stage={currentStage}
                progress={progress}
                message={stageMessage}
              />
            )}
          </div>

          {/* Right Panel - Code Viewer */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="card-premium overflow-hidden" style={{ height: 'calc(100vh - 12rem)' }}>
              <CodeViewer code={generatedCode} testCode={generatedTests} />
            </div>
          </div>
        </div>


      </main>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-black">
                RAJ AI APP BUILDER
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Built and Developed by <a href="https://github.com/rajshah9305" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:text-orange-700">RAJ SHAH</a>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Powered by Cerebras GPT-OSS-120B
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <a
                href="https://github.com/rajshah9305"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 transition-colors font-medium"
              >
                @rajshah9305
              </a>
              <span className="text-gray-300">•</span>
              <a
                href="https://github.com/rajshah9305/NLPtoapp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 transition-colors"
              >
                Open Source
              </a>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


