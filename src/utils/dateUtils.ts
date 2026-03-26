export const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

export const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getEventDisplayDate = (event: { dateVenue: string }): string => {
  return formatDate(event.dateVenue);
};

export const getEventDisplayTime = (timeUTC: string): string => {
  return timeUTC.slice(0, 5);
};

interface EventTeams {
  homeTeam: { name: string } | null;
  awayTeam: { name: string };
}

export const getEventTeams = (event: EventTeams): string => {
  if (event.homeTeam) {
    return `${event.homeTeam.name} vs ${event.awayTeam.name}`;
  }
  return event.awayTeam.name;
};