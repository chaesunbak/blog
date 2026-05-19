import type { HTMLAttributes } from 'react';

import type { Theme, WeatherKind } from '@/lib/hero';

import styles from './hero.module.css';
import { WeatherOverlay } from './weather-overlay';

type HeroFrameProps = HTMLAttributes<HTMLDivElement> & {
  theme: Theme;
  weather: WeatherKind | null;
};

const STAR_POSITIONS = [
  { top: '15%', left: '20%' },
  { top: '35%', left: '70%' },
  { top: '65%', left: '85%' },
  { top: '45%', left: '15%' },
];

export function HeroFrame({ theme, weather, ...rest }: HeroFrameProps) {
  return (
    <div data-theme={theme} {...rest}>
      <div className={styles.frame}>
        <WeatherOverlay weather={weather} />

        <div className={styles.sun} />

        <div className={styles.stars}>
          <div className={styles.polaris} />
          {STAR_POSITIONS.map((pos, i) => (
            <div key={i} className={styles.star} style={pos} />
          ))}
        </div>

        <div className={styles.waveContainerBack}>
          <WavesSvg waveClass={styles.wave1} fill="var(--wave1)" x="48" y="0" />
        </div>

        <div className={styles.boat}>
          <div className={styles.sailBack} />
          <div className={styles.sailFront} />
          <div className={styles.hull} />
        </div>

        <div className={styles.waveContainerFront}>
          <svg
            className={styles.waves}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 24 450 45"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <g className={styles.parallax}>
              <use
                className={styles.wave2}
                href="#gentle-wave"
                x="24"
                y="3"
                fill="var(--wave2)"
              />
              <use
                className={styles.wave3}
                href="#gentle-wave"
                x="72"
                y="6"
                fill="var(--wave3)"
              />
              <use
                className={styles.wave4}
                href="#gentle-wave"
                x="0"
                y="9"
                fill="var(--wave4)"
              />
            </g>
          </svg>
        </div>

        <div className={styles.waterBottom} />
      </div>
    </div>
  );
}

function WavesSvg({
  waveClass,
  fill,
  x,
  y,
}: {
  waveClass: string;
  fill: string;
  x: string;
  y: string;
}) {
  return (
    <svg
      className={styles.waves}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 24 450 45"
      preserveAspectRatio="none"
      shapeRendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s58 18 88 18s58-18 88-18s58 18 88 18s58-18 88-18s58 18 88 18s58-18 88-18s58 18 88 18s58-18 88-18s58 18 88 18s58-18 88-18s58 18 88 18v44h-1056z"
        />
      </defs>
      <g className={styles.parallax}>
        <use className={waveClass} href="#gentle-wave" x={x} y={y} fill={fill} />
      </g>
    </svg>
  );
}
