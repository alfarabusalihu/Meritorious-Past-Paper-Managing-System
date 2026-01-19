# MPPMS - Meritorious Past Paper Management System

> **A modern, accessible, and scalable platform for managing and distributing educational past papers.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.2-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

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

**MPPMS** is a comprehensive web application designed to streamline the management, distribution, and accessibility of educational past papers. Built for educational institutions, students, and educators, it provides:

- **Public Access**: Students can browse, search, and download past papers without authentication
- **Admin Management**: Authorized staff can upload, edit, and manage the paper repository
- **Contribution System**: Integrated Stripe donations to support platform operations
- **Multi-language Support**: English and Tamil localization
- **Accessibility First**: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support

---

## ✨ Key Features

### For Students & Educators

- 🔍 **Advanced Search & Filtering**: Filter by subject, year, exam type, part, and language
- 📄 **PDF Preview**: In-browser PDF viewing before download
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- 🌍 **Internationalization**: Switch between English and Tamil
- ♿ **Accessibility**: Screen reader support, keyboard navigation, ARIA labels

### For Administrators

- 🔐 **Secure Authentication**: Email/password and Google OAuth via Firebase
- 📝 **Smart Paper Management**:
  - Auto-title generation from filenames
  - Duplicate file detection
  - Unified Add/Edit interface
- 👥 **User Management**: Block/unblock users (High Admin only)
- ⚙️ **System Configuration**: 
  - Global filter options
  - Social media links
  - Donation settings
- 📊 **Analytics Dashboard**: Track uploads, contributions, and user activity

### Contribution System

- 💳 **Stripe Integration**: Secure payment processing
- ☕ **"Buy Me a Coffee"**: Support platform with customizable donation amounts
- 🧾 **PDF Receipts**: Auto-generated professional receipts
- 📈 **Donor Dashboard**: High Admins can view donation history and total raised

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS 4** for utility-first styling
- **Material UI** for consistent components
- **Framer Motion** for smooth animations
- **React Router 7** for client-side routing

### Backend & Infrastructure
- **Firebase**:
  - Authentication (Email/Password, Google OAuth)
  - Firestore (NoSQL database)
  - Storage (PDF file hosting)
- **Stripe** for payment processing
- **jsPDF** for receipt generation

### Developer Experience
- **TypeScript** for type safety
- **ESLint** for code quality
- **Vite** for hot module replacement
- **Clean Architecture** with separation of concerns

---

## 📁 Project Structure

```
MPPMS/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific components
│   │   ├── auth/           # Authentication UI
│   │   ├── hero/           # Landing page hero
│   │   ├── layout/         # Navigation, Footer
│   │   ├── papers/         # Paper management
│   │   ├── pages/          # Route pages
│   │   └── ui/             # Reusable UI primitives
│   ├── context/            # React Context providers
│   ├── lib/                # Business logic
│   │   ├── firebase/       # Firebase API abstractions
│   │   └── receipts.ts     # PDF receipt generator
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles & CSS variables
├── public/                 # Static assets
├── .env                    # Environment variables
├── firebase.json           # Firebase configuration
├── firestore.rules         # Security rules
├── package.json            # Dependencies
└── README.md              # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Firebase Project** (with Firestore, Auth, and Storage enabled)
- **Stripe Account** (for donation system)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mppms.git
   cd mppms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Admin Credentials
   ADMIN_EMAIL=admin@gmail.com
   ADMIN_PASSWORD=yourSecurePassword
   
   # Firebase Config
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Stripe (for donations)
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
   ```

4. **Set up Firestore security rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Public view: `http://localhost:5173`
   - Admin panel: `http://localhost:5173/admin`

---

## ⚙️ Configuration

### Firebase Setup

1. **Enable Authentication**:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Email/Password and Google providers

2. **Create Firestore Database**:
   - Collections: `papers`, `users`, `configs`, `contributions`

3. **Set up Firebase Storage**:
   - Create a bucket for PDF uploads
   - Configure CORS if needed

### Firestore Security Rules

Deploy the included `firestore.rules` file:
```bash
firebase deploy --only firestore:rules
```

Key rules:
- **Public read** on papers
- **Authenticated write** on papers (admin role required)
- **Admin-only** access to user management

---

## 🐳 Deployment

### Production Build

```bash
npm run build
```

Output will be in the `dist/` directory.

### Docker Deployment

```bash
# Build image
docker build -t mppms:latest .

# Run container
docker run -p 80:80 mppms:latest
```

### Firebase Hosting (Recommended)

```bash
npm run build
firebase deploy --only hosting
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Standards

- Follow existing code style (ESLint configured)
- Use TypeScript for type safety
- Add comments for complex logic
- Ensure accessibility (ARIA labels, semantic HTML)
- Test on multiple browsers

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for educational institutions
- Icons by [Material UI Icons](https://mui.com/material-ui/material-icons/)
- Styling by [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Firebase](https://firebase.google.com/) & [Stripe](https://stripe.com/)

---

## 📞 Support

For questions or support:
- 📧 Email: support@mppms.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/mppms/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/mppms/discussions)

---

**Made with 💙 by the MPPMS Team**
