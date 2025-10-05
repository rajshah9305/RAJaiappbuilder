'use client';

export default function AgentProgress({ agents }: { agents: any[] }) {
  if (agents.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-purple-200">Agent Progress</h3>
      </div>
      
      <div className="space-y-3">
        {agents.map((agent, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
              {agent.status === 'working' ? (
                <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
              ) : agent.status === 'done' ? (
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              )}
            </div>
            <span className="text-sm text-purple-200 flex-1">{agent.name}</span>
            {agent.status === 'working' && (
              <span className="text-xs text-pink-400 font-medium">Active</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
