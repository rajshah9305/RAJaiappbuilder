'use client';
import { useState } from 'react';
import PromptInput from '@/components/PromptInput';
import CodeViewer from '@/components/CodeViewer';
import AgentProgress from '@/components/AgentProgress';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);

  return (
    <main className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-500/10 backdrop-blur-xl bg-slate-950/50">
          <div className="max-w-[1800px] mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg sm:rounded-xl blur-md sm:blur-lg opacity-75"></div>
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  RAJ AI APP BUILDER
                </h1>
                <p className="text-[10px] sm:text-xs text-cyan-400/70 hidden sm:block">Powered by Cerebras GPT-OSS-120B</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-xs text-emerald-400">
                <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 mr-1 sm:mr-2 animate-pulse"></span>
                Live
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 p-3 sm:p-6 min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)]">
          {/* Left Panel */}
          <div className="space-y-3 sm:space-y-6 overflow-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-slate-100">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </span>
                  Describe Your Application
                </h2>
                <PromptInput onGenerated={setData} onAgentUpdate={setAgents} />
              </div>
            </div>

            <AgentProgress agents={agents} />

            {data && (
              <div className="space-y-2 sm:space-y-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg sm:rounded-xl blur-md sm:blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-emerald-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-200 mb-1">Technical Specification</h3>
                        <p className="text-xs sm:text-sm text-slate-400 break-words">{data.spec}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg sm:rounded-xl blur-md sm:blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-200 mb-1">Architecture</h3>
                        <p className="text-xs sm:text-sm text-slate-400 break-words">{data.arch}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="relative group min-h-[400px] lg:min-h-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl sm:rounded-2xl overflow-hidden h-full">
              {data ? (
                <CodeViewer code={data.jsx} test={data.test} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-12">
                  <div className="relative mb-4 sm:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl sm:rounded-2xl blur-xl sm:blur-2xl opacity-50"></div>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-2">Ready to Build</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm px-4">Describe your application and watch AI create it in real-time with streaming</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-cyan-500/10 backdrop-blur-xl bg-slate-950/50 py-3 sm:py-4">
          <div className="max-w-[1800px] mx-auto px-3 sm:px-6 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Developed and Built with ❤️ by{' '}
              <a 
                href="https://github.com/rajshah9305" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-emerald-300 transition-all font-semibold"
              >
                Raj Shah
              </a>
              <span className="hidden sm:inline">{' '}• Powered by Cerebras GPT-OSS-120B</span>
            </p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
