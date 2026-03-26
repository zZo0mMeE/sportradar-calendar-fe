import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App;