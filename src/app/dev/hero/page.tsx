import type { Metadata } from 'next';

import { HeroFrame } from '@/components/home/hero-frame';
import type { Theme, WeatherKind } from '@/lib/hero';

export const metadata: Metadata = {
  title: 'Hero Playground',
  robots: { index: false, follow: false },
};

const THEMES: Theme[] = ['morning', 'afternoon', 'sunset', 'night'];
const WEATHERS: (WeatherKind | null)[] = [null, 'cloudy', 'rain', 'snow'];

const weatherLabel = (w: WeatherKind | null) => w ?? 'none';

export default function HeroPlaygroundPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Hero Illustration Playground</h1>
        <p className="text-sm text-slate-600">
          시간대 4종 × 날씨 4종(none/cloudy/rain/snow) 조합을 한눈에 확인하는
          페이지입니다.
        </p>
      </header>

      {THEMES.map((theme) => (
        <section key={theme} className="mb-10">
          <h2 className="mb-4 text-lg font-semibold capitalize text-slate-800">
            {theme}
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {WEATHERS.map((weather) => (
              <figure
                key={`${theme}-${weatherLabel(weather)}`}
                className="flex flex-col items-center gap-2"
              >
                <HeroFrame
                  theme={theme}
                  weather={weather}
                  className="w-full"
                />
                <figcaption className="text-xs text-slate-500">
                  {weatherLabel(weather)}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
