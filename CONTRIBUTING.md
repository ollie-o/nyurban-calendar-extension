# Contributing

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a new branch: `git checkout -b feature/your-feature-name`

## Code Quality

This project enforces code quality through automated checks:

- **Prettier**: Code formatting (100 character line length)
- **ESLint**: Code linting with strict rules
- **TypeScript**: Type checking
- **Jest**: Unit tests

### Before Committing

Run the validation script to ensure your code meets all requirements:

```bash
npm run validate
```

This will run:

- Format checking (`npm run format:check`)
- Linting (`npm run lint`)
- Type checking (`npm run type-check`)
- Tests (`npm test`)

### Auto-formatting

To automatically format your code:

```bash
npm run format
```

### Running Tests

```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
```

## Pull Request Process

1. Ensure all tests pass and code is properly formatted
2. Update documentation if needed
3. Create a pull request targeting the `main` branch
4. Wait for CI checks to pass (all checks must pass)
5. Request review from a maintainer
6. Address any feedback
7. Once approved, a maintainer will merge your PR

## Code Style

- Use arrow functions for all functions
- Comments should be complete sentences (capitalize first letter, end with period)
- Maximum line length: 100 characters
- Use single quotes for strings
- Always use semicolons
- Prefer `const` over `let`, never use `var`

## Commit Messages

Write clear, descriptive commit messages:

- Use present tense ("Add feature" not "Added feature")
- Be concise but descriptive
- Reference issues when applicable
