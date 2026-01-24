# Merit Series - Meritorious Past Paper Management System

> **A modern, accessible, and scalable platform for managing and distributing educational past papers.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.2-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple)](https://vitejs.dev/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**Merit Series** is a comprehensive web application designed to streamline the management, distribution, and accessibility of educational past papers. Built for educational institutions, students, and educators, it provides:

- **Public Access**: Students can browse, search, and download past papers without authentication
- **Admin Management**: Authorized staff can upload, edit, and manage the paper repository
- **Contribution System**: Integrated Stripe donations ("Buy Me a Coffee") to support platform operations
- **Multi-language Support**: English and Tamil localization
- **Accessibility First**: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support

---

## ✨ Key Features

### For Students & Educators

- 🔍 **Advanced Search & Filtering**: Filter by subject, year, and language with real-time results
- 📄 **PDF Preview**: In-browser PDF viewing without needing to download files first
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- 🌍 **Internationalization**: One-click switch between English and Tamil interfaces
- ♿ **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support

### For Administrators

- 🔐 **Secure Authentication**: Role-based access control (Admin/Super Admin)
- 📝 **Smart Paper Management**:
  - Auto-title generation from filenames
  - Multi-file upload support (Part 1, Part 2, Marking Scheme)
  - Unified Add/Edit interface with custom validations
- 👥 **User Management**: System administrators can manage access controls
- ⚙️ **System Configuration**: 
  - Dynamic filter options ( Subjects, Years, Languages)
  - Social media link management
- 📊 **Analytics Dashboard**: Visitor tracking and contribution monitoring

### Contribution System

- 💳 **Stripe Integration**: Secure payment processing for donations
- ☕ **Support Platform**: Users can support the platform with customizable donation amounts
- 🧾 **Auto-Receipts**: Professional PDF receipts generated instantly via jsPDF
- 📈 **Transparency**: Public progress bars for fundraising goals

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for optimized build performance
- **Tailwind CSS 4** for styling
- **Lucide React** for consistent iconography
- **Framer Motion** for smooth UI transitions
- **React Router 6** for navigation

### Backend & Infrastructure
- **Firebase**:
  - Authentication (Email/Password, Google OAuth)
  - Firestore (NoSQL database)
  - Storage (Secure file hosting)
- **Stripe** for payments
- **Docker** for containerized deployment
- **Nginx** for production serving and caching

---

## 📁 Project Structure

```
Merit-Series/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific panels
│   │   ├── auth/           # Authentication forms
│   │   ├── hero/           # Landing page components
│   │   ├── layout/         # Navigation, Footer
│   │   ├── papers/         # Paper grid, cards, forms
│   │   ├── pages/          # Route page wrappers
│   │   └── ui/             # Reusable UI primitives (Input, Button, Modal)
│   ├── context/            # Global state (Auth, Language, Filters)
│   ├── hooks/              # Custom hooks (pagination, viewer)
│   ├── lib/                # Utilities & API layers
│   │   ├── firebase/       # Firebase service abstraction
│   │   └── utils/          # Helper functions
│   ├── App.tsx             # Main application router
│   └── main.tsx            # Entry point
├── public/                 # Static assets & SEO files
├── nginx.conf              # Production server config
├── Dockerfile              # Container definition
├── docker-compose.yml      # Orchestration config
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Firebase Project** setup
- **Stripe Account** (optional, for donations)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/merit-series.git
   cd merit-series
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`

---

## ⚙️ Configuration

### Firebase Security Rules
Deploy the included `firestore.rules` to secure your database:
```bash
firebase deploy --only firestore:rules
```
Crucial rules:
- Public read access for papers
- Admin-only write access
- User-specific data protection

---

## 🐳 Deployment

### Docker (Recommended)

Build and run the containerized application:

```bash
# Build
docker build -t merit-series-app .

# Run
docker run -p 80:80 merit-series-app
```

The Docker image includes Nginx optimized with security headers and caching policies.

### Manual Build

```bash
npm run build
# Serve the /dist folder using any static host
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request. ensure all new components are accessible (ARIA labels, keyboard support) and responsive.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with 💙 by the Merit Series Team**
