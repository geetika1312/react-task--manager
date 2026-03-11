Task Manager Application
📌 Overview

The Task Manager Application is a modern web application designed to help users efficiently organize and manage their tasks. The app provides a clean and intuitive interface where users can create, update, and manage tasks while maintaining productivity.

The project focuses on building a fast, responsive, and user-friendly task management system using modern frontend technologies.

This application was built using React with Vite for fast development and Tailwind CSS for styling, along with several modern libraries for UI components, form handling, and drag-and-drop functionality.

🚀 Features
Task Management

Create new tasks

Edit existing tasks

Delete tasks

Organize tasks efficiently

Drag and Drop

Rearrange tasks using drag-and-drop functionality

Smooth task movement using DnD Kit

Responsive UI

Fully responsive layout

Works across desktop, tablet, and mobile devices

Modern UI Components

Accessible UI components powered by Radix UI

Smooth animations and transitions

Form Handling

Efficient form validation using React Hook Form

Schema validation with Zod

Performance

Fast development and build process using Vite

Optimized rendering with React

🛠️ Tech Stack
Frontend

React

TypeScript

Vite

Tailwind CSS

Libraries

DnD Kit – Drag and drop functionality

React Hook Form – Form management

Zod – Schema validation

TanStack React Query – Data fetching and caching

Radix UI – Accessible UI components

Axios – API requests

Framer Motion – Animations

📂 Project Structure
task-manager
│
├── src
│   ├── components        # Reusable UI components
│   ├── pages             # Application pages
│   ├── hooks             # Custom React hooks
│   ├── lib               # Utility functions
│   ├── assets            # Images and static assets
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
│
├── public                # Static public files
├── index.html
├── package.json
├── vite.config.ts
└── README.md
⚙️ Running the Project Locally
1. Clone the repository
git clone https://github.com/your-username/task-manager.git
2. Navigate to the project folder
cd task-manager
3. Install dependencies

If you are using pnpm:

pnpm install

Or with npm:

npm install
4. Start the development server
pnpm run dev

or

npm run dev
5. Open the application

Visit:

http://localhost:5173
🏗️ Build for Production

To create a production build:

pnpm run build

Preview production build:

pnpm run preview
🔮 What I Would Improve With More Time

If more development time were available, several improvements could enhance the application:

1. User Authentication

Implement login and signup functionality

Allow users to manage their personal task boards

2. Backend Integration

Add a backend (Node.js / Express / Firebase)

Store tasks in a database

Enable persistent task storage

3. Task Categories and Labels

Add task categories

Allow filtering tasks by status or label

4. Deadlines and Notifications

Add due dates for tasks

Implement reminders and notifications

5. Collaboration Features

Allow multiple users to collaborate on tasks

Real-time updates for team productivity

6. Dark / Light Theme Toggle

Allow users to switch between themes
