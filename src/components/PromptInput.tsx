'use client';

import { useState, useEffect, useRef } from 'react';
import { PersonalizationEngine, PersonalizationSuggestion } from '@/lib/personalization';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export default function PromptInput({ onGenerate, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<PersonalizationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [smartCompletions, setSmartCompletions] = useState<string[]>([]);
  const [showCompletions, setShowCompletions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const message = PersonalizationEngine.getWelcomeMessage();
    setWelcomeMessage(message);
    
    const personalizedSuggestions = PersonalizationEngine.generateSuggestions();
    setSuggestions(personalizedSuggestions);
  }, []);

  useEffect(() => {
    if (prompt.length > 3) {
      const completions = PersonalizationEngine.getSmartCompletions(prompt);
      setSmartCompletions(completions);
      setShowCompletions(completions.length > 0);
    } else {
      setShowCompletions(false);
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    PersonalizationEngine.trackAction('generate', {
      prompt,
      category: detectCategory(prompt),
      timestamp: new Date().toISOString(),
    });

    const preferences = PersonalizationEngine.getPreferences();
    PersonalizationEngine.savePreferences({
      generatedCount: preferences.generatedCount + 1,
      recentPrompts: [prompt, ...preferences.recentPrompts.slice(0, 9)],
    });

    onGenerate(prompt);
    setPrompt('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: PersonalizationSuggestion) => {
    setPrompt(suggestion.description);
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const examplePrompts = [
    { icon: '📝', text: 'Todo list with drag & drop', category: 'Productivity' },
    { icon: '🎨', text: 'Portfolio with animations', category: 'Creative' },
    { icon: '📊', text: 'Analytics dashboard', category: 'Business' },
    { icon: '🎮', text: 'Memory card game', category: 'Entertainment' },
    { icon: '🛒', text: 'E-commerce product catalog', category: 'Commerce' },
    { icon: '💬', text: 'Real-time chat interface', category: 'Social' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white animate-slide-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{welcomeMessage}</h1>
          <p className="text-orange-100 text-lg">Transform your ideas into reality with AI-powered code generation</p>
        </div>
      </div>

      {/* AI-Powered Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black">Personalized for You</h2>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI-suggested
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="card-premium p-4 text-left hover-lift group"
                disabled={isLoading}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-black group-hover:text-orange-600 transition-colors">
                    {suggestion.title}
                  </h3>
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 animate-pulse-orange" />
                </div>
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs badge-orange">{suggestion.category}</span>
                  <span className="text-xs text-gray-400">{Math.round(suggestion.confidence * 100)}% match</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the app you want to build... (e.g., 'Create a modern todo app with dark mode')"
              className="input-premium min-h-[140px] resize-none pr-12 text-base scrollbar-premium focus-ring-orange"
              disabled={isLoading}
              aria-label="Application description"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:block">
                {prompt.length > 0 ? `${prompt.length} chars` : 'Cmd/Ctrl + Enter'}
              </span>
            </div>
          </div>

          {/* Smart Completions Dropdown */}
          {showCompletions && smartCompletions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-premium-lg animate-scale-in">
              <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-semibold text-gray-600">Recent similar prompts</span>
              </div>
              {smartCompletions.map((completion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(completion)}
                  className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors text-sm border-b border-gray-100 last:border-0"
                >
                  {completion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Be specific for better results</span>
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="btn-primary px-8 py-3 flex items-center gap-2 group"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <span>Generate App</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Example Prompts */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-sm font-semibold text-gray-600">Quick Start Examples:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {examplePrompts.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(example.text)}
              disabled={isLoading}
              className="btn-ghost text-left px-3 py-2 text-sm flex items-center gap-2 group"
              title={example.category}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{example.icon}</span>
              <span className="truncate text-xs">{example.text.split(' ').slice(0, 2).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="card-glass p-4 flex items-start gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-black mb-1">Pro Tip</h4>
          <p className="text-sm text-gray-600">
            Include details like <strong className="text-orange-600">styling preferences</strong>, <strong className="text-orange-600">interactivity features</strong>, and <strong className="text-orange-600">data management</strong> for more precise results.
          </p>
        </div>
      </div>
    </div>
  );
}

function detectCategory(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('todo') || lower.includes('task') || lower.includes('note')) return 'Productivity';
  if (lower.includes('game') || lower.includes('quiz') || lower.includes('fun')) return 'Entertainment';
  if (lower.includes('shop') || lower.includes('cart') || lower.includes('product')) return 'Commerce';
  if (lower.includes('chart') || lower.includes('dashboard') || lower.includes('analytics')) return 'Business';
  if (lower.includes('chat') || lower.includes('social') || lower.includes('message')) return 'Social';
  if (lower.includes('portfolio') || lower.includes('gallery') || lower.includes('design')) return 'Creative';
  return 'General';
}
