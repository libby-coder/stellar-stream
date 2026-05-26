# Contributing to StellarStream

Thank you for your interest in contributing to StellarStream! This guide will help you get started with our development process.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Install root development tooling: `npm install`
4. Install Git hooks: `npm run prepare`
5. Run the development environment with `npm run dev:backend` and
   `npm run dev:frontend` in separate terminals.

## Pre-commit Checks

This repository uses Husky and lint-staged to run ESLint and Prettier on staged
`.ts` and `.tsx` files before each commit.

The pre-commit hook runs:

```bash
npx lint-staged
```

ESLint runs with `--fix` before Prettier formats the staged files. If ESLint
finds an error it cannot fix, the commit fails and the changes must be fixed
before committing again.

### WSL2

When working on Windows with WSL2, run Git and npm commands from the WSL2
terminal, preferably with the repository stored in the Linux filesystem
(for example, under `~/projects`) rather than `/mnt/c`. After installing
dependencies, run:

```bash
npm run prepare
chmod +x .husky/pre-commit
```

To verify the hook in WSL2, stage a `.ts` or `.tsx` file and run:

```bash
npx lint-staged
```

## Testing

### Backend Tests

Run `npm run test` in the `backend/` directory.

### Contract Tests

Run `cargo test` in the `contracts/` directory.

#### Snapshot Testing

We use `insta` for snapshot testing of contract events.  
Snapshot files are located in `contracts/test_snapshots/`.

**To update snapshots:**
If you change event structures and need to update the snapshots, run:

```bash
cargo insta review
```
