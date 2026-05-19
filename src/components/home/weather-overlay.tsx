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

const RAIN_BACK_COUNT = 45;
const RAIN_FRONT_COUNT = 25;

function Rain() {
  return (
    <div className={styles.rain}>
      {Array.from({ length: RAIN_BACK_COUNT }).map((_, i) => (
        <span
          key={`b${i}`}
          className={`${styles.drop} ${styles.dropBack}`}
          style={{
            left: `${(i * 7.3) % 100}%`,
            animationDelay: `${(i % 14) * 0.1}s`,
            animationDuration: `${1.1 + (i % 5) * 0.12}s`,
          }}
        />
      ))}
      {Array.from({ length: RAIN_FRONT_COUNT }).map((_, i) => (
        <span
          key={`f${i}`}
          className={`${styles.drop} ${styles.dropFront}`}
          style={{
            left: `${(i * 11.3 + 4) % 100}%`,
            animationDelay: `${(i % 10) * 0.07}s`,
            animationDuration: `${0.7 + (i % 4) * 0.08}s`,
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
