import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import { EventDetails } from './components/EventDetails';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;