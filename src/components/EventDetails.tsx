import { useParams, Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import './EventDetails.css';

export const EventDetails = () => {
  const { id } = useParams();
  const { getEventById } = useEvents();
  const event = getEventById(id || '');

  if (!event) {
    return (
      <div className="event-not-found">
        <h2>Event not found</h2>
        <Link to="/">Back to Calendar</Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };

  const formatTime = (timeStr: string) => timeStr.slice(0, 5);

  const getTeamsDisplay = () => {
    if (event.homeTeam) {
      return `${event.homeTeam.name} vs ${event.awayTeam.name}`;
    }
    return event.awayTeam.name;
  };

  return (
    <div className="event-detail-page">
      <Link to="/" className="back-link">← Back to Calendar</Link>

      <div className="event-card">
        <div className="event-header">
          <div className="flex justify-between items-center">
            <span className="event-sport">{event.sport}</span>
            <span className="event-status">{event.status}</span>
          </div>
          <h1 className="event-title">{getTeamsDisplay()}</h1>
        </div>

        <div className="event-details-body">
          <div className="info-section">
            <div>
              <p className="info-label">Date</p>
              <p className="info-value">{formatDate(event.dateVenue)}</p>
            </div>
            <div>
              <p className="info-label">Time (UTC)</p>
              <p className="info-value">{formatTime(event.timeVenueUTC)}</p>
            </div>
          </div>

          {event.homeTeam && (
            <div className="teams-grid">
              <div>
                <p className="info-label">Home Team</p>
                <div className="team-card">
                  <p className="team-name">{event.homeTeam.name}</p>
                  <p className="team-official">{event.homeTeam.officialName}</p>
                  <p className="team-country">{event.homeTeam.teamCountryCode}</p>
                </div>
              </div>
              <div>
                <p className="info-label">Away Team</p>
                <div className="team-card">
                  <p className="team-name">{event.awayTeam.name}</p>
                  <p className="team-official">{event.awayTeam.officialName}</p>
                  <p className="team-country">{event.awayTeam.teamCountryCode}</p>
                </div>
              </div>
            </div>
          )}

          <div className="competition-stage">
            <div>
              <p className="info-label">Competition</p>
              <p className="info-value">{event.originCompetitionName}</p>
            </div>
            <div>
              <p className="info-label">Stage</p>
              <p className="info-value">{event.stage.name}</p>
            </div>
          </div>

          {event.stadium && (
            <div className="stadium-section">
              <p className="info-label">Stadium</p>
              <p className="info-value">{event.stadium}</p>
            </div>
          )}

          {event.result && (
            <div className="result-section">
              <p className="info-label">Result</p>
              <p className="result-value">{`${event.result.homeGoals} : ${event.result.awayGoals}`}</p>
            </div>
          )}

          <div className="event-metadata">
            <p className="event-id">Event ID: {event.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};