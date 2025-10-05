'use client';
import { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import CodeViewer from '@/components/CodeViewer';
import AgentProgress from '@/components/AgentProgress';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-500/20 backdrop-blur-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI App Factory</h1>
              <p className="text-xs text-purple-400">Powered by Cerebras GPT-OSS-120B</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-[calc(100vh-80px)]">
        {/* Left Panel */}
        <div className="space-y-6 overflow-auto">
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-200">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </span>
              Describe Your Application
            </h2>
            <PromptInput onGenerated={setData} onAgentUpdate={setAgents} />
          </div>

          <AgentProgress agents={agents} />

          {data && (
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/50">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-200 mb-1">Technical Specification</h3>
                    <p className="text-sm text-purple-300">{data.spec}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/50">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-200 mb-1">Architecture</h3>
                    <p className="text-sm text-purple-300">{data.arch}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden shadow-xl">
          {data ? (
            <CodeViewer code={data.jsx} test={data.test} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-xl shadow-purple-500/50">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">Ready to Build</h3>
              <p className="text-sm text-purple-400 max-w-sm">Describe your application and watch our AI agents create it in real-time</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 backdrop-blur-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 py-4">
        <div className="max-w-[1800px] mx-auto px-6 text-center">
          <p className="text-sm text-purple-400">
            Developed and Built with ❤️ by{' '}
            <a 
              href="https://github.com/rajshah9305" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors font-semibold"
            >
              Raj Shah
            </a>
            {' '}• Powered by Cerebras GPT-OSS-120B
          </p>
        </div>
      </footer>
    </main>
  );
}
