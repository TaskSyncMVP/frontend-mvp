# 🍅 TaskSync - Modern Task Management & Pomodoro Timer

<div align="center">

![TaskSync Logo](public/vase.svg)

**A beautiful, modern task management application with integrated Pomodoro timer built with Next.js 15 and Feature-Sliced Design architecture.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Feature-Sliced Design](https://img.shields.io/badge/Feature--Sliced-Design-F2F2F2?style=for-the-badge&logo=feature-sliced-design&logoColor=262224)](https://feature-sliced.design/)

</div>

---

## ✨ Features

### 🎯 **Task Management**
- ✅ Create, edit, and delete tasks with priority levels
- 📅 Calendar-based task organization
- 🏷️ Priority filtering (High, Medium, Low)
- 📊 Task completion tracking and statistics
- 🗓️ Daily, weekly, and custom date views

### 🍅 **Pomodoro Timer**
- ⏰ Customizable work/break intervals
- 🔄 Visual progress tracking with circular timer
- 📊 Session progress indicators
- 🎵 Audio notifications for session transitions
- ⚙️ Personalized timer settings
- 📱 Mobile-optimized controls

### 🎨 **User Experience**
- 📱 Fully responsive design (Mobile-first)
- 🌙 Beautiful, modern UI with smooth animations
- ⚡ Lightning-fast performance with React Query caching
- 🔄 Real-time data synchronization
- 💾 Offline-ready with smart caching
- 🎭 Loading skeletons for better UX

### 🔐 **Authentication & Security**
- 🔑 JWT-based authentication
- 🍪 Secure cookie management
- 🔄 Automatic token refresh
- 👤 User profile management
- 🛡️ Protected routes and API endpoints

---

## 🏗️ Architecture

This project follows **Feature-Sliced Design (FSD)** methodology for scalable and maintainable architecture:

```
src/
├── 📱 app/                 # Next.js App Router
├── 📄 pages/               # Page components
├── 🧩 widgets/             # Composite UI blocks
├── ⚡ features/            # Business logic features
├── 🏢 entities/            # Business entities
└── 🔧 shared/              # Reusable resources
    ├── ui/                 # UI components
    ├── lib/                # Utilities
    ├── api/                # API client
    └── constants/          # App constants
```

### 🎯 **Key Architectural Principles**
- **Unidirectional imports**: Lower layers can't import from higher layers
- **Feature isolation**: Each feature is self-contained
- **Shared resources**: Common utilities and components
- **Type safety**: Full TypeScript coverage

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **pnpm** (recommended)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HollyGooffy/task-sync-frontend-mvp.git
   cd task-sync-frontend-mvp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```


## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### **State Management & Data Fetching**
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Client state management

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Vitest](https://vitest.dev/)** - Testing framework

### **Build & Deployment**
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Turbopack](https://turbo.build/pack)** - Fast bundler
- **[PostCSS](https://postcss.org/)** - CSS processing

---

## 📚 Project Structure

```
📦 TaskSync Frontend
├── 📱 src/app/                    # Next.js App Router
│   ├── (auth)/                    # Authentication pages
│   ├── (protected)/               # Protected pages
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── 🧩 src/widgets/                # Composite UI blocks
│   ├── navbar/                    # Navigation bar
│   └── pageHeader/                # Page header
├── ⚡ src/features/               # Business logic features
│   ├── auth/                      # Authentication
│   ├── tasks/                     # Task management
│   ├── pomodoro/                  # Pomodoro timer
│   └── settings/                  # User settings
├── 🏢 src/entities/               # Business entities
│   ├── user/                      # User entity
│   ├── task/                      # Task entity
│   └── pomodoro/                  # Pomodoro entity
├── 🔧 src/shared/                 # Shared resources
│   ├── ui/                        # UI components
│   ├── lib/                       # Utilities
│   ├── api/                       # API client
│   └── constants/                 # Constants
└── 📄 src/screens/                # Page components
    ├── home/                      # Home screen
    ├── tasks/                     # Tasks screen
    ├── pomodoro/                  # Pomodoro screen
    └── settings/                  # Settings screen
```

---

## 🎨 Design System

### **Colors**
- **Primary**: Pink gradient (`#F478B8`)
- **Secondary**: Green accent (`#78F4B8`)
- **Background**: Clean whites and grays
- **Text**: Semantic color hierarchy

### **Typography**
- **Font**: Nunito (Primary), System fonts (Fallback)
- **Scales**: Responsive typography with Tailwind CSS

### **Components**
- **Buttons**: Multiple variants with hover states
- **Forms**: Consistent input styling with validation
- **Cards**: Elevated surfaces with subtle shadows
- **Modals**: Overlay components with backdrop blur

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm type-check

# Linting
pnpm lint

# Linting with auto-fix
pnpm lint:fix
```

---

## 📦 Build & Deployment

### **Development**
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript checking
```

### **Production Deployment**

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Deploy to Vercel** (Recommended)
   ```bash
   vercel --prod
   ```

3. **Or deploy to any Node.js hosting**
   ```bash
   pnpm start
   ```

### **Environment Variables**
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.tasksync.com
NEXT_PUBLIC_APP_URL=https://tasksync.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

### **Development Workflow**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   pnpm lint && pnpm type-check && pnpm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### **Commit Convention**
We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

---

## 🙏 Acknowledgments

- **[Feature-Sliced Design](https://feature-sliced.design/)** - For the amazing architecture methodology
- **[Radix UI](https://www.radix-ui.com/)** - For accessible UI primitives
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Lucide](https://lucide.dev/)** - For beautiful icons
- **[Vercel](https://vercel.com/)** - For seamless deployment

---

<div align="center">

**Made with ❤️ by the TaskSync Team**

[⭐ Star this repo](https://github.com/HollyGooffy/task-sync-frontend-mvp) • [🍴 Fork it](https://github.com/HollyGooffy/task-sync-frontend-mvp/fork) • [📢 Share it](https://twitter.com/intent/tweet?text=Check%20out%20TaskSync%20-%20Modern%20Task%20Management%20%26%20Pomodoro%20Timer&url=https://github.com/HollyGooffy/task-sync-frontend-mvp)

</div>