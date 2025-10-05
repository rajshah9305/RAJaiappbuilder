/**
 * RAJ AI APP BUILDER - AI-Powered Personalization Engine
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 * 
 * Dynamically adapts to user behaviors and preferences
 */

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  favoriteCategories: string[];
  recentPrompts: string[];
  generatedCount: number;
  lastVisit: string;
}

export interface PersonalizationSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  basedOn: string[];
}

export class PersonalizationEngine {
  private static readonly STORAGE_KEY = 'raj_ai_preferences';
  private static readonly HISTORY_KEY = 'raj_ai_history';
  private static readonly MAX_HISTORY = 50;

  /**
   * Get user preferences from local storage
   */
  static getPreferences(): UserPreferences {
    if (typeof window === 'undefined') {
      return this.getDefaultPreferences();
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return this.getDefaultPreferences();
    }

    try {
      return { ...this.getDefaultPreferences(), ...JSON.parse(stored) };
    } catch {
      return this.getDefaultPreferences();
    }
  }

  /**
   * Save user preferences
   */
  static savePreferences(preferences: Partial<UserPreferences>): void {
    if (typeof window === 'undefined') return;

    const current = this.getPreferences();
    const updated = { ...current, ...preferences, lastVisit: new Date().toISOString() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  /**
   * Track user action for personalization
   */
  static trackAction(action: string, metadata: Record<string, any>): void {
    if (typeof window === 'undefined') return;

    const history = this.getHistory();
    history.unshift({
      action,
      metadata,
      timestamp: new Date().toISOString(),
    });

    // Keep only recent history
    const trimmed = history.slice(0, this.MAX_HISTORY);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmed));
  }

  /**
   * Get user action history
   */
  static getHistory(): Array<{ action: string; metadata: Record<string, any>; timestamp: string }> {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(this.HISTORY_KEY);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Generate personalized suggestions based on user behavior
   */
  static generateSuggestions(): PersonalizationSuggestion[] {
    const preferences = this.getPreferences();
    const history = this.getHistory();
    const suggestions: PersonalizationSuggestion[] = [];

    // Analyze recent prompts for patterns
    const recentCategories = this.analyzeCategories(history);
    
    // Suggest based on complexity level
    if (preferences.complexity === 'beginner') {
      suggestions.push({
        id: 'simple-todo',
        title: 'Simple Todo App',
        description: 'A basic todo list to get started',
        category: 'Productivity',
        confidence: 0.9,
        basedOn: ['complexity level'],
      });
    } else if (preferences.complexity === 'advanced') {
      suggestions.push({
        id: 'complex-dashboard',
        title: 'Analytics Dashboard',
        description: 'Real-time data visualization with charts',
        category: 'Analytics',
        confidence: 0.85,
        basedOn: ['complexity level'],
      });
    }

    // Suggest based on recent activity
    if (recentCategories.productivity > 2) {
      suggestions.push({
        id: 'project-manager',
        title: 'Project Management Board',
        description: 'Kanban-style project tracker',
        category: 'Productivity',
        confidence: 0.8,
        basedOn: ['recent activity'],
      });
    }

    // Time-based suggestions
    const hour = new Date().getHours();
    if (hour >= 9 && hour < 17) {
      suggestions.push({
        id: 'business-tool',
        title: 'Business Dashboard',
        description: 'Professional metrics and KPI tracker',
        category: 'Business',
        confidence: 0.75,
        basedOn: ['time of day'],
      });
    }

    return suggestions.slice(0, 6);
  }

  /**
   * Get smart prompt completions based on user history
   */
  static getSmartCompletions(partial: string): string[] {
    const history = this.getHistory();
    const prompts = history
      .filter((h) => h.action === 'generate')
      .map((h) => h.metadata.prompt as string)
      .filter((p) => p && p.toLowerCase().includes(partial.toLowerCase()));

    return [...new Set(prompts)].slice(0, 5);
  }

  /**
   * Calculate user engagement score
   */
  static getEngagementScore(): number {
    const preferences = this.getPreferences();
    const history = this.getHistory();
    
    let score = 0;
    
    // Factor 1: Generation count (max 40 points)
    score += Math.min(preferences.generatedCount * 2, 40);
    
    // Factor 2: Recent activity (max 30 points)
    const recentActions = history.filter((h) => {
      const age = Date.now() - new Date(h.timestamp).getTime();
      return age < 7 * 24 * 60 * 60 * 1000; // Last 7 days
    });
    score += Math.min(recentActions.length * 3, 30);
    
    // Factor 3: Variety of categories (max 30 points)
    const categories = this.analyzeCategories(history);
    score += Math.min(Object.keys(categories).length * 5, 30);
    
    return Math.min(score, 100);
  }

  /**
   * Get personalized welcome message
   */
  static getWelcomeMessage(): string {
    const preferences = this.getPreferences();
    const hour = new Date().getHours();
    
    let greeting = 'Hello';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    if (preferences.generatedCount === 0) {
      return `${greeting}! Ready to build something amazing?`;
    } else if (preferences.generatedCount < 5) {
      return `${greeting}! Let's create another masterpiece.`;
    } else if (preferences.generatedCount < 20) {
      return `${greeting}, creator! What shall we build today?`;
    } else {
      return `${greeting}, master builder! Ready for your next innovation?`;
    }
  }

  private static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'light',
      fontSize: 'medium',
      complexity: 'intermediate',
      favoriteCategories: [],
      recentPrompts: [],
      generatedCount: 0,
      lastVisit: new Date().toISOString(),
    };
  }

  private static analyzeCategories(
    history: Array<{ action: string; metadata: Record<string, any> }>
  ): Record<string, number> {
    const categories: Record<string, number> = {};

    history.forEach((h) => {
      if (h.metadata.category) {
        const cat = h.metadata.category.toLowerCase();
        categories[cat] = (categories[cat] || 0) + 1;
      }
    });

    return categories;
  }
}
