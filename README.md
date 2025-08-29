# 🧠 TrailMixer – AI-Powered Video Trailer Generator

[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116+-green.svg)](https://fastapi.tiangolo.com)

> **Transform raw footage into attention-grabbing trailers in seconds using AI content analysis and automated music synchronization.**
>
> **Frontend Repository**: This repository contains the Next.js frontend application for TrailMixer.

---

## 🚀 Inspiration

In today's fast-paced creator economy, standing out requires speed. Content creators need tools to quickly transform raw footage into polished, impactful videos. **TrailMixer** was built to solve this problem by creating an AI-assisted video editor that analyzes, cuts, and synchronizes your footage with music to produce professional-quality trailers in seconds.

---

## 🎬 What It Does

TrailMixer allows users to:

-   **Upload raw videos** (single or multiple files)
-   **Select trailer duration** (customizable)
-   **Pick a music style** (Pop, Classical, Hip Hop, Electronic, Meme, Cinematic)
-   **AI-powered clip analysis** to detect the most engaging moments
-   **Automated stitching** into a polished trailer with synced background music
-   **Sentiment-based mood matching** for perfect audio-visual alignment

---

## 🛠️ How We Built It

### Frontend Tech Stack

**Modern Web Technologies:**

-   **Next.js 14** - React framework with App Router
-   **React 18** - Modern React with hooks and concurrent features
-   **TypeScript** - Type-safe development
-   **Tailwind CSS** - Utility-first CSS framework
-   **shadcn/ui** - Beautiful, accessible component library

**Key Features:**

-   Responsive design for all devices
-   Modern UI/UX with smooth animations
-   File upload with drag & drop
-   Real-time progress tracking
-   Mobile-first approach

### Backend Overview

**Core Technologies:**

-   **Python 3.8+** with **FastAPI** for the REST API
-   **FFmpeg** for video/audio processing
-   **TwelveLabs API** for AI-powered video analysis

**AI Capabilities:**

-   Multimodal video understanding
-   Sentiment-based highlight detection
-   Intelligent clip selection and ranking

---

## 🏗️ Project Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI        │    │   TwelveLabs    │
│   (Next.js)     │◄──►│   Backend        │◄──►│   AI Analysis   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   FFmpeg         │
                       │   Processing     │
                       └──────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Final Trailer  │
                       │   (MP4)          │
                       └──────────────────┘
```

---

## 📁 Frontend Project Structure

```
Trailmixer-frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── trailer/                  # Trailer generation page
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── favicon.ico
├── components/                    # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── uploader.tsx              # File upload component
│   ├── clipblock.tsx             # Video clip display
│   ├── orderlist.tsx             # Clip ordering interface
│   └── loading.tsx               # Loading states
├── lib/                          # Utility functions
│   └── utils.ts
├── public/                       # Static assets
│   └── landing/                  # Landing page assets
├── package.json                  # Dependencies
└── README.md
```

---

## 🚀 Frontend Development

### Prerequisites

-   **Node.js 18+**
-   **npm** or **yarn**

### Installation & Setup

```bash
# Clone the frontend repository
git clone https://github.com/prestonty/Trailmixer-frontend.git
cd Trailmixer-frontend

# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🧩 Frontend Features

### 1. **Modern User Interface**

-   Clean, intuitive design using shadcn/ui components
-   Responsive layout that works on desktop, tablet, and mobile
-   Smooth animations and transitions throughout the app

### 2. **File Upload System**

-   Drag & drop file upload for easy video selection
-   Support for multiple video formats (MP4 and MOV)
-   Progress indicators and error handling for better user experience

### 3. **Video Processing Interface**

-   Real-time status updates during processing
-   Clip preview and ordering capabilities
-   Edit Audio duration and timestamp during customization

### 4. **Responsive Design**

-   Mobile-first approach for better mobile experience
-   Touch-friendly interactions on all devices
-   Adaptive layouts that work on all screen sizes

---

## 🔧 Backend API Integration

The frontend communicates with the Python FastAPI backend through these endpoints:

| Endpoint                         | Method | Description               |
| -------------------------------- | ------ | ------------------------- |
| `/api/video/upload`              | POST   | Upload videos and analyze |
| `/api/video/process/{job_id}`    | POST   | Process trailer           |
| `/api/video/timestamps/{job_id}` | GET    | Get timestamps            |
| `/api/video/status/{job_id}`     | GET    | Job status                |
| `/api/video/download/{job_id}`   | GET    | Download trailer          |

---

## 🎨 UI/UX Design Principles

-   **Simplicity**: Clean, uncluttered interface
-   **Accessibility**: WCAG compliant components
-   **Performance**: Fast loading and smooth interactions
-   **Mobile-First**: Responsive design for all devices
-   **User Feedback**: Clear progress indicators and status updates

---

## 🧩 Development Challenges & Solutions

### Frontend Challenges

-   **File Upload**: Large video file handling was solved by implementing chunked uploads
-   **Real-time Updates**: Processing status updates were handled with a WebSocket-like polling system
-   **Responsive Design**: Mobile optimization was achieved through a mobile-first CSS approach

### Backend Integration

-   **API Communication**: RESTful integration with FastAPI backend
-   **Error Handling**: Graceful fallbacks when API calls fail
-   **State Management**: Efficient client-side state handling for better performance

---

## ✅ Accomplishments

-   **Modern Frontend**: Successfully built with Next.js 14 and React 18
-   **Responsive Design**: Implemented mobile-first approach using Tailwind CSS
-   **Component Library**: Created reusable UI components with shadcn/ui
-   **Seamless Integration**: Achieved smooth communication with the AI backend
-   **Professional UI/UX**: Delivered a polished, production-ready interface

---

## 📚 What We Learned

-   **Next.js 14**: Mastered App Router and modern React patterns
-   **TypeScript**: Developed strong type-safe development practices
-   **shadcn/ui**: Learned how to build accessible component libraries
-   **API Integration**: Gained experience with RESTful communication patterns
-   **Responsive Design**: Implemented mobile-first development approach

---

## 🌱 What's Next

### Frontend Enhancements

-   **Advanced UI**: More animations, transitions, and loading indicators for better user experience
-   **Advanced Video Controls**: Timeline editing and preview functionality

### Backend Integration

-   **Enhanced Error Handling**: Improved error messages and user guidance
-   **Performance Optimization**: Faster video processing for better user experience

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

-   Follow TypeScript best practices for better code quality
-   Use shadcn/ui components when possible for consistency
-   Ensure mobile responsiveness in all new features
-   Write clean, maintainable code that's easy to understand

---

## 📄 License

Licensed under the **MIT License** – see [LICENSE](LICENSE).

---

**Made with ❤️ by the TrailMixer Team**  
_Transform your content creation workflow with AI-powered video editing._

---

## 🔗 Related Repositories

-   **Backend**: [TrailMixer Backend](https://github.com/xrhuang10/trailmixer) - Python FastAPI backend with AI processing
-   **Frontend**: [TrailMixer Frontend](https://github.com/prestonty/Trailmixer-frontend) - Next.js frontend application (this repo)
