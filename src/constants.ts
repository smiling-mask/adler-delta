export const Path = {
  home: '/',
  multiplay: '/multiplay',
} as const;

export const TimeFormat = {
  second: 1000,
  minutes: (minutes: number) => TimeFormat.second * 60 * minutes,
  hours: (hours: number) => TimeFormat.second * 60 * 60 * hours,
} as const;
