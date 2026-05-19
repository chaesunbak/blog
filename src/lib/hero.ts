/* ---------- Theme (time of day) ---------- */

export type Theme = 'morning' | 'afternoon' | 'sunset' | 'night';

export function getThemeFromHour(hour: number): Theme {
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'sunset';
  return 'night';
}

export function getCurrentSeoulHour(): number {
  const seoul = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
  );
  return seoul.getHours();
}

/* ---------- Weather ---------- */

export type WeatherKind = 'clear' | 'cloudy' | 'rain' | 'snow';

const CLOUDY_CODES = new Set([1003, 1006, 1009, 1030, 1135, 1147]);
const SNOW_CODES = new Set([
  1066, 1069, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237,
  1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282,
]);

export function mapConditionCode(code: number): WeatherKind {
  if (code === 1000) return 'clear';
  if (CLOUDY_CODES.has(code)) return 'cloudy';
  if (SNOW_CODES.has(code)) return 'snow';
  return 'rain';
}

export async function fetchCurrentWeather(): Promise<WeatherKind> {
  const key = process.env.WEATHERAPI_KEY;
  if (!key) {
    throw new Error('WEATHERAPI_KEY is not configured');
  }

  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${key}&q=Seoul`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) {
    throw new Error(`Weather API responded with status ${res.status}`);
  }

  const data = await res.json();
  const code: unknown = data?.current?.condition?.code;
  if (typeof code !== 'number') {
    throw new Error('Weather API returned malformed payload');
  }

  return mapConditionCode(code);
}
