import type { DatasetAverage } from '../types';
import styles from './Results.module.css';

interface ComparisonDisplayProps {
  userTotal: number;
  selectedAverage: DatasetAverage | null;
  globalAverage: DatasetAverage;
}

export default function ComparisonDisplay({
  userTotal,
  selectedAverage,
  globalAverage,
}: ComparisonDisplayProps) {
  const usingFallback = selectedAverage === null;
  const average = usingFallback ? globalAverage : selectedAverage;

  const diff = userTotal - average.kgCo2ePerYear;
  const isAbove = diff > 0;
  const isEqual = diff === 0;

  const indicator = isEqual
    ? { label: '= Equal', className: styles.indicatorEqual }
    : isAbove
    ? { label: '▲ Above average', className: styles.indicatorAbove }
    : { label: '▼ Below average', className: styles.indicatorBelow };

  return (
    <div className={styles.comparisonDisplay}>
      {usingFallback && (
        <p className={styles.fallbackNotice}>
          No data available for the selected region. Showing global average instead.
        </p>
      )}
      <div className={styles.comparisonRow}>
        <div className={styles.comparisonItem}>
          <span className={styles.comparisonLabel}>Your footprint</span>
          <span className={styles.comparisonValue}>{userTotal.toFixed(0)} kg CO₂e/year</span>
        </div>
        <div className={styles.comparisonItem}>
          <span className={styles.comparisonLabel}>
            {average.region} average
          </span>
          <span className={styles.comparisonValue}>
            {average.kgCo2ePerYear.toFixed(0)} kg CO₂e/year
          </span>
        </div>
      </div>
      <div className={`${styles.indicator} ${indicator.className}`}>
        {indicator.label}
        {!isEqual && (
          <span className={styles.indicatorDiff}>
            {' '}({Math.abs(diff).toFixed(0)} kg CO₂e/year {isAbove ? 'more' : 'less'})
          </span>
        )}
      </div>
    </div>
  );
}
