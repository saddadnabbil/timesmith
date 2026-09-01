# Timesmith

Timesmith is a fast-paced, interactive arithmetic and times-table practice web application built with React 19, TanStack Start, and Tailwind CSS. Designed to sharpen mental math skills, Timesmith provides engaging game modes, detailed progress tracking, and targeted weak-fact practice.

---

## Features

- **Multiple Operations**: Practice Multiplication, Addition, Subtraction, Division, or Mixed problems.
- **Custom Table Selector**: Target specific times-tables (e.g., 7x table) or practice random equations.
- **Game Modes**:
  - **Sprint**: Solve as many equations as possible in 60 seconds.
  - **Streak**: Maintain your streak with 3 lives — one wrong answer loses a heart.
  - **Practice**: Untimed, focused practice set (20 problems).
- **Progress & Analytics**: Track overall accuracy, speed per fact, and identify weak combinations to improve on.
- **Web Audio Sound Effects**: Dynamic Web Audio API feedback for correct/incorrect inputs, combos, and milestones.
- **Local Save System**: Instant persistence using `localStorage`.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/router)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

---

## Getting Started

### Prerequisites

Ensure you have **Node.js** (v18 or higher, recommended v22) and `npm` installed.

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/saddadnabbil/timesmith.git
cd timesmith
npm install
```

### 2. Running for Development

Start the development server:

```bash
npm run dev
```

The app will be running locally at `http://localhost:8080` (or `http://0.0.0.0:8080`).

> **Note**: If port `8080` is already in use by another process on your machine, you can specify a custom port:
> ```bash
> npm run dev -- --port 3000
> ```

---

## Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server on port `8080` |
| `npm run build` | Compiles and builds the production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run typecheck` | Runs TypeScript compiler checks without emitting files |
| `npm run test` | Executes unit tests |
| `npm run lint` | Lints the codebase using ESLint |
| `npm run format` | Formats the codebase using Prettier |

---

## Contributing & Branch Workflow

We welcome contributions! To maintain code quality and stability, direct pushes to the `main` branch are restricted. All changes must go through a Pull Request and pass automated CI checks.

### Workflow Steps

1. **Fork or Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Changes & Test Locally**:
   Run typecheck, linting, and tests before committing:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**:
   Open a PR against the `main` branch on GitHub.
   - GitHub Actions will run automated type checks and build verification on your PR.
   - Once reviewed and approved by a maintainer, your PR will be merged into `main`.

5. **Automatic Production Deployment**:
   Merging into `main` automatically triggers the GitHub Actions CI/CD deployment pipeline to Cloudflare Pages (`https://timesmith.saddadnabbil.my.id`).

---

## CI/CD Pipeline & GitHub Secrets

Automated build verification and deployment are handled by GitHub Actions (`.github/workflows/ci-cd.yml`).

### Required GitHub Secrets

To enable automated deployment to Cloudflare Pages, set the following secrets in **Settings > Secrets and variables > Actions**:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API Token with Pages deployment permissions.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (`1ec856168ea590c7a368f0db28a6f3d1`).

---

## Project Structure

```text
timesmith/
├── .github/
│   └── workflows/
│       └── ci-cd.yml    # GitHub Actions CI/CD pipeline
├── public/              # Static assets
├── scripts/             # Build and environment helper scripts
├── src/
│   ├── components/      # React components (UI & game screens)
│   │   ├── game/        # Core game screens (Home, Play, Results, Progress)
│   │   └── ui/          # Reusable UI elements (Buttons, Cards, Dialogs, etc.)
│   ├── lib/
│   │   └── game/        # Game engine, audio synthesizer, store, and types
│   ├── routes/          # TanStack Router file-based routes
│   └── styles.css       # Global styles & Tailwind configuration
├── package.json
└── vite.config.ts
```

---

## License

MIT
