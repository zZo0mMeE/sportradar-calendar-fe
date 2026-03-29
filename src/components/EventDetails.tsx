import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import type { Card } from '../types/event';

export const EventDetails = () => {
  const [showMore, setShowMore] = useState(false);
  const { id } = useParams();
  const { getEventById, loading } = useEvents();
  const navigate = useNavigate();
  const event = getEventById(id || '');

  if (loading) {
    return <div className="event-detail-page">Loading event details...</div>;
  }

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

  const renderCards = (cards: Card[], title: string) => {
    if (!cards.length) return null;
    return (
      <div className="info-section">
        <p className="info-label">{title}</p>
        <div className="space-y-2">
          {cards.map(card => (
            <div key={card.id} className="team-card">
              <p className="team-name">{card.player} ({card.team})</p>
              <p className="team-official">{card.type} at {card.time}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCountSummary = (label: string, count?: number | null) => {
    if (!count) return null;
    return (
      <div>
        <p className="info-label">{label}</p>
        <p className="info-value">{count}</p>
      </div>
    );
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
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="app-link"
              onClick={() => navigate('/add-event', { state: { event } })}
            >
              Edit match
            </button>
            <button
              type="button"
              className="app-link"
              onClick={() => setShowMore(prev => !prev)}
            >
              {showMore ? 'Hide more event details' : 'Show more event details'}
            </button>
          </div>
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

          {showMore && (
            <div className="space-y-4">
              <div className="competition-stage">
                <div>
                  <p className="info-label">Competition ID</p>
                  <p className="info-value">{event.originCompetitionId}</p>
                </div>
                <div>
                  <p className="info-label">Stage Order</p>
                  <p className="info-value">{event.stage.ordering}</p>
                </div>
              </div>

              {event.group && (
                <div className="stadium-section">
                  <p className="info-label">Group</p>
                  <p className="info-value">{event.group}</p>
                </div>
              )}

              {event.homeTeam && (
                <div className="competition-stage">
                  <div>
                    <p className="info-label">Home Team Slug</p>
                    <p className="info-value">{event.homeTeam.slug}</p>
                  </div>
                  <div>
                    <p className="info-label">Away Team Slug</p>
                    <p className="info-value">{event.awayTeam.slug}</p>
                  </div>
                </div>
              )}

              {event.result?.scoreByPeriods && (
                <div className="stadium-section">
                  <p className="info-label">Half time scores</p>
                  <div className="competition-stage">
                    <div>
                      <p className="info-value">1st half: {event.result.scoreByPeriods.firstHalf.homeGoals} - {event.result.scoreByPeriods.firstHalf.awayGoals}</p>
                    </div>
                    <div>
                      <p className="info-value">2nd half: {event.result.scoreByPeriods.secondHalf.homeGoals} - {event.result.scoreByPeriods.secondHalf.awayGoals}</p>
                    </div>
                  </div>
                </div>
              )}

              {(event.result?.yellowCardsCount || event.result?.secondYellowCardsCount || event.result?.directRedCardsCount) && (
                <div className="competition-stage">
                  {renderCountSummary('Yellow cards', event.result?.yellowCardsCount)}
                  {renderCountSummary('Second yellow cards', event.result?.secondYellowCardsCount)}
                  {renderCountSummary('Direct red cards', event.result?.directRedCardsCount)}
                </div>
              )}

              {renderCards(event.result?.goals || [], 'Goals')}
              {renderCards(event.result?.yellowCards || [], 'Yellow Cards')}
              {renderCards(event.result?.secondYellowCards || [], 'Second Yellow Cards')}
              {renderCards(event.result?.directRedCards || [], 'Direct Red Cards')}
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