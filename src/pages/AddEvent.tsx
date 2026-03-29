import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import type { SportEvent, Team, Stage, Result } from '../types/event';
import './AddEvent.css';

interface AddEventFormData {
  date: string;
  time: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  stadium: string;
  stageId: string;
  stageName: string;
  status: string;
  homeGoals: number;
  awayGoals: number;
  winner: string;
  group: string;
}

const buildTeam = (name: string): Team => ({
  name,
  officialName: name,
  slug: name.toLowerCase().replace(/\s/g, '-'),
  abbreviation: name.slice(0, 3).toUpperCase(),
  teamCountryCode: '',
  stagePosition: null,
});

const emptyResult: Result = {
  homeGoals: 0,
  awayGoals: 0,
  winner: null,
  message: null,
  goals: [],
  yellowCards: [],
  secondYellowCards: [],
  directRedCards: [],
};

export const AddEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();

  const [formData, setFormData] = useState<AddEventFormData>({
    date: '',
    time: '',
    sport: '',
    homeTeam: '',
    awayTeam: '',
    competition: '',
    stadium: '',
    stageId: 'REGULAR',
    stageName: 'Regular Season',
    status: 'scheduled',
    homeGoals: 0,
    awayGoals: 0,
    winner: '',
    group: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.sport) newErrors.sport = 'Sport is required';
    if (!formData.awayTeam) newErrors.awayTeam = 'Away team is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const homeTeam = formData.homeTeam ? buildTeam(formData.homeTeam) : null;
    const awayTeam = buildTeam(formData.awayTeam);

    const stage: Stage = {
      id: formData.stageId,
      name: formData.stageName,
      ordering: 1,
    };

    const result = formData.status !== 'scheduled'
      ? { ...emptyResult, homeGoals: formData.homeGoals, awayGoals: formData.awayGoals, winner: formData.winner || null }
      : null;

    const newEvent: Omit<SportEvent, 'id'> = {
      season: new Date(formData.date).getFullYear(),
      status: formData.status,
      timeVenueUTC: `${formData.time}:00`,
      dateVenue: formData.date,
      stadium: formData.stadium || null,
      homeTeam,
      awayTeam,
      result,
      stage,
      group: formData.group || null,
      originCompetitionId: formData.competition
        ? formData.competition.toLowerCase().replace(/\s/g, '-')
        : 'custom',
      originCompetitionName: formData.competition || 'Custom Event',
      sport: formData.sport,
    };

    addEvent(newEvent);
    navigate('/');
  };

  return (
    <div className="add-event-page">
      <div className="form-toolbar">
        <Link to="/" className="back-link">← Back to Calendar</Link>
      </div>
      <h1 className="page-heading">Add New Event</h1>
      <form onSubmit={handleSubmit}>
        <section className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="field-grid">
            <div>
              <label>Date *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="field-input" />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>
            <div>
              <label>Time *</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="field-input" />
              {errors.time && <span className="error-text">{errors.time}</span>}
            </div>
            <div>
              <label>Sport *</label>
              <input type="text" name="sport" placeholder="e.g., Football" value={formData.sport} onChange={handleChange} className="field-input" />
              {errors.sport && <span className="error-text">{errors.sport}</span>}
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="field-input">
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2 className="section-title">Teams</h2>
          <div className="field-grid">
            <div>
              <label>Home Team (optional)</label>
              <input type="text" name="homeTeam" placeholder="Home team name" value={formData.homeTeam} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label>Away Team *</label>
              <input type="text" name="awayTeam" placeholder="Away team name" value={formData.awayTeam} onChange={handleChange} className="field-input" />
              {errors.awayTeam && <span className="error-text">{errors.awayTeam}</span>}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2 className="section-title">Event Details</h2>
          <div className="field-grid">
            <div><label>Competition</label><input type="text" name="competition" value={formData.competition} onChange={handleChange} className="field-input" /></div>
            <div><label>Stadium</label><input type="text" name="stadium" value={formData.stadium} onChange={handleChange} className="field-input" /></div>
            <div><label>Stage ID</label><input type="text" name="stageId" value={formData.stageId} onChange={handleChange} className="field-input" /></div>
            <div><label>Stage Name</label><input type="text" name="stageName" value={formData.stageName} onChange={handleChange} className="field-input" /></div>
            <div><label>Group (optional)</label><input type="text" name="group" value={formData.group} onChange={handleChange} className="field-input" /></div>
          </div>
        </section>

        {formData.status !== 'scheduled' && (
          <section className="form-section">
            <h2 className="section-title">Result</h2>
            <div className="field-grid md:grid-cols-3">
              <div><label>Home Goals</label><input type="number" name="homeGoals" value={formData.homeGoals} onChange={handleChange} className="field-input" /></div>
              <div><label>Away Goals</label><input type="number" name="awayGoals" value={formData.awayGoals} onChange={handleChange} className="field-input" /></div>
              <div><label>Winner (optional)</label><input type="text" name="winner" placeholder="Winning team name" value={formData.winner} onChange={handleChange} className="field-input" /></div>
            </div>
          </section>
        )}

        <button type="submit" className="submit-button">
          Add Event
        </button>
      </form>
    </div>
  );
};