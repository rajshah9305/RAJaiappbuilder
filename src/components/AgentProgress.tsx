'use client';
import { useState, useEffect } from 'react';

export default function AgentProgress({ agents }: { agents: any[] }) {
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    if (agents.length === 0) {
      setMessages([]);
      return;
    }
    
    const newMessages: any[] = [];
    
    agents.forEach((agent, i) => {
      if (agent.status === 'working') {
        newMessages.push({
          id: `${i}-start`,
          agent: agent.name,
          text: `Starting: ${agent.task}`,
          type: 'status',
          timestamp: Date.now()
        });
      }
      
      if (agent.status === 'done' && i < agents.length - 1) {
        const nextAgent = agents[i + 1];
        newMessages.push({
          id: `${i}-handoff`,
          from: agent.name,
          to: nextAgent.name,
          text: getHandoffMessage(agent.name, nextAgent.name),
          type: 'handoff',
          timestamp: Date.now()
        });
      }
    });
    
    setMessages(newMessages);
  }, [agents]);
  
  const getHandoffMessage = (from: string, to: string) => {
    const messages: Record<string, string> = {
      '🎯 Product Manager-🏗️ Architect': 'Spec complete. Please design the system architecture.',
      '🏗️ Architect-💻 Coder': 'Architecture approved. Build with React + Tailwind CSS.',
      '💻 Coder-🧪 QA Engineer': 'Component ready. Run tests and verify functionality.',
      '🧪 QA Engineer-🚀 Sandbox': 'All tests passed. Deploy to E2B sandbox.',
    };
    return messages[`${from}-${to}`] || 'Task complete. Passing to next agent.';
  };

  if (agents.length === 0) return null;

  return (
    <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-300">Agent Collaboration</h3>
      </div>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {msg.type === 'handoff' ? (
              <div className="flex items-start gap-2 ml-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div className="flex-1 bg-slate-800/30 border border-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-medium text-slate-300">{msg.from}</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium text-slate-300">{msg.to}</span>
                  </div>
                  <p className="text-sm text-slate-300">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-200">{msg.agent}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{msg.text}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-800/50">
          {agents.map((agent, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/20">
              <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0">
                {agent.status === 'working' ? (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                ) : agent.status === 'done' ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                )}
              </div>
              <span className="text-xs text-slate-400 flex-1">{agent.name}</span>
              {agent.status === 'working' && (
                <span className="text-xs text-blue-400 font-medium">Active</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
