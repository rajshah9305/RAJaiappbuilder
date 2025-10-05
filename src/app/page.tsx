/**
 * RAJ AI APP BUILDER - Main Application Page
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 */

'use client';

import { useState, useEffect } from 'react';
import PromptInput from '@/components/PromptInput';
import CodeViewer from '@/components/CodeViewer';
import AgentProgress, { AgentStage } from '@/components/AgentProgress';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import Toast from '@/components/Toast';
import { PersonalizationEngine } from '@/lib/personalization';

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedTests, setGeneratedTests] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<AgentStage>('idle');
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setGeneratedCode('');
    setGeneratedTests('');
    setCurrentStage('analyzing');
    setProgress(0);
    setStageMessage('Analyzing your requirements...');

    // Track generation in personalization engine
    PersonalizationEngine.trackAction(prompt);

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
              
              // Show success toast
              setToastMessage('🎉 App generated successfully!');
              setToastType('success');
              setShowToast(true);
              
              setTimeout(() => {
                setIsGenerating(false);
                setCurrentStage('idle');
              }, 2000);
            } else if (parsed.stage === 'error') {
              console.error('Generation error:', parsed.error);
              setToastMessage('❌ Generation failed. Please try again.');
              setToastType('error');
              setShowToast(true);
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
      setToastMessage('❌ Network error. Please check your connection.');
      setToastType('error');
      setShowToast(true);
      setIsGenerating(false);
      setCurrentStage('idle');
    }
  };

  return (
    <div className="min-h-screen morphing-bg relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 floating-particle" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 floating-particle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 floating-particle" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect border-b border-gray-200/50 shadow-lg">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl glow-orange animate-gradient">
                <span className="relative z-10">R</span>
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-black flex items-center gap-2">
                  RAJ <span className="text-gradient-premium">AI</span> APP BUILDER
                  <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-bold rounded-full">ELITE</span>
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block font-semibold">⚡ Elite AI-Powered Development Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-xs font-bold border border-green-200 glow-orange">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg" />
                Live & Active
              </span>
              <a
                href="https://github.com/rajshah9305/NLPtoapp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 hover:bg-white/50 rounded-xl transition-all duration-300 hover:scale-110 group ripple-effect"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 sm:gap-10 lg:gap-16">
          {/* Left Panel - Input & Progress */}
          <div className="space-y-6 sm:space-y-8 animate-slide-up">
            <PromptInput onGenerate={handleGenerate} isLoading={isGenerating} />
            
            {isGenerating && (
              <div className="animate-scale-in">
                <AgentProgress
                  stage={currentStage}
                  progress={progress}
                  message={stageMessage}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Code Viewer */}
          <div className="lg:sticky lg:top-28 h-fit animate-slide-in-right">
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
              
              {/* Main card */}
              <div className="relative card-elite overflow-hidden shadow-2xl border-gradient glow-orange-intense" style={{ minHeight: '600px', height: 'calc(100vh - 14rem)' }}>
                <CodeViewer code={generatedCode} testCode={generatedTests} />
              </div>

              {/* Corner accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </main>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Footer */}
      <footer className="relative mt-16 sm:mt-20 lg:mt-24 border-t border-gray-200/50 glass-effect pb-20 sm:pb-10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-base font-black text-black flex items-center justify-center sm:justify-start gap-2">
                <span className="text-gradient-premium">RAJ AI APP BUILDER</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[8px] font-bold rounded-full">v1.0</span>
              </p>
              <p className="text-sm text-gray-700 mt-2 font-medium">
                Built and Developed by <a href="https://github.com/rajshah9305" target="_blank" rel="noopener noreferrer" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">RAJ SHAH</a>
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <span className="inline-block w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse" />
                Powered by Cerebras GPT-OSS-120B
              </p>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <a
                href="https://github.com/rajshah9305"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/50 hover:bg-white rounded-xl font-bold text-gray-700 hover:text-orange-600 transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-orange-300"
              >
                @rajshah9305
              </a>
              <a
                href="https://github.com/rajshah9305/NLPtoapp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-[0_10px_40px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-105"
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-gray-200/50 text-center">
            <p className="text-xs text-gray-500">
              © 2024 RAJ AI APP BUILDER. Open Source under MIT License. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


