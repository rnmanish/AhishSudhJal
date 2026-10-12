# 💧 आशीष शुद्ध जल (Ashish Sudh Jal)

> **High-Reliability Water Delivery & TDS Quality Platform for Sarsar, Siwan, Bihar**  
> Architected with Clean Architecture, Domain-Driven Design (DDD), and optimized for rural 3G mobile performance.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-100%25_Passing-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![CSS](https://img.shields.io/badge/Styling-Vanilla_CSS_Tokens-purple?style=flat)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Performance](https://img.shields.io/badge/Bundle_Budget-<90KB-success?style=flat)](#performance--rural-3g-optimization)

---

## 📖 Overview

**आशीष शुद्ध जल (Ashish Sudh Jal)** is a hyper-local commercial drinking water distribution and water-safety web application serving **Sarsar, Siwan, Bihar**, and adjoining rural communities.

The platform provides seamless digital ordering for domestic 20L water cans, event/bulk water estimation, and instant TDS (Total Dissolved Solids) drinking water safety analysis. It is designed to work smoothly on low-end mobile devices and rural 3G connections.

---

## 🏛️ Architecture & Engineering Principles

The codebase strictly adheres to **Clean Architecture** and **Domain-Driven Design (DDD)**. Layers are strictly decoupled with clear dependency inversion:

```
┌────────────────────────────────────────────────────────┐
│                   Frameworks & App                     │
│               (Next.js App Router, SSR)                │
│                           │                            │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │                    Presentation                  │  │
│  │         (React UI, CSS Tokens, ViewModels)       │  │
│  │                        │                         │  │
│  │  ┌─────────────────────▼──────────────────────┐  │  │
│  │  │                 Infrastructure             │  │  │
│  │  │      (Storage, Static Repos, WhatsApp)     │  │  │
│  │  │                     │                      │  │  │
│  │  │  ┌──────────────────▼───────────────────┐  │  │  │
│  │  │  │              Use Cases               │  │  │  │
│  │  │  │    (Application Business Rules)      │  │  │  │
│  │  │  │                  │                   │  │  │  │
│  │  │  │  ┌───────────────▼────────────────┐  │  │  │  │
│  │  │  │  │             Domain             │  │  │  │  │
│  │  │  │  │ (Entities, Value Objects, Repos│  │  │  │  │
│  │  │  │  │   Zero Framework Dependencies) │  │  │  │  │
│  │  │  │  └────────────────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 1. Domain Layer (`src/core/domain/`)
- **Zero Framework Imports:** Pure TypeScript with no Next.js, React, or browser DOM dependencies.
- **Self-Validating Value Objects:**
  - `IndianPhoneNumber`: Validates standard 10-digit Indian mobile formats (`^[6-9]\d{9}$`).
  - `TdsReading`: Validates non-negative TDS levels with BIS/WHO drinking-water classification.
  - `Money`: Handles monetary transactions, formatting (₹ INR), and prevents fractional or negative currency corruption.
  - `Language`: Strict bilingual language switching (`hi` / `en`).
- **Domain Entities:**
  - `Product`: Manages catalog item validation, pricing, and category integrity.
  - `OrderDraft`: Enforces minimum order quantity, serviceable destination, and line item calculations.
  - `VillageCoverage`: Models delivery areas, delivery fee slabs, and pin codes.

### 2. Use Cases (`src/core/use-cases/`)
- Pure application orchestrators implementing business workflows:
  - `CalculateTdsQualityUseCase`: Evaluates water drinkability according to BIS IS 10500 standards.
  - `ValidateVillageServiceabilityUseCase`: Determines village delivery eligibility and calculates delivery surcharges.
  - `CalculateEventWaterVolumeUseCase`: Estimates water volume in litres and 20L can quantities based on guest counts, duration, and weather season.
  - `BuildOrderSummaryUseCase`: Assembles full order specifications, line items, and WhatsApp dispatch payloads.

### 3. Presentation & Styling (`src/presentation/` & `src/app/`)
- **Zero-Bloat Vanilla CSS Tokens:** Uses design tokens (`tokens.css`) for high-contrast accessibility (WCAG 2.1 AA) and touch-friendly UI. No heavy CSS runtime or Tailwind dependencies.
- **Devanagari Unicode Safety:** All Hindi strings and WhatsApp dispatch URLs are safe for native UTF-8 encoding.

---

## ⚡ Performance & Rural 3G Optimization

- **Bundle Budget:** Total first-load JavaScript strictly constrained to **< 90 KB** (currently **87.4 KB** static payload).
- **Fast First Paint:** Static generation (`output: export` compatible) enables instant rendering on slow connections.
- **Zero Heavy Third-Party Libraries:** Date handling and network dispatch use native web standards (`Intl`, `URLSearchParams`, `fetch`) instead of heavy packages.

---

## 📂 Project Structure

```
AshishSudhJal/
├── src/
│   ├── app/                               # Next.js 14 App Router
│   │   ├── layout.tsx                     # Root HTML layout with viewport & font setup
│   │   ├── page.tsx                       # Landing page
│   │   └── globals.css                    # App global baseline styling
│   ├── core/                              # Clean Architecture Core
│   │   ├── domain/                        # Pure Domain Model (Layer 1)
│   │   │   ├── entities/                  # Product, OrderDraft, VillageCoverage
│   │   │   ├── repositories/              # Repository & Dispatcher Interfaces
│   │   │   └── value-objects/             # IndianPhoneNumber, Money, TdsReading, Language
│   │   └── use-cases/                     # Application Business Logic (Layer 2)
│   │       ├── order/                     # Order calculations & summary builders
│   │       ├── serviceability/            # Village delivery verification
│   │       └── tds/                       # Water quality & TDS assessment
│   └── presentation/                      # UI Components & Design System
│       └── styles/                        # CSS Tokens & responsive utilities
├── tests/                                 # 100% In-Memory Unit Test Suite
│   └── core/
│       ├── domain/                        # Unit tests for Value Objects & Entities
│       └── use-cases/                     # Unit tests for Use Cases
├── AGENTS.md                              # Hardened Engineering Standards & Invariants
├── next.config.js                         # Next.js configuration
├── package.json                           # Dependencies & project scripts
├── tsconfig.json                          # Strict TypeScript configuration
└── vitest.config.ts                       # Vitest configuration (in-memory test runner)
```

---

## 🛠️ Prerequisites

- **Node.js**: `v18.17.0` or higher (Node 20+ LTS recommended)
- **npm**: `v9.0.0` or higher
- **Git**: Installed and configured

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone git@github.com:rnmanish/AhishSudhJal.git
cd AhishSudhJal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles an optimized production build with static generation |
| `npm start` | Runs the compiled production server |
| `npm test` | Runs the full Vitest suite in memory (36 unit tests) |
| `npm run test:watch` | Runs Vitest in interactive watch mode for TDD |
| `npm run lint` | Runs ESLint across `src/` and `tests/` with zero-warning threshold |
| `npm run lint:fix` | Automatically fixes auto-fixable lint issues |

---

## 🛡️ Triple-Verification Quality Gate

Every task, contribution, and pull request must strictly pass the sequential verification gate:

```bash
# 1. Lint Verification (0 errors, 0 warnings)
npm run lint

# 2. Test Verification (100% passing tests)
npm test

# 3. Production Build Compilation
npm run build
```

---

## 🌿 Git Workflow & Push Instructions

When working with remotes, ensure you specify the remote name (`origin`) followed by a space and the branch name (`dev` or `main`):

```bash
# Check current branch and remote
git branch --show-current
git remote -v

# Push changes to your current branch on GitHub (e.g. dev)
git push origin dev

# Or set upstream tracking on first push
git push -u origin dev
```

> ⚠️ **Common Mistake:** Running `git push origin/dev` fails because Git interprets `origin/dev` as the remote repository name instead of `<remote> <branch>`. Always use a space: `git push origin dev`.

---

## 📄 License

Private & Proprietary — © 2026 आशीष शुद्ध जल (Ashish Sudh Jal), Sarsar, Siwan, Bihar. All rights reserved.
