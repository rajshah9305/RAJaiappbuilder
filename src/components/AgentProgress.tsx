'use client';

export default function AgentProgress({ agents }: { agents: any[] }) {
  if (agents.length === 0) return null;

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl blur-md sm:blur-lg group-hover:blur-xl transition-all"></div>
      <div className="relative bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-200">Agent Progress</h3>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          {agents.map((agent, i) => (
            <div 
              key={i} 
              className="relative group/item"
            >
              {agent.status === 'working' && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-lg sm:rounded-xl blur-sm"></div>
              )}
              <div className={`relative flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all ${
                agent.status === 'working' 
                  ? 'bg-slate-900/50 border-cyan-500/30' 
                  : agent.status === 'done'
                  ? 'bg-slate-900/30 border-emerald-500/20'
                  : 'bg-slate-900/20 border-slate-700/20'
              }`}>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  {agent.status === 'working' ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full blur-sm"></div>
                      <div className="relative w-4 h-4 sm:w-5 sm:h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : agent.status === 'done' ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-full blur-sm opacity-50"></div>
                      <svg className="relative w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-600"></div>
                  )}
                </div>
                <span className={`text-xs sm:text-sm flex-1 transition-colors ${
                  agent.status === 'working' 
                    ? 'text-cyan-300 font-medium' 
                    : agent.status === 'done'
                    ? 'text-slate-300'
                    : 'text-slate-500'
                }`}>
                  {agent.name}
                </span>
                {agent.status === 'working' && (
                  <span className="text-[10px] sm:text-xs text-cyan-400 font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                    Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
