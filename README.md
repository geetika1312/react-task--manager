# Task Manager App

A modern **Task Management Application** built with **React (v18+)**, designed to manage tasks efficiently with a clean and responsive UI.

---

## 🛠 Built With

- **React (v18+)** — Functional components with Hooks (`useState`, `useEffect`, `useContext`)
- **REST API Integration** — Axios for HTTP requests, handling loading and error states
- **State Management** — `useState` and `useContext` for global state
- **Styling** — Tailwind CSS for utility-first, responsive design
- **Routing** — React Router v6 with at least two routes:
  - Task List View
  - Task Detail / Edit View
- **Project Scaffolding** — Vite (preferred) for fast development
- **Additional Libraries**:
  - `@dnd-kit` for drag-and-drop functionality
  - `@radix-ui` components for accessible UI primitives
  - `react-query` for API state management
  - `framer-motion` for animations
  - `lucide-react` for icons

---

## ⚡ Features

- View a list of tasks
- Create, edit, and delete tasks
- Drag-and-drop tasks to reorder
- Loading and error states while fetching data
- Responsive design for desktop, tablet, and mobile
- Modular, reusable components

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/task-manager.git
cd task-manager

### 2. Install Dependencies

```bash
npm install

### 3. Start Development Server
npm run dev

Open your browser and navigate to http://localhost:5173
 (default Vite port).

### 4. Build for Production
npm run build

Preview the production build:

npm run preview

## 📁 Project Structure
src/
├─ components/        # Reusable React components (TaskList, TaskItem, Modals)
├─ hooks/             # Custom hooks (useTasks)
├─ pages/             # Pages for routing (Dashboard, TaskDetail)
├─ context/           # Context API setup for state management
├─ assets/            # Images and static assets
├─ App.jsx            # Main App component
├─ main.jsx           # Entry point
├─ index.css          # Tailwind CSS imports

## 💡 Improvements with More Time

Authentication & User Accounts — Add login/signup functionality

Backend Integration — Fully functional API for persistent task storage

Search & Filter — Search tasks by title or category

Dark Mode Toggle — Light/dark theme support

Notifications — Reminders for due tasks
