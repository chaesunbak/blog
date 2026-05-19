import type { WeatherKind } from '@/lib/hero';

import styles from './weather-overlay.module.css';

export function WeatherOverlay({ weather }: { weather: WeatherKind | null }) {
  if (!weather || weather === 'clear') return null;

  return (
    <div className={styles.overlay} data-weather={weather} aria-hidden="true">
      {weather === 'cloudy' && <Clouds />}
      {weather === 'rain' && <Rain />}
      {weather === 'snow' && <Snow />}
    </div>
  );
}

function Clouds() {
  return (
    <>
      <span className={`${styles.cloud} ${styles.cloud1}`} />
      <span className={`${styles.cloud} ${styles.cloud2}`} />
      <span className={`${styles.cloud} ${styles.cloud3}`} />
    </>
  );
}

const RAIN_DROP_COUNT = 70;

function Rain() {
  return (
    <div className={styles.rain}>
      {Array.from({ length: RAIN_DROP_COUNT }).map((_, i) => (
        <span
          key={i}
          className={styles.drop}
          style={{
            left: `${(i * 7.3) % 100}%`,
            animationDelay: `${(i % 14) * 0.08}s`,
            animationDuration: `${0.8 + (i % 5) * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

const SNOW_FLAKE_COUNT = 22;

function Snow() {
  return (
    <div className={styles.snow}>
      {Array.from({ length: SNOW_FLAKE_COUNT }).map((_, i) => {
        const size = 4 + (i % 3) * 2;
        return (
          <span
            key={i}
            className={styles.flake}
            style={{
              left: `${(i * 4.55) % 100}%`,
              animationDelay: `${(i % 8) * 0.6}s`,
              animationDuration: `${4.5 + (i % 5) * 0.7}s`,
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        );
      })}
    </div>
  );
}
