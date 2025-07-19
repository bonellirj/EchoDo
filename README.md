# EchoDo - Voice Task Creator

A mobile web application that allows users to create tasks using voice input. Built with React, TypeScript, and modern web technologies.

## 🚀 Features

- **Voice Input**: Create tasks by speaking using the Web Speech API
- **Smart Date Parsing**: Automatically extract dates from voice commands
- **Mobile-First Design**: Optimized for mobile devices with bottom navigation
- **Multi-language Support**: Available in English, Portuguese, Spanish, and French
- **Local Storage**: Tasks are stored locally in the browser
- **Responsive UI**: Clean, modern interface with smooth animations

## 🛠 Tech Stack

- **Frontend**: React 19.1.0 + TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 7.6.2
- **State Management**: Zustand 5.0.5
- **Internationalization**: i18next 25.2.1
- **Animations**: Framer Motion 12.16.0
- **UI Components**: Radix UI primitives

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── BottomNavigation.tsx
│   └── VoiceButton.tsx
├── pages/              # Page components
│   ├── HomePage.tsx    # Task list view
│   ├── CalendarPage.tsx
│   └── SettingsPage.tsx
├── routes/             # Routing configuration
│   └── index.tsx
├── services/           # Business logic and API abstraction
│   ├── taskService.ts  # Task management
│   └── voiceService.ts # Voice recognition
├── hooks/              # Custom React hooks
│   ├── useTasks.ts
│   └── useVoiceRecognition.ts
├── lib/                # Utilities and helpers
│   ├── logger.ts       # Logging system
│   └── utils.ts        # Common utilities
├── types/              # TypeScript type definitions
│   ├── index.ts
│   └── speech.d.ts
├── config/             # Configuration constants
│   └── constants.ts
└── i18n/               # Internationalization
    ├── index.ts
    └── locales/
        ├── en.json
        ├── pt.json
        ├── pt-BR.json
        ├── es.json
        └── fr.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EchoDo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🎯 Usage

1. **Create Tasks**: Tap the microphone button and speak your task
2. **Example Commands**:
   - "Remind me to call John December 1st at 3pm"
   - "Buy groceries on December 15th"
   - "Finish project by December 18th at 2pm"
   - "Call mom tomorrow at 7pm"

3. **Navigate**: Use the bottom navigation to switch between:
   - **Tasks**: View and manage your task list
   - **Calendar**: See tasks organized by date
   - **Settings**: Configure app preferences

## 🏗 Architecture

### Modular Design
- **Separation of Concerns**: UI components, business logic, and data access are clearly separated
- **Service Layer**: All data operations go through service abstractions for easy testing and future API integration
- **Type Safety**: Full TypeScript coverage for better developer experience

### Extensible Structure
- **Plugin Architecture**: Easy to add new features and integrations
- **API-Ready**: Services are designed to easily swap localStorage for external APIs
- **Internationalization**: Built-in support for multiple languages

### Mobile-First
- **Responsive Design**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **PWA-Ready**: Progressive Web App capabilities

## 🔧 Development

### Code Style
- ESLint configuration for code quality
- TypeScript for type safety
- Prettier for code formatting

### Testing
- Unit tests for services and utilities
- Component testing with React Testing Library
- E2E testing with Playwright (planned)

### Performance
- Lazy loading for pages and components
- Optimized bundle size with Vite
- Efficient state management with Zustand

## 📱 Browser Support

- Chrome/Edge (recommended for voice recognition)
- Firefox
- Safari (limited voice recognition support)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Web Speech API for voice recognition capabilities
- Tailwind CSS for the utility-first styling approach
- React community for the excellent ecosystem
