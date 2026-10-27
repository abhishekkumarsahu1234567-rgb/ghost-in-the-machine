# 👻 Ghost in the Machine

A local AI-powered ghost story generator that creates spooky stories using an open-weight language model running locally with Ollama.

## ✨ Features

- 👻 Generate spooky stories from user prompts
- 🖥️ Run AI inference locally using Ollama
- 🌑 Dark-themed interface with a ghost-inspired design
- ⚡ React and TypeScript frontend
- 🔌 Express API for story generation

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- Node.js
- Express
- Ollama
- Gemma 3 1B

## 📋 Prerequisites

Install the following before running the project:

- Node.js and npm
- Ollama
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abhishekkumarsahu1234567-rgb/ghost-in-the-machine.git
cd ghost-in-the-machine
```

### 2. Download the AI model

Install Ollama from https://ollama.com and run:

```bash
ollama pull gemma3:1b
```

### 3. Start the backend

```bash
cd backend
npm install
```

Start Ollama separately, then run the backend using the start command configured in `backend/package.json`.

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🌐 Live Demo

Try Ghost in the Machine here:

**[Launch Live Demo 👻](https://frontend-puce-chi-10.vercel.app)**

**GitHub Repository:** https://github.com/abhishekkumarsahu1234567-rgb/ghost-in-the-machine

## 🔒 Privacy

The project is designed to use a locally running language model. Actual privacy depends on the application configuration and any external services used.

## 🎯 Project Goal

Explore local AI inference and build a creative, interactive storytelling experience.

## 👨‍💻 Author

Abhishek Kumar Sahu

---

Built with curiosity and a little bit of fear. 👻
