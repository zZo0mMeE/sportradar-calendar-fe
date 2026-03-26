# Sportradar Calendar Frontend

A React + TypeScript sports events calendar application built with Vite and Tailwind CSS.

## Features

- Display sports events in a calendar view
- View detailed event information
- Add new events during runtime
- Fully responsive design (mobile, tablet, desktop)
- Navigation between Calendar and Add Event pages

## Tech Stack

- **React** 19 with TypeScript
- **Vite** for fast development & builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **ESLint** for code quality

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Project Structure

```
src/
  ├── components/     # React components
  ├── pages/         # Page components
  ├── hooks/         # Custom hooks
  ├── types/         # TypeScript interfaces
  ├── constants/     # Constants (sports, etc)
  ├── utils/         # Utility functions
  ├── App.tsx        # Main app component
  ├── main.tsx       # Entry point
  └── index.css      # Global styles
```

## Development

The app uses a mock sports data JSON file for events. Modify `public/events.json` to adjust test data.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
