# Centsi - AI Finance Coach for Students

"Duolingo for Personal Finance" - A voice-first AI financial coach with gamification specifically designed for students with irregular income and tight budgets.

## Features

- **Voice-First AI Assistant**: Push-to-talk interface with Azure Speech Services and OpenAI GPT-4
- **Gamification System**: XP points, levels, badges, streaks, and animations
- **Smart Goals & Progress**: Visual thermometer progress bars and savings goals
- **Personalized Onboarding**: Profile customization based on student type
- **Advanced AI Capabilities**: Proactive insights and purchase decision support

## Tech Stack

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express
- **AI**: Azure OpenAI (GPT-4) + Azure Speech Services
- **Database**: Simulated for hackathon (would use MongoDB in production)

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Azure account with OpenAI and Speech Services set up (for full functionality)

### Installation

1. Clone the repository
```
git clone https://github.com/your-username/centisi-app.git
cd centisi-app
```

2. Install dependencies
```
npm run install:all
```

3. Set up environment variables
```
cp server/.env.example server/.env
```
Then edit the `.env` file with your Azure API keys and other configuration.

4. Run the application
```
npm start
```

This will start both the React frontend and Node.js backend concurrently.

## Demo User Personas

- **High School Student**: Basic savings habits, parental integration
- **College Student (Dorms)**: Social spending awareness, meal plan optimization
- **Working Student**: Balancing work income with expenses
- **Graduate Student**: Stretching limited stipend, research budgets

## Project Structure

- `client/`: React frontend application
- `server/`: Node.js backend API
- `server/routes/`: API endpoint definitions

## Features to Implement

- [x] Basic project structure
- [ ] Voice interface with Azure Speech Services
- [ ] OpenAI integration for financial advice
- [ ] Gamification system with points and badges
- [ ] Progress tracking with visual thermometers
- [ ] Personalized onboarding flow
- [ ] Demo data for testing

## Hackathon Development Timeline

- Set up project structure (1 hour)
- Implement basic UI components (4 hours)
- Add voice interface (3 hours)
- Integrate OpenAI for financial advice (3 hours)
- Develop gamification system (4 hours)
- Create goal tracking (3 hours)
- Personalize user experience (3 hours)
- Testing and bug fixes (3 hours)

## License

MIT

## Acknowledgments

- Azure for AI services
- React and Node.js communities