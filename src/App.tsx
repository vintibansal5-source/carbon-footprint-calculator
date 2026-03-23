import { useEffect, useRef, useState } from 'react';
import { calculateFootprint } from './calculator/calculateFootprint';
import { generateSuggestions } from './suggestions/generateSuggestions';
import { encodeShareUrl, decodeShareUrl } from './share/shareEncoder';
import { saveCalculation, fetchCalculations, deleteCalculation } from './api/calculations';
import type { CalculationRecord } from './api/calculations';
import { InputForm } from './components/InputForm';
import CalculationHistory from './components/CalculationHistory';
import DonutChart from './components/DonutChart';
import BarChart from './components/BarChart';
import ComparisonDisplay from './components/ComparisonDisplay';
import RegionSelector from './components/RegionSelector';
import emissionFactors from './data/emission-factors.json';
import datasetAverages from './data/dataset-averages.json';
import type { UserInputs, FootprintResult, Suggestion, DatasetAverage, EmissionFactorDataset } from './types';
import styles from './components/Results.module.css';
import appStyles from './App.module.css';

const averages = datasetAverages as DatasetAverage[];

function getScoreColor(total: number, globalAvg: number): string {
  if (total <= globalAvg * 0.75) return '#2e7d32';
  if (total <= globalAvg * 1.25) return '#f57c00';
  return '#c62828';
}

function getScoreLabel(total: number, globalAvg: number): string {
  if (total <= globalAvg * 0.75) return 'Low';
  if (total <= globalAvg * 1.25) return 'Average';
  return 'High';
}

function App() {
  const [result, setResult] = useState<FootprintResult | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<UserInputs> | undefined>(undefined);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cfc_dark') === 'true');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const shareInputRef = useRef<HTMLInputElement>(null);

  const globalAverage = averages.find((a) => a.region === 'global') as DatasetAverage;

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('cfc_dark', String(darkMode));
  }, [darkMode]);

  // Load history from backend on mount
  useEffect(() => {
    fetchCalculations().then(setHistory).catch(() => {});
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const decoded = decodeShareUrl(hash);
    if (decoded) {
      setResult(decoded.result);
      setSuggestions(generateSuggestions(decoded.result, decoded.inputs));
      setShareUrl(hash);
      setSelectedRegion(decoded.inputs.selectedRegion ?? 'global');
      setInitialValues(decoded.inputs);
    } else {
      setError('The shared link is invalid or has been tampered with.');
    }
  }, []);

  async function handleSubmit(inputs: UserInputs) {
    try {
      const calcResult = calculateFootprint(inputs, emissionFactors as unknown as EmissionFactorDataset);
      const newSuggestions = generateSuggestions(calcResult, inputs);
      const url = encodeShareUrl(inputs, calcResult);

      // Save to backend
      await saveCalculation(inputs, calcResult);
      const updated = await fetchCalculations();
      setHistory(updated);

      setResult(calcResult);
      setSuggestions(newSuggestions);
      setShareUrl(url);
      setSelectedRegion(inputs.selectedRegion ?? 'global');
      setError(null);
      window.location.hash = url.startsWith('#') ? url.slice(1) : url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during calculation.');
    }
  }

  async function handleDeleteHistory(id: number) {
    await deleteCalculation(id);
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }

  function handleRestoreHistory(record: CalculationRecord) {
    setResult(record.result);
    setSuggestions(generateSuggestions(record.result, record.inputs));
    setSelectedRegion(record.inputs.selectedRegion ?? 'global');
    setInitialValues(record.inputs);
    const url = encodeShareUrl(record.inputs, record.result);
    setShareUrl(url);
    window.location.hash = url.startsWith('#') ? url.slice(1) : url;
  }

  function handleCopy() {
    const fullUrl = shareInputRef.current?.value ?? '';
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const selectedAverage = averages.find((a) => a.region === selectedRegion) ?? null;
  const fullShareUrl = shareUrl ? `${window.location.origin}${window.location.pathname}${shareUrl}` : '';
  const scoreColor = result ? getScoreColor(result.totalKgCo2ePerYear, globalAverage.kgCo2ePerYear) : '#1b5e20';
  const scoreLabel = result ? getScoreLabel(result.totalKgCo2ePerYear, globalAverage.kgCo2ePerYear) : '';

  return (
    <div className={`${appStyles.app} ${darkMode ? appStyles.dark : ''}`}>
      <header className={appStyles.header}>
        <div>
          <h1 className={appStyles.title}>🌱 Carbon Footprint Calculator</h1>
          <p className={appStyles.subtitle}>Estimate your annual CO₂ equivalent emissions</p>
        </div>
        <button
          className={appStyles.darkToggle}
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      {history.length > 0 && (
        <CalculationHistory
          history={history}
          onDelete={handleDeleteHistory}
          onRestore={handleRestoreHistory}
        />
      )}

      {error && (
        <div role="alert" className={appStyles.errorBanner}>{error}</div>
      )}

      <InputForm onSubmit={handleSubmit} initialValues={initialValues} />

      {result && (
        <section className={appStyles.results}>
          <div className={appStyles.scoreCard} style={{ borderColor: scoreColor }}>
            <div className={appStyles.scoreValue} style={{ color: scoreColor }}>
              {result.totalKgCo2ePerYear.toFixed(0)} kg CO₂e/year
            </div>
            <span className={appStyles.scoreBadge} style={{ background: scoreColor }}>
              {scoreLabel}
            </span>
            <div className={appStyles.scoreVersion}>
              Emission factors v{result.emissionFactorVersion}
            </div>
          </div>

          <RegionSelector averages={averages} selectedRegion={selectedRegion} onChange={setSelectedRegion} />

          <div className={styles.chartsGrid}>
            <DonutChart breakdown={result.breakdown} total={result.totalKgCo2ePerYear} />
            <BarChart breakdown={result.breakdown} />
          </div>

          <ComparisonDisplay
            userTotal={result.totalKgCo2ePerYear}
            selectedAverage={selectedAverage}
            globalAverage={globalAverage}
          />

          {suggestions.length > 0 && (
            <div className={appStyles.suggestions}>
              <h2 className={appStyles.sectionTitle}>Suggestions to reduce your footprint</h2>
              <ul className={appStyles.suggestionList}>
                {suggestions.map((s, i) => (
                  <li key={i} className={appStyles.suggestionItem}>
                    <span className={`${appStyles.categoryBadge} ${appStyles[`cat_${s.category}`]}`}>
                      {s.category}
                    </span>
                    <p className={appStyles.suggestionText}>{s.text}</p>
                    <span className={appStyles.savingText}>
                      Estimated saving: {s.estimatedSavingKgCo2ePerYear} kg CO₂e/year
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {fullShareUrl && (
            <div className={appStyles.shareSection}>
              <h2 className={appStyles.sectionTitle}>Share your results</h2>
              <div className={appStyles.shareRow}>
                <input
                  ref={shareInputRef}
                  type="text"
                  readOnly
                  value={fullShareUrl}
                  className={appStyles.shareInput}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button className={appStyles.copyButton} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
