import styles from './hero.module.css';

export function Hero() {
  const kstTime = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
  );
  const hour = kstTime.getHours();

  let theme = 'night';
  if (hour >= 6 && hour < 10) theme = 'morning';
  else if (hour >= 10 && hour < 17) theme = 'afternoon';
  else if (hour >= 17 && hour < 20) theme = 'sunset';

  return (
    <section data-theme={theme} className="site-panel">
      <div className="grid gap-8 px-6 py-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:items-center md:px-8 md:py-8">
        <div
          className="mx-auto w-full max-w-[24rem]"
          aria-label="노을빛 바다 위를 떠다니는 돛단배 일러스트"
          role="img"
        >
          <div className={styles.frame}>
            <div className={styles.sun} />
            <div className={styles.stars}>
              <div className={styles.polaris} />
              <div
                className={styles.star}
                style={{ top: '15%', left: '20%' }}
              />
              <div
                className={styles.star}
                style={{ top: '35%', left: '70%' }}
              />
              <div
                className={styles.star}
                style={{ top: '65%', left: '85%' }}
              />
              <div
                className={styles.star}
                style={{ top: '45%', left: '15%' }}
              />
            </div>

            <div className={styles.waveContainerBack}>
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
                  <use
                    className={styles.wave1}
                    href="#gentle-wave"
                    x="48"
                    y="0"
                    fill="var(--wave1)"
                  />
                </g>
              </svg>
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

        <div className="flex flex-col gap-3">
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            바다를 항해하는 배가 멋지다고 생각해서 선박이라고 이름 지었습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
