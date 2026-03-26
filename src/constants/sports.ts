export const SPORTS = [
  'Football',
  'Ice Hockey',
  'Basketball',
  'Tennis',
  'Baseball'
] as const;

export type Sport = typeof SPORTS[number];