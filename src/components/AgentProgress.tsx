/**
 * RAJ AI APP BUILDER - Agent Progress Component
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 */

'use client';

import { useEffect, useState } from 'react';

export type AgentStage = 'idle' | 'analyzing' | 'code' | 'testing' | 'complete';

interface AgentProgressProps {
  stage: AgentStage;
  progress: number;
  message?: string;
}

export default function AgentProgress({ stage, progress, message }: AgentProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    if (stage === 'analyzing') setEstimatedTime('~5s');
    else if (stage === 'code') setEstimatedTime('~15s');
    else if (stage === 'testing') setEstimatedTime('~10s');
    else setEstimatedTime('');
  }, [stage]);

  if (stage === 'idle') return null;

  const stages = [
    {
      id: 'analyzing',
      label: 'Analyzing',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: 'Understanding your requirements',
    },
    {
      id: 'code',
      label: 'Generating',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      description: 'Writing production-ready code',
    },
    {
      id: 'testing',
      label: 'Testing',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Creating test suite',
    },
    {
      id: 'complete',
      label: 'Complete',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      description: 'Ready to use',
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === stage);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Progress Header */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center text-white animate-pulse-orange">
              {stages[currentStageIndex]?.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-black">
                {stages[currentStageIndex]?.label}
              </h3>
              <p className="text-sm text-gray-600">
                {message || stages[currentStageIndex]?.description}
              </p>
            </div>
          </div>
          {estimatedTime && (
            <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              {estimatedTime}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${displayProgress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs font-semibold text-gray-600">
              {displayProgress}% complete
            </span>
            <span className="text-xs text-gray-500">
              Powered by Cerebras AI
            </span>
          </div>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="card-glass p-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-4">Generation Pipeline</h4>
        <div className="space-y-3">
          {stages.map((stageItem, idx) => {
            const isActive = stageItem.id === stage;
            const isCompleted = idx < currentStageIndex;
            const isPending = idx > currentStageIndex;

            return (
              <div
                key={stageItem.id}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-orange-50 border-2 border-orange-500 scale-105'
                    : isCompleted
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-orange text-white animate-pulse-orange'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {stageItem.label}
                    </span>
                    {isActive && (
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-xs ${
                      isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {stageItem.description}
                  </p>
                </div>

                {isActive && (
                  <div className="flex-shrink-0">
                    <svg className="animate-spin h-5 w-5 text-orange-500" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                )}

                {isCompleted && (
                  <span className="text-xs text-green-600 font-semibold">✓ Done</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-premium p-4 text-center">
          <div className="text-2xl font-bold gradient-text">
            {stage === 'complete' ? '100' : Math.round(displayProgress)}%
          </div>
          <div className="text-xs text-gray-600 mt-1">Progress</div>
        </div>
        <div className="card-premium p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">
            {currentStageIndex + 1}/{stages.length}
          </div>
          <div className="text-xs text-gray-600 mt-1">Stages</div>
        </div>
        <div className="card-premium p-4 text-center">
          <div className="text-2xl font-bold text-black flex items-center justify-center gap-1">
            <svg className="w-5 h-5 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            AI
          </div>
          <div className="text-xs text-gray-600 mt-1">Powered</div>
        </div>
      </div>
    </div>
  );
}
