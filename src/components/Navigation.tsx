import { NavLink } from 'react-router-dom';

export const Navigation = () => (
  <header className="app-header">
    <div className="app-header__brand">Sports Calendar</div>
    <nav className="app-header__nav">
      <NavLink to="/" className={({ isActive }) => isActive ? 'app-link app-link--active' : 'app-link'}>
        Calendar
      </NavLink>
      <NavLink to="/add-event" className={({ isActive }) => isActive ? 'app-link app-link--active' : 'app-link'}>
        Add Event
      </NavLink>
    </nav>
  </header>
);
