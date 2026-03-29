import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import { EventDetails } from './components/EventDetails';
import { AddEvent } from './pages/AddEvent';
import { EventsProvider } from './context/EventsContext';

function App() {
  return (
    <BrowserRouter>
      <EventsProvider>
        <div className="min-h-screen bg-gray-100">
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<CalendarPage />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/add-event" element={<AddEvent />} />
            </Routes>
          </main>
        </div>
      </EventsProvider>
    </BrowserRouter>
  );
}

export default App;