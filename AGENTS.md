# 🛡️ Ashish Sudh Jal — Hardened Agent Engineering Rules & Fortune 500 Standards

**Scope:** All autonomous agents, coding assistants, and engineers working in this repository.  
**Enforcement:** Mandatory and non-negotiable. Every task completion is audited against this document.

---

## 1. Non-Negotiable Invariants (Prime Directives)

### 🔴 Invariant 1: The Integrity of Lint, Build, and Tooling Configs
> **Rule:** An agent must NEVER relax, disable, weaken, narrow, revert, remove, bypass, or tamper with any configuration or script so that fewer errors are reported than before. This is judged by **effect, not intent**: if a change makes lint, the compiler, the build, or the tests catch less than they did a moment ago, it is forbidden, however it is described or justified.

- **Applies to every rule, old or new.** A rule the user asks you to add is binding **from the moment it is added**. A rule you added earlier in the same session is a protected rule, not a draft. Errors produced by a new rule are the work list for this task, not evidence that the rule is wrong.
- **Protected Files & Settings:**
  - `.eslintrc.*`, `eslint.config.*`, `.eslintignore`, or any linter configuration, including `overrides`, `ignorePatterns`, `rules`, rule options, `selector`/`filter` blocks, and `exceptions`/`allow` lists.
  - `tsconfig*.json` compiler flags, strictness, `include`/`exclude`, or path mappings.
  - `package.json` scripts (`lint`, `lint:fix`, `test`, `build`, `start`, `dev`).
  - `next.config.*` build-safety flags (e.g. `typescript.ignoreBuildErrors`, `eslint.ignoreDuringBuilds`).
  - Test runner configs (`vitest.config.ts`, `jest.config.js`).
  - CI workflows, pre-commit hooks, `husky`, `lint-staged`, and any `CODEOWNERS` file.
  - `AGENTS.md` itself (see Invariant 5).
- **Strictly Forbidden Bypass Tactics:**
  - Adding `/* eslint-disable */`, `// eslint-disable-next-line`, `// @ts-ignore`, `// @ts-nocheck`, or `// @ts-expect-error` to any file without explicit written instruction from the user.
  - Changing lint rule severities from `"error"` to `"warn"` or `"off"`.
  - **Deleting, reverting, commenting out, or undoing a rule** (including one you just added) because it produced errors.
  - **Narrowing a rule's reach**: adding `overrides`, `files` globs, `ignorePatterns`, selector exclusions, or per-directory exemptions that make the rule apply to less code than requested.
  - **Softening a rule's options**: lowering `min`, raising `max`, growing `exceptions`/`allow` lists, loosening regexes, or replacing a rule with a weaker substitute.
  - Creating or appending files to `.eslintignore` or using ignore flags to skip defective files.
  - Modifying npm scripts to swallow errors (e.g. appending `|| true`, `--quiet`, `--silent`) or raising `--max-warnings`.
  - Double type-casting (`as unknown as T` or `value as any as T`) to silence the compiler.
  - Spamming non-null assertion operators (`!`) without prior defensive runtime verification.
- **What counts as authorization to weaken a protected config:** only a user message that **names the specific rule or setting and explicitly says to relax or remove it**. Phrases such as "go ahead", "okay", "proceed", "sounds good", or "do what you think is best" are **never** authorization to weaken anything.
- **Required Action:** Fix the underlying source code to comply with the strict rules. If code violates a rule, the code is defective, not the rule. The number of errors (3 or 300) is never a reason to weaken a rule; a large mechanical refactor is simply the job.

---

### 🔴 Invariant 2: The Sanctity of Tests & Zero-Skip Policy
> **Rule:** An agent must NEVER delete, comment out, weaken assertions in, skip, or circumvent existing test cases.
- **The Contract Principle:** Existing tests define the verified contract of the system. Failing tests indicate that the implementation is broken, incomplete, or regressed.
- **Strictly Forbidden Actions:**
  - Using `test.skip()`, `it.skip()`, `describe.skip()`, `xit()`, `xdescribe()`, or `it.todo()` to bypass failing tests.
  - Excluding test files, globs, or suites in test runner configurations.
  - Modifying test assertions to match incorrect or broken implementation outputs.
  - Writing vacuous / tautological assertions in new tests (e.g. `expect(true).toBe(true)` or asserting `toBeDefined()` on hardcoded defaults).
  - Mocking the system-under-test (SUT). Only external boundaries (e.g. network dispatchers, browser storage) may be mocked in unit tests.
- **When Tests CAN Be Modified:** Only when the user explicitly requests a business requirement change that intentionally alters expected behavior, or when adding *new* assertions to cover new capabilities.
- **Required Action:** Fix the production implementation until all existing and new tests pass with 100% success.

---

### 🔴 Invariant 3: The Triple-Verification Gate
> **Rule:** No task, phase, or pull request is ever declared complete without executing and passing all three gates sequentially:
1. `npm run lint` ➔ **0 errors, 0 warnings** (strictly validates both `src/` and `tests/`).
2. `npm test` ➔ **100% passing tests** (zero failed, zero skipped, zero suites bypassed).
3. `npm run build` ➔ **Clean Next.js production build** with static compilation.

- **A red gate with strict configs is an acceptable state to report. A green gate achieved by weakening configs is a violation.** If a gate cannot be made green without weakening anything, stop and report the failure with the real output (see Invariant 4).
- Never claim a gate passed unless you ran it in this session and saw it pass. Quote the actual result.

---

### 🔴 Invariant 4: No Silent Deviation (Stop-and-Ask Protocol)
> **Rule:** Do exactly what the user instructed, at the scope they instructed. If you cannot, or if the instruction is ambiguous, **stop and ask before changing anything**. Never substitute a reduced, narrowed, or "safer" version on your own, and never discover the problem by acting first.

- **Fidelity:** If the user says "add these rules", all of those rules go in, fully, and stay in. Do not drop, shrink, or re-scope any part of an instruction.
- **Ambiguity is raised up front.** If a requested rule is ambiguous (e.g. does the `I` prefix apply to every interface or only to repository interfaces?), ask **before** editing the config, listing the concrete options. Do not guess, apply, hit errors, and then quietly retreat.
- **Conflict or blocker:** If an instruction conflicts with another rule, or the work is much larger than expected, leave the strict configuration in place (or do not apply the change at all), report the blocker, and ask. Do not resolve it by loosening anything.
- **No undoing your own work to get green.** Reverting something you just added because it caused failures is a weakening and falls under Invariant 1.
- **Mandatory Config Diff Statement:** Every final report must include a section listing each change made to a protected file (Invariant 1) and confirming each one only **adds or tightens** enforcement. If no protected file was touched, say so explicitly. A protected-file change that is missing from this statement counts as concealment.
- **Honest reporting:** If the task is incomplete, or any instruction was not fully carried out, say so in the **first line** of the report, not buried at the end. Do not describe partial work as complete.
- **If you realize you already violated a rule:** restore the strict state immediately, then report exactly what you changed and restored. Do not wait for the user to notice. Skip the long apology; state the facts and the fix.

---

### 🔴 Invariant 5: AGENTS.md Self-Protection
> **Rule:** An agent must NEVER edit, delete, reword, or "clarify" `AGENTS.md` unless the user explicitly asks for that exact edit. If you believe a rule here is wrong, outdated, or in the way, say so in your message and propose the change as text. Do not apply it.

---

## 2. Fortune 500 Senior Engineering Best Practices

### 2.1 Architecture & Boundaries (Clean Architecture)
- **Domain Independence (Layer 1):**
  - Files under `src/core/domain/` MUST contain pure TypeScript with **zero framework imports** (no React, Next.js, Firebase, DOM, or UI libraries).
  - Domain entities and value objects enforce their own business invariants upon creation.
  - **No Leaky Abstractions:** Repository interfaces (`IVillageRepository`, `IProductRepository`) must accept and return pure domain entities and value objects only—never database-specific document shapes or HTTP payloads.
- **Deterministic Domain Logic:**
  - Domain models must be pure and deterministic. Direct calls to `new Date()`, `Date.now()`, or `Math.random()` inside domain classes are forbidden. Pass timestamps or clocks as explicit parameters or injected abstractions.
- **Use Case Purity (Layer 2):**
  - Application business rules live in `src/core/use-cases/`.
  - Use cases coordinate domain entities and depend exclusively on abstract repository/service interfaces.
  - Use cases NEVER import from `infrastructure/`, `presentation/`, or `app/`.
- **Interface Adapters (Layer 3):**
  - Concrete repositories (`InMemoryVillageRepository`, `StaticProductRepository`) implement domain repository interfaces.
  - Presenters and ViewModels take the form of custom React hooks (`useBookingWizard`, `useTdsAnalyzer`).
- **Frameworks & Drivers (Layer 4):**
  - UI components and Next.js App Router pages live in `presentation/` and `app/`.
  - They consume domain logic via Dependency Injection (`container.ts` and `AppProviders.tsx`), never instantiating concrete repositories directly.

---

### 2.2 Next.js App Router & SSR Hydration Safety
- **Strict Boundary Directives:**
  - Every component using React hooks (`useState`, `useEffect`, `useContext`), event listeners (`onClick`, `onChange`), or browser APIs must have the `'use client'` directive at the very top of the file.
- **Hydration Mismatch Prevention:**
  - Any access to browser globals (`window`, `document`, `localStorage`, `navigator`) must be strictly guarded with `typeof window !== 'undefined'` or executed inside `useEffect()`.
  - Never render time-dependent or random values during server rendering that differ from the client.

---

### 2.3 SOLID Principles in Action
| Principle | Architectural Rule |
| :--- | :--- |
| **S — Single Responsibility** | Every class, module, and hook must have exactly one reason to change. Separate calculation logic from formatting, and formatting from network/dispatching. |
| **O — Open/Closed** | Systems must be open for extension, closed for modification. New villages or products are added via centralized data files (`villages.data.ts`, `products.data.ts`) without modifying business logic. |
| **L — Liskov Substitution** | Implementations of `IVillageRepository` or `IProductRepository` must be interchangeable without callers knowing or caring about the underlying storage engine. |
| **I — Interface Segregation** | Keep interfaces small, cohesive, and client-focused. Never force a consumer to depend on methods it does not use. |
| **D — Dependency Inversion** | High-level use cases must depend on abstractions (interfaces), never on concrete infrastructure classes. Concrete classes are wired in the composition root (`container.ts`). |

---

### 2.4 Defensive Programming & Type Safety
- **Zero `any` Policy:** The use of `any` is strictly prohibited in application code. Use generics, union types, or `unknown` with type narrowing.
- **Value Objects for Invariants:** Never pass primitive strings/numbers where domain invariants exist. Use `IndianPhoneNumber`, `TdsReading`, and `Money`.
- **Fail Fast:** Validate inputs at system boundaries (e.g. constructor or API entry point). Throw domain-specific descriptive errors immediately.
- **Explicit Type Imports:** Always use `import type { ... }` for types to ensure clean tree-shaking and avoid cyclical dependencies.
- **Immutability by Default:** Mark properties as `readonly` and prefer pure functions with return values rather than mutating arguments.
- **Semantic Naming Standard (Zero Cryptic / Short Identifiers):** Single-letter and two-letter variable or parameter names (e.g., `e`, `i`, `v`, `p`, `cb`, `fn`, `id`) are strictly prohibited and mechanically enforced via ESLint `id-length` (minimum 3 characters, except `_` for explicitly unused discards). Identifiers must describe their semantic domain role:
  - In catch blocks: `catch (error)` instead of `catch (e)`.
  - In event handlers: `(event)` or `(changeEvent)` instead of `(e)`.
  - In array iterations: `villages.map((village, index) => ...)` instead of `(v, i) => ...`.
  - In repository/entity methods: use specific parameter names (`villageId`, `productId`, `targetId`) instead of ambiguous `id`.
  - In callbacks: `callback` or `onCompleteHandler` instead of `cb` or `fn`.

---

### 2.5 Testing Discipline (Shift-Left Quality)
- **Dedicated Unit Tests:** Every new entity, value object, use case, or utility must have accompanying unit tests in `tests/`.
- **Deterministic & Isolated:** Unit tests must execute in memory with zero external dependencies (no live network, database, or DOM requirement).
- **Edge-Case & Boundary Coverage:** Tests must systematically verify:
  - Valid happy paths.
  - Boundary limits (e.g., TDS = 0, 50, 150, 300, 500, 1200).
  - Negative cases (negative numbers, invalid phone digits, empty strings).
- **Meaningful Assertions:** Every test must assert concrete values, thrown errors, or state changes. Never write tests that only verify truthy flags.
- **Regression Prevention:** When fixing a bug, write a reproducing test first, confirm it fails, and then fix the code.

---

### 2.6 Production Readiness, Performance & Security
- **Bundle Weight Budget (Rural 3G Optimization):**
  - The target audience lives in rural Siwan district where 3G mobile networks prevail.
  - Zero heavy CSS libraries (Tailwind, Bootstrap, MUI are forbidden). Use high-performance Vanilla CSS with custom tokens.
  - Total first-load JS must remain strictly **under 90 KB**.
- **Zero-Bloat Dependency Policy:**
  - An agent must NEVER run `npm install <package>` for new runtime dependencies without explicit user authorization.
  - Always prefer modern native web APIs (`fetch`, `Intl`, `URLSearchParams`, `crypto`) over third-party utilities (`lodash`, `moment`, `axios`).
- **Devanagari Unicode Safety:** All Hindi text sent over WhatsApp URLs or stored in state must use strict `encodeURIComponent` to prevent encoding corruption.
- **Accessibility & UX:**
  - Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
  - WCAG 2.1 AA color contrast compliance.
  - Native touch targets (minimum 44×44px) for mobile usability.
- **Secret & Credential Hygiene:**
  - Zero hardcoded API keys, private tokens, or sensitive credentials in source code.
  - Use environment variables with `NEXT_PUBLIC_` scoping strictly restricted to public client-safe identifiers.
- **Single Source of Truth:** All pricing, catalog details, village names, and pincodes must live in centralized configuration files (`products.data.ts`, `villages.data.ts`). Never hardcode prices or lists across multiple UI components.

---

### 2.7 Enforced Lint Rule Registry (Written Standard)
Every lint rule the user asks to add is recorded here **in the same change that adds it**, so there is always a written standard to defend. Rules in this registry are protected under Invariant 1. Removing or narrowing a row requires the explicit, rule-named user instruction described in Invariant 1.

| Rule | Required scope & options | Status |
| :--- | :--- | :--- |
| `id-length` | `min: 3`, exception only `_` for unused discards; applies to all of `src/` and `tests/` | Active |
| `@typescript-eslint/naming-convention` | **Granular scope (owner decision):** `camelCase` for all variables, parameters, and methods; `PascalCase` for classes, types, and enums; interfaces under `src/core/domain/repositories/**` MUST match `^I[A-Z]` (e.g. `IVillageRepository`); all other interfaces (React component props, config and data shapes) use plain `PascalCase` with no `I` prefix | Active |

> The `overrides` block that scopes the `I`-prefix requirement to `src/core/domain/repositories/**` is the sanctioned implementation of the row above and is not a weakening. Any further narrowing, such as excluding other repository folders or adding exemptions, still requires the explicit, rule-named user instruction from Invariant 1.

---

## 3. Pre-Completion Checklist for Every Agent Step

Before completing any task, an agent must verify:
- [ ] Did I do exactly what was instructed, at the full scope instructed, with nothing dropped, shrunk, or re-scoped?
- [ ] Did I ask before editing whenever scope was ambiguous or the work could not be done as specified?
- [ ] Did I review the diff of every protected file and confirm each change only adds or tightens enforcement?
- [ ] Does my final report open with any incomplete or unmet items, and include the Config Diff Statement?
- [ ] Are all newly added files conforming to Clean Architecture layer rules?
- [ ] Are all types strictly typed without `any` or double-casting (`as unknown as T`)?
- [ ] Are all variables and parameters meaningfully named without single- or two-letter identifiers (zero `e`, `i`, `v`, `p`, `cb`, `id`)?
- [ ] Were existing tests preserved with zero skipped (`it.skip`), commented-out, or weakened tests?
- [ ] Were new unit tests with rigorous assertions written to cover newly added code?
- [ ] Are all browser API calls protected against Next.js SSR hydration crashes?
- [ ] Were zero unauthorized runtime npm packages installed?
- [ ] Is `AGENTS.md` untouched (unless the user explicitly requested an edit)?
- [ ] Did `npm run lint` pass with 0 errors and 0 warnings across `src/` and `tests/`?
- [ ] Did `npm test` pass with 100% of test suites green?
- [ ] Did `npm run build` succeed cleanly?

---

## 4. Phase-Specific Quality Milestones & Scheduled Reminders

> **Persistent Directive:** When assisting the user in future sessions, the assistant must automatically consult these reminders and proactively suggest/implement the corresponding checks at each milestone:

| Milestone / Phase | Required Action / Suggestion | Purpose & Implementation |
| :--- | :--- | :--- |
| **Phase 2 (T-09: DI Wiring)** | **Enforce Presentation Layer Isolation in ESLint** | Add `no-restricted-imports` rule in `.eslintrc.json` blocking `src/presentation/**` from importing directly from `src/infrastructure/repositories/*`. Forces all UI to consume repositories exclusively via `container.ts` and domain interfaces. |
| **Phase 3 (T-11/T-12: UI Tokens & Components)** | **Duplicate Code Detection (`jscpd`)** | Add zero-dependency CLI `npx jscpd src/` to CI to prevent duplicate copy-pasted UI, formatting, or pricing calculations across components and hooks. |
| **Phase 4 (T-17: Wizard & Feature Modules)** | **Dead Code & Unused Export Pruner (`knip`)** | Run `npx knip` to identify any dead exported functions, unused types, or orphaned files before proceeding to assembly. |
| **Phase 5 (T-22: Launch, Auth & Deployment)** | **SAST & SonarCloud Audit + Test Coverage Gate** | Conduct input security audit on Firebase Auth handlers, check for ReDoS in phone/text regexes, and verify in-memory test coverage via `vitest run --coverage`. |
