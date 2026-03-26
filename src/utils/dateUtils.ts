export const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

export const getEventDisplayTime = (timeUTC: string): string => {
  return timeUTC.slice(0, 5);
};

export const getEventTeams = (event: { homeTeam: { name: string } | null; awayTeam: { name: string } }): string => {
  if (event.homeTeam) {
    return `${event.homeTeam.name} vs ${event.awayTeam.name}`;
  }
  return event.awayTeam.name;
};