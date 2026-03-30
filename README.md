# Sportradar Coding Academy - Calendar Frontend Application

Sports events calendar application - internship coding exercise for Sportradar.

## Overview

Single-page calendar app to view and manage sports events. Browse events by month, view details, add new events.

**Stack**: React 19, TypeScript, Vite, Tailwind, React Router, Context API

## Requirements Completed

- Calendar view with event indicators
- Event details page
- Add event form
- Responsive design (mobile & desktop)
- Navigation between pages

## Additional Features

- Month jump selector to navigate to events quickly
- Event editing (modify date, score, teams, etc.)
- Sport-specific fields: Football matches include half-time score tracking, yellow/red cards tracking
- Advanced form validation:
  - Teams must be different, required field checks
  - Winner field: auto-calculated based on goals (if home > away → home team wins), user can override
  - Score validation: half-time totals must match final score for football
  - Format validation: country codes, team slugs, abbreviations follow patterns
  - Status-aware: different rules for scheduled vs. finished vs. live events
- Loading & error states
- Responsive mobile-first design

## Setup & Running

```bash
npm install
npm run dev          # Development (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Run ESLint
```

## Usage

1. **Calendar**: View current month, blue dots show event dates
2. **Click event**: View full match details
3. **Edit match**: Modify event on details page
4. **Add Event**: Use top navigation to add new events
5. **Navigate**: Previous/Next/Today buttons or Jump to Month selector

## Project Structure

```
src/
├── pages/          (CalendarPage, AddEvent)
├── components/     (CalendarGrid, CalendarHeader, EventDetails, Navigation)
├── context/        (EventsContext)
├── hooks/          (useEvents)
├── types/          (event.ts)
└── utils/          (dateUtils)
```

## Notes

- Data is session-based (resets on reload, as per requirements)
- Events loaded from `public/events.json` - created based on 'DATA. JSON file.pdf' structure from assignment (see DATA.JSON file.pdf in root for reference)
- The original data included sport-specific fields (e.g., yellow/red cards for football) which informed the form structure
- Form validates: required fields, team format, score consistency, status-aware rules
- Football events support additional fields: half-time scores, card tracking
- Responsive: works on mobile, tablet, desktop
