# MPPMS Architecture & System Map

> **AI Context Instructions:** Read this file first to understand the current state of the system, technical standards, and architectural patterns.

## 1. Project Identity
- **Name:** Meritorious Past Paper Management System (MPPMS) v2
- **Core Stack:** React 18, Vite, TypeScript, Tailwind CSS v4
- **Backend:** Firebase (Auth, Firestore, Storage)
- **State Management:** React Context API (No Redux/Zustand)
- **Deployment:** Docker (Nginx, Multi-stage build)

## 2. Visual Standards (Strict)
- **Font:** `Inter` (via Google Fonts & Tailwind `font-sans`)
- **Radius:** `rounded-[2.5rem]` for Cards, `rounded-2xl` for Buttons
- **Colors:** HSL variables in `index.css`. Glassmorphism used for Admin overlays.
- **Icons:** `lucide-react`
- **Animations:** `framer-motion` (Standard duration: 300ms)

## 3. High-Level Architecture

### Directory Structure
```
src/
├── components/          # Presentational & Container Components
│   ├── admin/          # Admin Dashboard & Controls (RBAC protected)
│   ├── papers/         # Paper Management (Grid, Cards, Forms)
│   └── ui/             # Reusable Atoms (Button, Card, Badge)
├── context/            # Global State (Auth, Language, Filter)
├── lib/                # Logic Layer
│   └── firebase/       # API Abstraction (papers.ts, users.ts)
└── index.css           # Design Tokens & Tailwind @theme
```

### Key patterns
- **RBAC:** Controlled via `ProtectedRoute` and `isAdminHost()` utility.
- **Routing:** Lazy-loaded routes in `App.tsx`.
- **Data Flow:** `Firebase API (lib)` -> `Component/Context` -> `UI`.
- **Localization:** `LanguageContext` (English/Tamil).

## 4. Current Configuration
- **Build System:** Vite with `esbuild` minification & manual chunking.
- **Security:** Nginx CSP headers, strict Firestore rules.
- **Docker:** Production-optimized Alpine image.

## 5. Detailed Change Log

### [2026-01-21] Production Docker & Security Finalization
- **Goal:** Prepare system for production deployment with optimized security and performance.
- **Key Files Modified:**
  - `Dockerfile`: Implemented multi-stage build (Node 18 -> Nginx Alpine) to reduce image size.
  - `nginx.conf`: Added strict **Content-Security-Policy (CSP)**, `X-Frame-Options`, and gzip compression.
  - `vite.config.ts`: Configured manual chunking to split `vendor-react` and `vendor-firebase` for cache optimization.
  - `DEPLOYMENT.md`: Comprehensive guide added for Docker commands and troubleshooting.

### [2026-01-21] Visual Standards & Typography
- **Goal:** Enforce premium "Inter" typeface across the application.
- **Key Files Modified:**
  - `src/index.css`: Updated `font-sans` token in Tailwind `@theme` to prioritize "Inter".
  - `index.html`: Verified Google Fonts preconnect and stylesheet links.

### [2026-01-21] Build System Optimization
- **Goal:** Resolve large chunk warnings and improve build time.
- **Key Files Modified:**
  - `vite.config.ts`: switched minifier to `esbuild`, added `chunkSizeWarningLimit: 600`, and defined `manualChunks`.

---
*Maintained by Antigravity Agent. Update this file when making architectural changes.*
