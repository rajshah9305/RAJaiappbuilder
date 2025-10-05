/**
 * RAJ AI APP BUILDER - Prompt Input Component
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 */

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

  const templates = [
    { 
      icon: '📝', 
      title: 'Todo List', 
      description: 'Task manager with drag & drop, categories, and local storage',
      prompt: 'Create a todo list app with drag and drop functionality, task categories (work, personal, urgent), completion checkboxes, delete buttons, and local storage persistence. Use a modern card-based design with Tailwind CSS.',
      category: 'Productivity' 
    },
    { 
      icon: '🎨', 
      title: 'Portfolio', 
      description: 'Personal portfolio with projects gallery and animations',
      prompt: 'Build a portfolio website with a hero section, about me section, projects gallery with hover effects, skills section with progress bars, and a contact form. Include smooth scroll animations and a modern gradient design.',
      category: 'Creative' 
    },
    { 
      icon: '📊', 
      title: 'Dashboard', 
      description: 'Analytics dashboard with charts and KPI cards',
      prompt: 'Create an analytics dashboard with KPI cards showing metrics, a line chart for trends, bar chart for comparisons, and a data table. Use a clean, professional design with stat cards and responsive layout.',
      category: 'Business' 
    },
    { 
      icon: '🎮', 
      title: 'Memory Game', 
      description: 'Interactive memory card matching game',
      prompt: 'Build a memory card matching game with a 4x4 grid of cards, flip animations, score tracking, timer, and restart button. Cards should flip on click and match when two identical cards are selected. Use colorful, playful design.',
      category: 'Entertainment' 
    },
    { 
      icon: '🛒', 
      title: 'Product Catalog', 
      description: 'E-commerce product listing with filters',
      prompt: 'Create an e-commerce product catalog with product cards (image, name, price, rating), category filters, search bar, sort options (price, rating), and add to cart buttons. Use a grid layout with responsive columns.',
      category: 'Commerce' 
    },
    { 
      icon: '💬', 
      title: 'Chat Interface', 
      description: 'Real-time messaging UI with conversations',
      prompt: 'Build a chat interface with a conversation list sidebar, message thread area, message bubbles (sent/received), typing indicator, timestamp, and message input with send button. Use WhatsApp-inspired design with smooth animations.',
      category: 'Social' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-8 sm:p-10 text-white animate-slide-up glow-orange-intense border-gradient">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-400/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 flex items-center gap-3 text-shadow-orange">
            {welcomeMessage}
            <span className="text-4xl animate-float">🚀</span>
          </h1>
          <p className="text-orange-50 text-lg sm:text-xl font-semibold">Transform your ideas into reality with AI-powered code generation</p>
        </div>
      </div>



      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the app you want to build... (e.g., 'Create a modern todo app with dark mode')"
              className="input-elite min-h-[160px] resize-none pr-16 text-lg scrollbar-premium focus-ring-orange"
              disabled={isLoading}
              aria-label="Application description"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="text-xs text-gray-600 font-bold hidden sm:block bg-gradient-to-r from-orange-50 to-orange-100 px-3 py-1.5 rounded-lg border border-orange-200">
                {prompt.length > 0 ? `${prompt.length} chars` : '⌘/Ctrl + Enter'}
              </span>
            </div>
            
            {/* Focus glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-blue-50/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-blue-200/50">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Be specific for better results</span>
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="btn-elite flex items-center gap-3 group ripple-effect disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-bold">Generating Magic...</span>
              </>
            ) : (
              <>
                <span className="font-bold">⚡ Generate App</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Template Gallery */}
      <div className="space-y-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-black text-gradient-premium">⚡ Quick Start Templates</h3>
          <div className="h-px flex-1 bg-gradient-to-r from-orange-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(template.prompt);
                setShowSuggestions(false);
              }}
              disabled={isLoading}
              className="card-elite p-6 text-left group relative overflow-hidden ripple-effect"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{template.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-black text-lg text-black group-hover:text-gradient-premium transition-colors">
                      {template.title}
                    </h4>
                    <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-full mt-2 inline-block border border-orange-300">{template.category}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 font-medium">{template.description}</p>
              </div>
            </button>
          ))}
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
