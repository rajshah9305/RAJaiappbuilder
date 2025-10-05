# Contributing to RAJ AI APP BUILDER

First off, thank you for considering contributing to RAJ AI APP BUILDER! It's people like you that make this project such a great tool for the developer community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- Cerebras API key (for testing AI features)

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/NLPtoapp.git
   cd NLPtoapp
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/rajshah9305/NLPtoapp.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your CEREBRAS_API_KEY to .env
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 💻 Development Process

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/analytics-export`)
- `fix/` - Bug fixes (e.g., `fix/responsive-mobile`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/personalization-engine`)
- `perf/` - Performance improvements (e.g., `perf/reduce-bundle-size`)

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(analytics): add export to CSV functionality
fix(mobile): resolve navigation menu overflow on small screens
docs(readme): update installation instructions
refactor(api): optimize streaming response handling
```

### Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow existing code style and patterns
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

5. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code builds successfully (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] All existing tests pass
- [ ] New features include appropriate tests
- [ ] Documentation is updated
- [ ] Responsive design works (320px to 1920px+)
- [ ] No console errors or warnings

### Submitting a Pull Request

1. **Create a Pull Request** from your fork to `rajshah9305/NLPtoapp:main`

2. **Fill out the PR template** with:
   - Clear description of changes
   - Related issue numbers (if applicable)
   - Screenshots (for UI changes)
   - Testing performed

3. **Respond to review feedback**
   - Address all comments
   - Push additional commits if needed
   - Request re-review when ready

4. **PR Approval**
   - At least one maintainer approval required
   - All CI checks must pass
   - No merge conflicts

### PR Title Format

```
<type>(<scope>): <description>
```

**Examples:**
- `feat(dashboard): add real-time collaboration mode`
- `fix(editor): resolve Monaco syntax highlighting bug`
- `docs(api): add examples for streaming endpoints`

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React Components

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Button({ 
  onClick, 
  children, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Create custom classes in `globals.css` for reusable patterns
- Follow mobile-first responsive design
- Use semantic class names

### File Organization

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
└── types/           # TypeScript type definitions
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

- [ ] Test on mobile (320px, 375px, 414px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on desktop (1280px, 1920px)
- [ ] Test keyboard navigation
- [ ] Test with screen reader (if applicable)
- [ ] Test loading states
- [ ] Test error states
- [ ] Test edge cases

### Future: Automated Tests

We plan to add automated testing. When contributing tests:
- Write unit tests for utility functions
- Write integration tests for API routes
- Write E2E tests for critical user flows

## 📚 Documentation

### Code Comments

```typescript
/**
 * Calculates user engagement score based on multiple factors
 * @param history - Array of user actions
 * @param preferences - User preference settings
 * @returns Engagement score from 0-100
 */
function calculateEngagement(history: Action[], preferences: Preferences): number {
  // Implementation
}
```

### README Updates

- Update README.md for new features
- Add usage examples for new functionality
- Update API documentation for endpoint changes

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up-to-date with code

## 🐛 Reporting Bugs

### Bug Report Template

**Title:** Clear, descriptive title

**Description:**
- What happened
- What you expected to happen
- Steps to reproduce

**Environment:**
- OS: (e.g., macOS 14.0)
- Browser: (e.g., Chrome 120.0)
- Node version: (e.g., 18.17.0)
- Screen size: (e.g., 1920x1080)

**Screenshots:**
Include screenshots if applicable

## 💡 Requesting Features

### Feature Request Template

**Title:** Clear feature description

**Problem:**
Describe the problem this feature would solve

**Proposed Solution:**
Describe your proposed solution

**Alternatives:**
Describe alternative solutions you've considered

**Additional Context:**
Add any other context or screenshots

## 🏆 Recognition

Contributors will be:
- Listed in our Contributors section
- Mentioned in release notes
- Given credit in documentation

## 📞 Getting Help

- **GitHub Issues:** [Create an issue](https://github.com/rajshah9305/NLPtoapp/issues)
- **Discussions:** [Join discussions](https://github.com/rajshah9305/NLPtoapp/discussions)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to RAJ AI APP BUILDER! 🎉

**Happy Coding!** 🚀
