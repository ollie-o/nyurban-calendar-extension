# Contributing

## Setup

```bash
git checkout -b feature/your-feature
npm install
npm run validate  # Run before committing
```

## Commands

```bash
npm test              # Run tests
npm run format        # Auto-format code
npm run build         # Build extension
```

## Code Standards

- Arrow functions only
- Comments as complete sentences
- Max line length: 100 chars
- Single quotes, semicolons required
- Prefer `const` over `let`

## Pull Requests

1. Run `npm run validate` (must pass)
2. Push to your branch and create PR
3. Wait for CI checks and review
4. Address feedback, then maintainer will merge

CI runs: Prettier, ESLint, TypeScript, Jest
