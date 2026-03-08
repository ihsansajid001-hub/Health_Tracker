# Contributing to Health Tracker Wellness App

First off, thank you for considering contributing to Health Tracker! 🎉

All contributions, bug reports, bug fixes, documentation improvements, enhancements, and ideas are welcome.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Health & Safety Guidelines](#health--safety-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Help us improve by reporting it!

**Before submitting a bug report:**
- Check the [existing issues](https://github.com/ihsansajid001-hub/Health_Tracker/issues) to avoid duplicates
- Collect information about the bug (steps to reproduce, expected vs actual behavior, screenshots)

**How to submit a good bug report:**
1. Use a clear and descriptive title
2. Describe the exact steps to reproduce the problem
3. Provide specific examples (code snippets, screenshots)
4. Describe the behavior you observed and what you expected
5. Include your environment details (OS, browser, Node version)

### 💡 Suggesting Features

Have an idea to make Health Tracker better?

**Before submitting a feature request:**
- Check if the feature already exists or is planned
- Consider if it aligns with the project's goals (comprehensive wellness tracking)

**How to submit a good feature request:**
1. Use a clear and descriptive title
2. Provide a detailed description of the proposed feature
3. Explain why this feature would be useful to users
4. Include mockups or examples if possible

### 📝 Improving Documentation

Documentation improvements are always welcome! This includes:
- Fixing typos or clarifying existing docs
- Adding examples or tutorials
- Translating documentation
- Improving code comments

### 💻 Contributing Code

Want to contribute code? Awesome! Here's how:

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Health_Tracker.git
   cd Health_Tracker
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ihsansajid001-hub/Health_Tracker.git
   ```

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for database)
- Code editor (VS Code recommended)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill in your Supabase credentials in `.env.local`

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Create a Supabase project
2. Run the schema from `supabase/complete_schema.sql`
3. Update your `.env.local` with Supabase credentials

## Contribution Guidelines

### Branch Naming

Use descriptive branch names:
- `feature/add-meal-planner` - for new features
- `fix/sleep-tracking-bug` - for bug fixes
- `docs/update-readme` - for documentation
- `refactor/optimize-queries` - for code refactoring

### Commit Messages

Write clear, concise commit messages:
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

**Examples:**
```
feat: Add barcode scanner for nutrition tracking
fix: Resolve sleep score calculation error
docs: Update installation instructions
refactor: Optimize database queries for dashboard
```

### Code Quality

- Write clean, readable code
- Follow existing code style and patterns
- Add comments for complex logic
- Ensure your code passes linting: `npm run lint`
- Test your changes thoroughly

## Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 11, macOS 14]
 - Browser: [e.g. Chrome 120, Safari 17]
 - Node Version: [e.g. 18.17.0]

**Additional context**
Add any other context about the problem here.
```

## Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context, mockups, or screenshots about the feature request here.

**Which wellness category does this relate to?**
- [ ] Sleep
- [ ] Fitness
- [ ] Nutrition
- [ ] Hydration
- [ ] Mental Wellness
- [ ] Other
```

## Pull Request Process

1. **Update your fork** with the latest changes:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** on GitHub:
   - Use a clear title describing the change
   - Fill out the PR template completely
   - Link related issues
   - Request review from maintainers

### Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] No new warnings or errors introduced
- [ ] Changes tested locally
- [ ] Related issues linked in PR description

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use functional components with hooks (React)
- Follow ESLint configuration
- Use meaningful variable and function names
- Keep functions small and focused

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme and design patterns
- Ensure responsive design (mobile-first)
- Support dark mode

### File Organization

```
components/
  ├── dashboard/     # Dashboard-specific components
  ├── fitness/       # Fitness tracking components
  ├── mind/          # Mental wellness components
  ├── nutrition/     # Nutrition tracking components
  ├── sleep/         # Sleep tracking components
  └── safety/        # Safety and disclaimer components
```

## Health & Safety Guidelines

**CRITICAL**: This app deals with health and wellness. Please follow these guidelines:

### Medical Disclaimers

- Always include medical disclaimers for health-related features
- Never provide medical advice
- Encourage users to consult healthcare professionals

### Data Safety

- Use scientifically accurate formulas (BMI, BMR, TDEE, etc.)
- Implement safety limits (e.g., calorie minimums, water maximums)
- Add warnings for potentially dangerous activities
- Check for contraindications (medical conditions vs exercises)

### Privacy & Security

- Never log or expose personal health data
- Follow HIPAA-like privacy standards
- Encrypt sensitive data
- Implement proper authentication and authorization

### Testing Health Features

When adding health-related features:
1. Research medical guidelines and best practices
2. Cite sources for health calculations
3. Add safety checks and warnings
4. Test edge cases (extreme values, medical conditions)
5. Get feedback from healthcare professionals if possible

## Questions?

Feel free to:
- Open an issue for questions
- Join discussions in existing issues
- Contact the maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

---

**Thank you for contributing to Health Tracker!** 🙏

Your efforts help make wellness tracking accessible and effective for everyone.

**Project Repository**: https://github.com/ihsansajid001-hub/Health_Tracker

**Last Updated**: March 2026
