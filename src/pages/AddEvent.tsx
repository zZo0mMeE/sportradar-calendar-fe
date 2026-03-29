import { useEffect, useState, type ChangeEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import type { SportEvent, Team, Stage, Result } from '../types/event';

interface AddEventFormData {
  eventId: string | null;
  date: string;
  time: string;
  sport: string;
  homeTeam: string;
  homeTeamOfficialName: string;
  homeTeamSlug: string;
  homeTeamAbbreviation: string;
  homeTeamCountryCode: string;
  homeTeamStagePosition: string;
  awayTeam: string;
  awayTeamOfficialName: string;
  awayTeamSlug: string;
  awayTeamAbbreviation: string;
  awayTeamCountryCode: string;
  awayTeamStagePosition: string;
  competition: string;
  originCompetitionId: string;
  stadium: string;
  stageId: string;
  stageName: string;
  stageOrdering: number;
  status: string;
  homeGoals: number;
  awayGoals: number;
  winner: string;
  winnerId: string;
  resultMessage: string;
  firstHalfHomeGoals: number;
  firstHalfAwayGoals: number;
  secondHalfHomeGoals: number;
  secondHalfAwayGoals: number;
  yellowCardsCount: number;
  secondYellowCardsCount: number;
  directRedCardsCount: number;
  group: string;
}

const buildTeam = (
  name: string,
  officialName?: string,
  slug?: string,
  abbreviation?: string,
  teamCountryCode = '',
  stagePosition: string | null = null,
): Team => ({
  name,
  officialName: officialName?.trim() || name,
  slug: slug?.trim() || name.toLowerCase().replace(/\s+/g, '-'),
  abbreviation: abbreviation?.trim() || name.slice(0, 3).toUpperCase(),
  teamCountryCode,
  stagePosition: stagePosition || null,
});

const emptyResult: Result = {
  homeGoals: 0,
  awayGoals: 0,
  winner: null,
  winnerId: null,
  message: null,
  goals: [],
  yellowCards: [],
  secondYellowCards: [],
  directRedCards: [],
  scoreByPeriods: null,
};

type LocationState = { event?: SportEvent };

const buildFormDataFromEvent = (event: SportEvent | undefined, defaultDate: string, defaultTime: string): AddEventFormData => ({
  eventId: event?.id ?? null,
  date: event?.dateVenue ?? defaultDate,
  time: event?.timeVenueUTC.slice(0, 5) ?? defaultTime,
  sport: event?.sport ?? '',
  homeTeam: event?.homeTeam?.name ?? '',
  homeTeamOfficialName: event?.homeTeam?.officialName ?? '',
  homeTeamSlug: event?.homeTeam?.slug ?? '',
  homeTeamAbbreviation: event?.homeTeam?.abbreviation ?? '',
  homeTeamCountryCode: event?.homeTeam?.teamCountryCode ?? '',
  homeTeamStagePosition: event?.homeTeam?.stagePosition ?? '',
  awayTeam: event?.awayTeam.name ?? '',
  awayTeamOfficialName: event?.awayTeam.officialName ?? '',
  awayTeamSlug: event?.awayTeam.slug ?? '',
  awayTeamAbbreviation: event?.awayTeam.abbreviation ?? '',
  awayTeamCountryCode: event?.awayTeam.teamCountryCode ?? '',
  awayTeamStagePosition: event?.awayTeam.stagePosition ?? '',
  competition: event?.originCompetitionName ?? '',
  originCompetitionId: event?.originCompetitionId ?? '',
  stadium: event?.stadium ?? '',
  stageId: event?.stage.id ?? 'REGULAR',
  stageName: event?.stage.name ?? 'Regular Season',
  stageOrdering: event?.stage.ordering ?? 1,
  status: event?.status ?? 'scheduled',
  homeGoals: event?.result?.homeGoals ?? 0,
  awayGoals: event?.result?.awayGoals ?? 0,
  winner: event?.result?.winner ?? '',
  winnerId: event?.result?.winnerId ?? '',
  resultMessage: event?.result?.message ?? '',
  firstHalfHomeGoals: event?.result?.scoreByPeriods?.firstHalf.homeGoals ?? 0,
  firstHalfAwayGoals: event?.result?.scoreByPeriods?.firstHalf.awayGoals ?? 0,
  secondHalfHomeGoals: event?.result?.scoreByPeriods?.secondHalf.homeGoals ?? 0,
  secondHalfAwayGoals: event?.result?.scoreByPeriods?.secondHalf.awayGoals ?? 0,
  yellowCardsCount: event?.result?.yellowCardsCount ?? 0,
  secondYellowCardsCount: event?.result?.secondYellowCardsCount ?? 0,
  directRedCardsCount: event?.result?.directRedCardsCount ?? 0,
  group: event?.group ?? '',
});

export const AddEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addEvent, updateEvent } = useEvents();
  const today = new Date();
  const defaultDate = today.toISOString().slice(0, 10);
  const defaultTime = today.toTimeString().slice(0, 5);
  const editEvent = (location.state as LocationState | null)?.event;

  const [formData, setFormData] = useState<AddEventFormData>(() => buildFormDataFromEvent(editEvent, defaultDate, defaultTime));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isEditMode = Boolean(editEvent?.id);

  useEffect(() => {
    if (editEvent) {
      setFormData(buildFormDataFromEvent(editEvent, defaultDate, defaultTime));
    }
  }, [editEvent, defaultDate, defaultTime]);

  const sportType = formData.sport.trim().toLowerCase();
  const isFootball = sportType === 'football' || sportType === 'soccer' || sportType === 'футбол';
  const isCompleted = formData.status === 'finished';
  const canShowAdvanced = isFootball && isCompleted;

  useEffect(() => {
    if (!isFootball && showAdvanced) {
      setShowAdvanced(false);
    }
  }, [isFootball, showAdvanced]);

  useEffect(() => {
    if (!isCompleted) {
      setShowAdvanced(false);
      setFormData(prev => ({
        ...prev,
        winner: '',
        firstHalfHomeGoals: 0,
        firstHalfAwayGoals: 0,
        secondHalfHomeGoals: 0,
        secondHalfAwayGoals: 0,
        yellowCardsCount: 0,
        secondYellowCardsCount: 0,
        directRedCardsCount: 0,
      }));
      return;
    }

    const homeName = formData.homeTeam.trim();
    const awayName = formData.awayTeam.trim();

    if (formData.homeGoals > formData.awayGoals && homeName) {
      setFormData(prev => ({ ...prev, winner: homeName }));
    } else if (formData.homeGoals < formData.awayGoals && awayName) {
      setFormData(prev => ({ ...prev, winner: awayName }));
    } else {
      setFormData(prev => ({ ...prev, winner: '' }));
    }
  }, [formData.status, formData.homeGoals, formData.awayGoals, formData.homeTeam, formData.awayTeam, isCompleted, isFootball, showAdvanced]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    const homeTeamName = formData.homeTeam.trim();
    const awayTeamName = formData.awayTeam.trim();
    const winnerName = formData.winner.trim();

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.sport) newErrors.sport = 'Sport is required';
    if (!homeTeamName) newErrors.homeTeam = 'Home team is required';
    if (!awayTeamName) newErrors.awayTeam = 'Away team is required';

    if (homeTeamName && awayTeamName && homeTeamName.toLowerCase() === awayTeamName.toLowerCase()) {
      newErrors.homeTeam = 'Home and away teams must be different';
    }

    const codeRegex = /^[A-Z]{2,3}$/;
    const abbreviationRegex = /^[A-Z0-9]{2,4}$/;
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (formData.status !== 'scheduled') {
      if (formData.homeGoals < 0) newErrors.homeGoals = 'Home goals cannot be negative';
      if (formData.awayGoals < 0) newErrors.awayGoals = 'Away goals cannot be negative';
    }

    if (!formData.stageId.trim()) {
      newErrors.stageId = 'Stage ID is required';
    }
    if (!formData.stageName.trim()) {
      newErrors.stageName = 'Stage Name is required';
    }
    if (formData.originCompetitionId && !slugRegex.test(formData.originCompetitionId.trim())) {
      newErrors.originCompetitionId = 'Competition ID must be a slug (lowercase, letters, numbers, dashes)';
    }
    if (formData.homeTeamSlug && !slugRegex.test(formData.homeTeamSlug.trim())) {
      newErrors.homeTeamSlug = 'Home team slug must be lowercase letters, numbers, and dashes';
    }
    if (formData.awayTeamSlug && !slugRegex.test(formData.awayTeamSlug.trim())) {
      newErrors.awayTeamSlug = 'Away team slug must be lowercase letters, numbers, and dashes';
    }
    if (formData.homeTeamAbbreviation && !abbreviationRegex.test(formData.homeTeamAbbreviation.trim())) {
      newErrors.homeTeamAbbreviation = 'Home team abbreviation should be 2–4 uppercase letters or digits';
    }
    if (formData.awayTeamAbbreviation && !abbreviationRegex.test(formData.awayTeamAbbreviation.trim())) {
      newErrors.awayTeamAbbreviation = 'Away team abbreviation should be 2–4 uppercase letters or digits';
    }
    if (formData.homeTeamCountryCode && !codeRegex.test(formData.homeTeamCountryCode.trim())) {
      newErrors.homeTeamCountryCode = 'Country code should be 2–3 uppercase letters';
    }
    if (formData.awayTeamCountryCode && !codeRegex.test(formData.awayTeamCountryCode.trim())) {
      newErrors.awayTeamCountryCode = 'Country code should be 2–3 uppercase letters';
    }
    if (formData.stageOrdering < 1) {
      newErrors.stageOrdering = 'Stage order must be 1 or greater';
    }

    if (formData.status === 'finished') {
      if (formData.homeGoals === formData.awayGoals && winnerName) {
        newErrors.winner = 'Winner should be empty for a draw';
      }
      if (formData.homeGoals !== formData.awayGoals && winnerName) {
        const winnerLower = winnerName.toLowerCase();
        if (winnerLower !== homeTeamName.toLowerCase() && winnerLower !== awayTeamName.toLowerCase()) {
          newErrors.winner = 'Winner must match one of the team names';
        }
      }
    }

    if (formData.status === 'scheduled' && winnerName) {
      newErrors.winner = 'Scheduled events should not have a winner';
    }
    if (formData.status === 'live' && winnerName) {
      newErrors.winner = 'Live events should not have a winner yet';
    }

    if (isFootball && isCompleted) {
      if (formData.firstHalfHomeGoals < 0) newErrors.firstHalfHomeGoals = 'Must be 0 or more';
      if (formData.firstHalfAwayGoals < 0) newErrors.firstHalfAwayGoals = 'Must be 0 or more';
      if (formData.secondHalfHomeGoals < 0) newErrors.secondHalfHomeGoals = 'Must be 0 or more';
      if (formData.secondHalfAwayGoals < 0) newErrors.secondHalfAwayGoals = 'Must be 0 or more';

      const homePeriodTotal = formData.firstHalfHomeGoals + formData.secondHalfHomeGoals;
      const awayPeriodTotal = formData.firstHalfAwayGoals + formData.secondHalfAwayGoals;
      if ((formData.firstHalfHomeGoals || formData.secondHalfHomeGoals) && homePeriodTotal !== formData.homeGoals) {
        newErrors.firstHalfHomeGoals = 'Home half scores should equal total goals';
      }
      if ((formData.firstHalfAwayGoals || formData.secondHalfAwayGoals) && awayPeriodTotal !== formData.awayGoals) {
        newErrors.firstHalfAwayGoals = 'Away half scores should equal total goals';
      }

      if (formData.yellowCardsCount < 0) newErrors.yellowCardsCount = 'Cannot be negative';
      if (formData.secondYellowCardsCount < 0) newErrors.secondYellowCardsCount = 'Cannot be negative';
      if (formData.directRedCardsCount < 0) newErrors.directRedCardsCount = 'Cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const homeTeam = buildTeam(
      formData.homeTeam.trim(),
      formData.homeTeamOfficialName.trim() || undefined,
      formData.homeTeamSlug.trim() || undefined,
      formData.homeTeamAbbreviation.trim() || undefined,
      formData.homeTeamCountryCode.trim(),
      formData.homeTeamStagePosition.trim() || null,
    );
    const awayTeam = buildTeam(
      formData.awayTeam.trim(),
      formData.awayTeamOfficialName.trim() || undefined,
      formData.awayTeamSlug.trim() || undefined,
      formData.awayTeamAbbreviation.trim() || undefined,
      formData.awayTeamCountryCode.trim(),
      formData.awayTeamStagePosition.trim() || null,
    );

    const stage: Stage = {
      id: formData.stageId,
      name: formData.stageName,
      ordering: formData.stageOrdering,
    };

    const computedWinner = formData.homeGoals > formData.awayGoals
      ? homeTeam.name
      : formData.homeGoals < formData.awayGoals
        ? awayTeam.name
        : null;

    const hasHalfScoreDetails = Boolean(
      formData.firstHalfHomeGoals ||
      formData.firstHalfAwayGoals ||
      formData.secondHalfHomeGoals ||
      formData.secondHalfAwayGoals
    );

    const scoreByPeriods = isFootball && hasHalfScoreDetails
      ? {
        firstHalf: {
          homeGoals: formData.firstHalfHomeGoals,
          awayGoals: formData.firstHalfAwayGoals,
        },
        secondHalf: {
          homeGoals: formData.secondHalfHomeGoals,
          awayGoals: formData.secondHalfAwayGoals,
        },
      }
      : null;

    const result = {
      ...emptyResult,
      homeGoals: formData.homeGoals,
      awayGoals: formData.awayGoals,
      winner: computedWinner,
      winnerId: formData.winnerId.trim() || null,
      message: formData.resultMessage.trim() || null,
      scoreByPeriods,
      yellowCards: [],
      secondYellowCards: [],
      directRedCards: [],
      yellowCardsCount: isFootball && isCompleted ? formData.yellowCardsCount : 0,
      secondYellowCardsCount: isFootball && isCompleted ? formData.secondYellowCardsCount : 0,
      directRedCardsCount: isFootball && isCompleted ? formData.directRedCardsCount : 0,
    };

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
      originCompetitionId: formData.originCompetitionId
        ? formData.originCompetitionId.trim()
        : formData.competition
          ? formData.competition.toLowerCase().replace(/\s/g, '-')
          : 'custom',
      originCompetitionName: formData.competition || 'Custom Event',
      sport: formData.sport,
    };

    if (isEditMode && formData.eventId) {
      updateEvent({ ...newEvent, id: formData.eventId });
    } else {
      addEvent(newEvent);
    }

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
              <label>Home Team *</label>
              <input type="text" name="homeTeam" placeholder="Home team name" value={formData.homeTeam} onChange={handleChange} className="field-input" />
              {errors.homeTeam && <span className="error-text">{errors.homeTeam}</span>}
            </div>
            <div>
              <label>Away Team *</label>
              <input type="text" name="awayTeam" placeholder="Away team name" value={formData.awayTeam} onChange={handleChange} className="field-input" />
              {errors.awayTeam && <span className="error-text">{errors.awayTeam}</span>}
            </div>
            <div>
              <label>Home Team Country Code</label>
              <input type="text" name="homeTeamCountryCode" placeholder="e.g. GER" value={formData.homeTeamCountryCode} onChange={handleChange} className="field-input" />
              {errors.homeTeamCountryCode && <span className="error-text">{errors.homeTeamCountryCode}</span>}
            </div>
            <div>
              <label>Away Team Country Code</label>
              <input type="text" name="awayTeamCountryCode" placeholder="e.g. ENG" value={formData.awayTeamCountryCode} onChange={handleChange} className="field-input" />
              {errors.awayTeamCountryCode && <span className="error-text">{errors.awayTeamCountryCode}</span>}
            </div>
            <div>
              <label>Home Team Abbreviation</label>
              <input type="text" name="homeTeamAbbreviation" placeholder="e.g. MAN" value={formData.homeTeamAbbreviation} onChange={handleChange} className="field-input" />
              {errors.homeTeamAbbreviation && <span className="error-text">{errors.homeTeamAbbreviation}</span>}
            </div>
            <div>
              <label>Away Team Abbreviation</label>
              <input type="text" name="awayTeamAbbreviation" placeholder="e.g. TOT" value={formData.awayTeamAbbreviation} onChange={handleChange} className="field-input" />
              {errors.awayTeamAbbreviation && <span className="error-text">{errors.awayTeamAbbreviation}</span>}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2 className="section-title">Event Details</h2>
          <div className="field-grid">
            <div>
              <label>Competition Name</label>
              <input type="text" name="competition" value={formData.competition} onChange={handleChange} className="field-input" />
              {errors.competition && <span className="error-text">{errors.competition}</span>}
            </div>
            <div>
              <label>Competition ID</label>
              <input type="text" name="originCompetitionId" value={formData.originCompetitionId} onChange={handleChange} className="field-input" />
              {errors.originCompetitionId && <span className="error-text">{errors.originCompetitionId}</span>}
            </div>
            <div>
              <label>Stadium</label>
              <input type="text" name="stadium" value={formData.stadium} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label>Stage ID</label>
              <input type="text" name="stageId" value={formData.stageId} onChange={handleChange} className="field-input" />
              {errors.stageId && <span className="error-text">{errors.stageId}</span>}
            </div>
            <div>
              <label>Stage Name</label>
              <input type="text" name="stageName" value={formData.stageName} onChange={handleChange} className="field-input" />
              {errors.stageName && <span className="error-text">{errors.stageName}</span>}
            </div>
            <div>
              <label>Stage Order</label>
              <input type="number" name="stageOrdering" value={formData.stageOrdering} onChange={handleChange} className="field-input" />
              {errors.stageOrdering && <span className="error-text">{errors.stageOrdering}</span>}
            </div>
            <div><label>Group (optional)</label><input type="text" name="group" value={formData.group} onChange={handleChange} className="field-input" /></div>
          </div>
        </section>

        {canShowAdvanced && (
          <div className="form-toolbar">
            <button type="button" className="app-link" onClick={() => setShowAdvanced(prev => !prev)}>
              {showAdvanced ? 'Hide football details' : 'Add football details'}
            </button>
          </div>
        )}

        {showAdvanced && isFootball && (
          <section className="form-section">
            <h2 className="section-title">Football match details</h2>
            <div className="field-grid md:grid-cols-2 gap-4">
              <div>
                <label>Home Team Official Name</label>
                <input type="text" name="homeTeamOfficialName" value={formData.homeTeamOfficialName} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label>Away Team Official Name</label>
                <input type="text" name="awayTeamOfficialName" value={formData.awayTeamOfficialName} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label>Home Team Slug</label>
                <input type="text" name="homeTeamSlug" value={formData.homeTeamSlug} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label>Away Team Slug</label>
                <input type="text" name="awayTeamSlug" value={formData.awayTeamSlug} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label>Home Team Stage Position</label>
                <input type="text" name="homeTeamStagePosition" value={formData.homeTeamStagePosition} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label>Away Team Stage Position</label>
                <input type="text" name="awayTeamStagePosition" value={formData.awayTeamStagePosition} onChange={handleChange} className="field-input" />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="section-title">Half scores</h3>
              <div className="field-grid md:grid-cols-4 gap-4">
                <div>
                  <label>1st half home goals</label>
                  <input type="number" min="0" name="firstHalfHomeGoals" value={formData.firstHalfHomeGoals} onChange={handleChange} className="field-input" />
                  {errors.firstHalfHomeGoals && <span className="error-text">{errors.firstHalfHomeGoals}</span>}
                </div>
                <div>
                  <label>1st half away goals</label>
                  <input type="number" min="0" name="firstHalfAwayGoals" value={formData.firstHalfAwayGoals} onChange={handleChange} className="field-input" />
                  {errors.firstHalfAwayGoals && <span className="error-text">{errors.firstHalfAwayGoals}</span>}
                </div>
                <div>
                  <label>2nd half home goals</label>
                  <input type="number" min="0" name="secondHalfHomeGoals" value={formData.secondHalfHomeGoals} onChange={handleChange} className="field-input" />
                  {errors.secondHalfHomeGoals && <span className="error-text">{errors.secondHalfHomeGoals}</span>}
                </div>
                <div>
                  <label>2nd half away goals</label>
                  <input type="number" min="0" name="secondHalfAwayGoals" value={formData.secondHalfAwayGoals} onChange={handleChange} className="field-input" />
                  {errors.secondHalfAwayGoals && <span className="error-text">{errors.secondHalfAwayGoals}</span>}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="section-title">Cards</h3>
              <div className="field-grid md:grid-cols-3 gap-4">
                <div>
                  <label>Yellow cards</label>
                  <input type="number" min="0" name="yellowCardsCount" value={formData.yellowCardsCount} onChange={handleChange} className="field-input" />
                  {errors.yellowCardsCount && <span className="error-text">{errors.yellowCardsCount}</span>}
                </div>
                <div>
                  <label>Second yellow cards</label>
                  <input type="number" min="0" name="secondYellowCardsCount" value={formData.secondYellowCardsCount} onChange={handleChange} className="field-input" />
                  {errors.secondYellowCardsCount && <span className="error-text">{errors.secondYellowCardsCount}</span>}
                </div>
                <div>
                  <label>Direct red cards</label>
                  <input type="number" min="0" name="directRedCardsCount" value={formData.directRedCardsCount} onChange={handleChange} className="field-input" />
                  {errors.directRedCardsCount && <span className="error-text">{errors.directRedCardsCount}</span>}
                </div>
              </div>
            </div>

          </section>
        )}

        {formData.status !== 'scheduled' && (
          <section className="form-section">
            <h2 className="section-title">Result</h2>
            <div className="field-grid md:grid-cols-3">
              <div>
                <label>Home Goals</label>
                <input type="number" name="homeGoals" value={formData.homeGoals} onChange={handleChange} className="field-input" />
                {errors.homeGoals && <span className="error-text">{errors.homeGoals}</span>}
              </div>
              <div>
                <label>Away Goals</label>
                <input type="number" name="awayGoals" value={formData.awayGoals} onChange={handleChange} className="field-input" />
                {errors.awayGoals && <span className="error-text">{errors.awayGoals}</span>}
              </div>
              {formData.status === 'finished' && (
                <div>
                  <label>Winner (auto-filled)</label>
                  <input type="text" name="winner" value={formData.winner || 'Draw'} readOnly className="field-input bg-slate-100" />
                  {errors.winner && <span className="error-text">{errors.winner}</span>}
                </div>
              )}
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