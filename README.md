# **MathScribe Frontend**

_The Smart Mathematical Expression Solver_

---

## 🚀 **About the Project**

MathScribe is an intelligent, real-time **mathematical expression solver**. Built using modern web technologies, it allows users to draw equations on a digital canvas, which are then identified, interpreted, and solved instantly. The app offers an intuitive user interface with additional features like customizable brushes and board colors, ensuring a seamless and interactive experience for students, professionals, and educators.

🌐 **Live Demo**: [MathScribe Frontend](https://mathscribe-fe.vercel.com)  
🔗 **Backend Repository**: [MathScribe Backend](https://github.com/sharad-mishra/mathscribe-be)

---

## ✨ **Key Features**

- **Real-time Math Solver**: Draw mathematical expressions, and MathScribe processes them instantly.  
- **Customizable Tools**: Change brush colors and board themes for a personalized experience.  
- **Responsive Design**: Fully functional across devices (desktop, tablet, mobile).  
- **Gemini API Integration**: Utilizes cutting-edge AI technology for accurate equation recognition and solving.

---

## 📂 **Project Structure**

```bash
calc-fe/
├── public/                     # Static files served directly by Vite
│   ├── favicon.ico
│   └── index.html
├── src/                        # Core application code
│   ├── api/                    # API integration logic
│   │   └── calculate.ts
│   ├── assets/                 # Static assets (images, fonts, etc.)
│   ├── components/             # React components
│   │   └── ui/                 # UI-specific components
│   │       └── calculator.tsx
│   ├── App.css                 # Global application styles
│   ├── App.tsx                 # Root React component
│   ├── index.css               # Global base CSS
│   ├── index.tsx               # App entry point
│   └── vite-env.d.ts           # Type definitions for Vite
├── .env                        # Environment variables (e.g., API keys)
├── .eslintrc.json              # ESLint configuration
├── package.json                # Dependencies and project scripts
├── tailwind.config.js          # Tailwind CSS configuration
└── vite.config.ts              # Vite bundler configuration


## 🛠️ Technologies Used

### Frontend:
- **React (TypeScript)**: Component-based architecture for building the UI.  
- **Vite**: Lightning-fast development environment.  
- **Tailwind CSS**: Modern utility-first CSS framework.  
- **Axios**: For API communication with the backend.

### Backend:
- **FastAPI**: Python framework used for backend services.  
  > Find the backend repo here: [MathScribe Backend](https://github.com/sharad-mishra/mathscribe-be)

### API Integration:
- **Google Gemini API**: For processing and solving handwritten equations.

---

## 🖥️ Getting Started

### **Prerequisites:**
Ensure you have the following installed:
- **Node.js (v16+)**  
- **Yarn or npm**

### **Installation:**

1. **Clone the reposi
