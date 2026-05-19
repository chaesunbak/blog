import {
  fetchCurrentWeather,
  getCurrentSeoulHour,
  getThemeFromHour,
  type WeatherKind,
} from '@/lib/hero';

import { HeroFrame } from './hero-frame';

async function safeFetchCurrentWeather(): Promise<WeatherKind | null> {
  try {
    return await fetchCurrentWeather();
  } catch (error) {
    console.warn(
      '[hero] failed to fetch weather, falling back to none:',
      error,
    );
    return null;
  }
}

export async function Hero() {
  const theme = getThemeFromHour(getCurrentSeoulHour());
  const weather = await safeFetchCurrentWeather();

  return (
    <section className="site-panel">
      <div className="grid gap-8 p-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:items-center">
        <HeroFrame
          theme={theme}
          weather={weather}
          className="mx-auto w-full max-w-[24rem]"
          role="img"
          aria-label="바다 위를 떠다니는 돛단배 일러스트"
        />

        <div className="flex flex-col gap-3">
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            바다를 항해하는 배가 멋지다고 생각해서 선박이라는 닉네임을
            지었습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
