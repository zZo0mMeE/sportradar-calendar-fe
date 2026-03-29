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

export interface ScorePeriod {
  homeGoals: number;
  awayGoals: number;
}

export interface ScoreByPeriods {
  firstHalf: ScorePeriod;
  secondHalf: ScorePeriod;
}

export interface Result {
  homeGoals: number;
  awayGoals: number;
  winner: string | null;
  winnerId?: string | null;
  message: string | null;
  goals: Goal[];
  yellowCards: Card[];
  secondYellowCards: Card[];
  directRedCards: Card[];
  scoreByPeriods?: ScoreByPeriods | null;
  yellowCardsCount?: number;
  secondYellowCardsCount?: number;
  directRedCardsCount?: number;
}

export interface SportEvent {
  id?: string;
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
  sport: string;
}

export interface EventsResponse {
  data: SportEvent[];
}