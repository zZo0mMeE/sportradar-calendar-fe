export interface Team {
  name: string;
  officialName: string;
  slug: string;
  abbreviation: string;
  teamCountryCode: string;
  stagePosition: string | null;
}

export interface Stage {
  id: string;
  name: string;
  ordering: number;
}

export interface SportEvent {
  id: string;
  status: string;
  timeVenueUTC: string;
  dateVenue: string;
  stadium: string | null;
  homeTeam: Team | null;
  awayTeam: Team;
  result: string | null;
  stage: Stage;
  group: string | null;
  originCompetitionId: string;
  originCompetitionName: string;
  sport: string;
}

export interface EventsResponse {
  events: SportEvent[];
}