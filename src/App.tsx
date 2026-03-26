import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Calendar Page - Coming Soon</div>} />
        <Route path="/event/:id" element={<div>Event Details - Coming Soon</div>} />
        <Route path="/add-event" element={<div>Add Event - Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;