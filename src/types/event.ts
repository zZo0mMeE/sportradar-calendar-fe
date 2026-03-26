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

export interface Goal {
  id: string;
  type: string;
  time: string;
  player: string;
  team: string;
}

export interface Card {
  id: string;
  type: string;
  time: string;
  player: string;
  team: string;
}

export interface Result {
  homeGoals: number;
  awayGoals: number;
  winner: string | null;
  message: string | null;
  goals: Goal[];
  yellowCards: Card[];
  secondYellowCards: Card[];
  directRedCards: Card[];
}

export interface SportEvent {
  season: number;
  status: string;
  timeVenueUTC: string;
  dateVenue: string;
  stadium: string | null;
  homeTeam: Team | null;
  awayTeam: Team;
  result: Result | null;
  stage: Stage;
  group: string | null;
  originCompetitionId: string;
  originCompetitionName: string;
}

export interface EventsResponse {
  data: SportEvent[];
}