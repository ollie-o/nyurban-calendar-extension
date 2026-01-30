# GitHub Repository Setup Guide

This guide explains how to set up your GitHub repository with branch protection and required CI checks.

## 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `nyurban-calendar-extension`
3. Choose visibility (Public or Private)
4. Do NOT initialize with README (we already have one)

## 2. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/nyurban-calendar-extension.git
git push -u origin main
```

## 3. Enable GitHub Actions

GitHub Actions should be enabled by default. Verify:

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. If prompted, enable GitHub Actions

## 4. Set Up Branch Protection Rules

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Under "Branch protection rules", click **Add rule**

### Protection Settings for `main` branch:

Configure the following settings:

**Branch name pattern:**

- Enter: `main`

**Protect matching branches - Enable these:**

✅ **Require a pull request before merging**

- ✅ Require approvals: 1
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (optional, if you create a CODEOWNERS file)

✅ **Require status checks to pass before merging**

- ✅ Require branches to be up to date before merging
- **Add required status checks:** After your first CI run, you'll see "validate" checks appear.Select:
  - `validate (18.x)`
  - `validate (20.x)`

✅ **Require conversation resolution before merging**

✅ **Do not allow bypassing the above settings** (Optional - check if you want rules to apply to admins too)

**Rules applied to everyone including administrators:**

- ⬜ Allow force pushes (Keep UNCHECKED)
- ⬜ Allow deletions (Keep UNCHECKED)

4. Click **Create** or **Save changes**

## 5. Optional: Create CODEOWNERS File

Create a `.github/CODEOWNERS` file to automatically request reviews:

```bash
# File: .github/CODEOWNERS
* @YOUR_GITHUB_USERNAME
```

This ensures you're automatically added as a reviewer on all PRs.

## 6. Test the Setup

1. Create a new branch: `git checkout -b test-pr`
2. Make a small change
3. Commit and push: `git push -u origin test-pr`
4. Create a Pull Request on GitHub
5. Verify:
   - CI checks run automatically
   - You cannot merge until CI passes
   - You cannot merge without approval (if you have collaborators)

## 7. Working with PRs

### As a Contributor:

1. Create a branch from `main`
2. Make your changes
3. Run `npm run validate` locally
4. Push and create a PR
5. Wait for CI to pass
6. Request review

### As the Maintainer (You):

1. Review the code changes
2. Check that CI passes (all checks must be green)
3. Add comments or request changes if needed
4. Once satisfied, approve the PR
5. Merge the PR

## Troubleshooting

**CI checks not appearing as required?**

- The checks must run at least once before they appear in the branch protection settings
- Push a commit or create a test PR to trigger the first CI run
- Then go back to branch protection and add the checks

**Need to bypass checks temporarily?**

- Temporarily disable branch protection (not recommended)
- Or grant yourself bypass permissions in the protection settings

**CI failing unexpectedly?**

- Check the Actions tab for detailed logs
- Ensure `package-lock.json` is committed
- Verify Node.js version compatibility

## CI Checks Explained

The CI workflow runs:

1. **Format Check**: Verifies code is formatted with Prettier
2. **Lint**: Checks for code quality issues with ESLint
3. **Type Check**: Validates TypeScript types
4. **Tests**: Runs all Jest unit tests
5. **Build**: Ensures the extension builds successfully

All checks must pass for a PR to be mergeable.
