# MathScribe Frontend

## The Smart Mathematical Expression Solver

🚀 **About the Project**

MathScribe is an intelligent, real-time mathematical expression solver. Built using modern web technologies, it allows users to draw equations on a digital canvas, which are then identified, interpreted, and solved instantly. The app offers an intuitive user interface with additional features like customizable brushes and board colors, ensuring a seamless and interactive experience for students, professionals, and educators.

🌐 [Live Demo: MathScribe Frontend](https://mathscribe-fe.vercel.app/)

🔗 [Backend Repository: MathScribe Backend](https://github.com/sharad-mishra/mathscribe-be)

## ✨ Key Features

- **Real-time Math Solver**: Draw mathematical expressions, and MathScribe processes them instantly.
- **Customizable Tools**: Change brush colors and board themes for a personalized experience.
- **Responsive Design**: Fully functional across devices (desktop, tablet, mobile).
- **Gemini API Integration**: Utilizes cutting-edge AI technology for accurate equation recognition and solving.

## 📂 Project Structure

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
```

## 🛠️ Technologies Used

### Frontend:
- **React (TypeScript)**: Component-based architecture for building the UI.
- **Vite**: Lightning-fast development environment.
- **Tailwind CSS**: Modern utility-first CSS framework.
- **Axios**: For API communication with the backend.

### Backend:
- **FastAPI**: Python framework used for backend services.
- [Find the backend repo here: MathScribe Backend](https://github.com/sharad-mishra/mathscribe-be)

### API Integration:
- **Google Gemini API**: For processing and solving handwritten equations.

## 🖥️ Getting Started

### Prerequisites:
- Node.js (v16+)
- Yarn or npm

### Installation:

1. Clone the repository:
```bash
git clone https://github.com/sharad-mishra/mathscribe-fe.git
cd mathscribe-fe
```

2. Install dependencies:
```bash
npm install
```

3. Set up the `.env` file: Create a `.env` file in the root directory and configure the following:
```javascript
VITE_API_URL=<Your Backend API URL>
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and navigate to http://localhost:3000.

## 🖌️ Customization

### Brush and Board Colors:
Navigate to the drawing board and use the UI options to switch between various brush and board themes.

### Math Expression Solver:
Draw any mathematical expression directly on the board. The backend processes the drawing using the Gemini API and returns the result in real-time.

## 🚀 Deployment

The project is already deployed via Vercel.

For deployment:

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy the project:
```bash
vercel
```

Follow the CLI prompts to complete the deployment.

## 🤝 Contributing

Contributions are what make the open-source community such a fantastic place to learn, inspire, and create. Any contributions you make are greatly appreciated!

1. Fork the project.
2. Create a branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.


## 🎉 Acknowledgements

- Google Gemini API for their advanced math-recognition capabilities.
- Vercel for seamless deployment.
- All contributors to this project! 💙
