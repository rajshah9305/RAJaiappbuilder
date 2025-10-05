# Contributing to NLP-to-App Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository from [rajshah9305/NLPtoapp](https://github.com/rajshah9305/NLPtoapp)
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/NLPtoapp.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes: `npm test`
6. Commit: `git commit -m "feat: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🧪 Testing

```bash
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

## 📋 Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Run `npm run lint` before committing
- Ensure `npm run build` succeeds

## 🔒 Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Report security issues privately to the maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
