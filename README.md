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
git clone <repository-url>
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

## Project Structure

```text
timesmith/
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
