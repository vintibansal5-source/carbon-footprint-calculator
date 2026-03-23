import { useState } from 'react';
import type { UserInputs, ValidationError } from '../types';
import { validateInputs } from '../calculator/validateInputs';
import styles from './InputForm.module.css';

interface InputFormProps {
  onSubmit: (inputs: UserInputs) => void;
  initialValues?: Partial<UserInputs>;
}

type FieldErrors = Record<string, string>;

function errorsToMap(errors: ValidationError[]): FieldErrors {
  const map: FieldErrors = {};
  for (const e of errors) {
    map[e.field] = e.message;
  }
  return map;
}

export function InputForm({ onSubmit, initialValues }: InputFormProps) {
  const [weeklyCarKm, setWeeklyCarKm] = useState(
    initialValues?.transport?.weeklyCarKm?.toString() ?? ''
  );
  const [fuelType, setFuelType] = useState<string>(
    initialValues?.transport?.fuelType ?? ''
  );
  const [weeklyPublicTransportKm, setWeeklyPublicTransportKm] = useState(
    initialValues?.transport?.weeklyPublicTransportKm?.toString() ?? ''
  );
  const [flightsPerYear, setFlightsPerYear] = useState(
    initialValues?.transport?.flightsPerYear?.toString() ?? ''
  );
  const [monthlyKwh, setMonthlyKwh] = useState(
    initialValues?.electricity?.monthlyKwh?.toString() ?? ''
  );
  const [energySource, setEnergySource] = useState<string>(
    initialValues?.electricity?.energySource ?? ''
  );
  const [dietType, setDietType] = useState<string>(
    initialValues?.food?.dietType ?? ''
  );
  const [weeklyFoodWasteKg, setWeeklyFoodWasteKg] = useState(
    initialValues?.food?.weeklyFoodWasteKg?.toString() ?? ''
  );

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function buildPartialInputs(): Partial<UserInputs> {
    return {
      transport: {
        weeklyCarKm: weeklyCarKm === '' ? NaN : Number(weeklyCarKm),
        fuelType: fuelType as UserInputs['transport']['fuelType'],
        weeklyPublicTransportKm:
          weeklyPublicTransportKm === '' ? NaN : Number(weeklyPublicTransportKm),
        flightsPerYear: flightsPerYear === '' ? NaN : Number(flightsPerYear),
      },
      electricity: {
        monthlyKwh: monthlyKwh === '' ? NaN : Number(monthlyKwh),
        energySource: energySource as UserInputs['electricity']['energySource'],
      },
      food: {
        dietType: dietType as UserInputs['food']['dietType'],
        weeklyFoodWasteKg:
          weeklyFoodWasteKg === '' ? NaN : Number(weeklyFoodWasteKg),
      },
      selectedRegion: initialValues?.selectedRegion ?? 'global',
    };
  }

  function handleBlur(fieldKey: string) {
    const partial = buildPartialInputs();
    const result = validateInputs(partial);
    const map = errorsToMap(result.errors);
    setFieldErrors((prev) => ({
      ...prev,
      [fieldKey]: map[fieldKey] ?? '',
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const partial = buildPartialInputs();
    const result = validateInputs(partial);
    if (!result.valid) {
      setFieldErrors(errorsToMap(result.errors));
      return;
    }
    onSubmit(partial as UserInputs);
  }

  function fieldClass(key: string) {
    return `${styles.input} ${fieldErrors[key] ? styles.inputError : ''}`;
  }

  function selectClass(key: string) {
    return `${styles.select} ${fieldErrors[key] ? styles.inputError : ''}`;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Transport */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Transport</legend>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="weeklyCarKm">
              Weekly car distance (km)
            </label>
            <input
              id="weeklyCarKm"
              type="number"
              min="0"
              className={fieldClass('transport.weeklyCarKm')}
              value={weeklyCarKm}
              onChange={(e) => setWeeklyCarKm(e.target.value)}
              onBlur={() => handleBlur('transport.weeklyCarKm')}
              placeholder="e.g. 100"
            />
            {fieldErrors['transport.weeklyCarKm'] && (
              <span className={styles.errorMessage} role="alert">
                {fieldErrors['transport.weeklyCarKm']}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="fuelType">
              Fuel type
            </label>
            <select
              id="fuelType"
              className={selectClass('transport.fuelType')}
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              onBlur={() => handleBlur('transport.fuelType')}
            >
              <option value="">Select fuel type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {fieldErrors['transport.fuelType'] && (
              <span className={styles.errorMessage} role="alert">
                {fieldErrors['transport.fuelType']}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="weeklyPublicTransportKm">
              Weekly public transport distance (km)
            </label>
            <input
              id="weeklyPublicTransportKm"
              type="number"
              min="0"
              className={fieldClass('transport.weeklyPublicTransportKm')}
              value={weeklyPublicTransportKm}
              onChange={(e) => setWeeklyPublicTransportKm(e.target.value)}
              onBlur={() => handleBlur('transport.weeklyPublicTransportKm')}
              placeholder="e.g. 50"
            />
            {fieldErrors['transport.weeklyPublicTransportKm'] && (
              <span className={styles.errorMessage} role="alert">
                {fieldErrors['transport.weeklyPublicTransportKm']}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="flightsPerYear">
              Flights per year
            </label>
            <input
              id="flightsPerYear"
              type="number"
              min="0"
              className={fieldClass('transport.flightsPerYear')}
              value={flightsPerYear}
              onChange={(e) => setFlightsPerYear(e.target.value)}
              onBlur={() => handleBlur('transport.flightsPerYear')}
              placeholder="e.g. 2"
            />
            {fieldErrors['transport.flightsPerYear'] && (
              <span className={styles.errorMessage} role="alert">
                {fieldErrors['transport.flightsPerYear']}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Electricity */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Electricity</legend>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="monthlyKwh">
              Monthly electricity consumption (kWh)
            </label>
            <input
              id="monthlyKwh"
              type="number"
              min="0"
              className={fieldClass('electricity.monthlyKwh')}
              value={monthlyKwh}
              onChange={(e) => setMonthlyKwh(e.target.value)}
              onBlur={() => handleBlur('electricity.monthlyKwh')}
              placeholder="e.g. 300"
            />
            {fieldErrors['electricity.monthlyKwh'] && (
              <span className={styles.errorMessage} role="alert">
                {fieldErrors['electricity.monthlyKwh']}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="energySource">
              Energy source
            </label>
            <select
              id="energySource"
              className={selectClass('electricity.energySource')}
              value={energySource}
              onChange={(e) => setEnergySource(e.target.value)}
              onBlur={() => handleBlur('electricity.energySource')}
            >
              <option value="">Select energy source</option>
              <option value="grid">Grid</option>
              <option value="renewable">Renewable</option>
              <option value="mixed">Mixed</option>
            </select>
            {fieldErrors['electricity.energySource'] && (
              <span className={styles.errorMessage} role="alert">
                {fieldErrors['electricity.energySource']}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Food */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Food</legend>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="dietType">
              Diet type
            </label>
            <select
              id="dietType"
              className={selectClass('food.dietType')}
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              onBlur={() => handleBlur('food.dietType')}
            >
              <option value="">Select diet type</option>
              <option value="meat-heavy">Meat-heavy</option>
              <option value="omnivore">Omnivore</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
            {fieldErrors['food.dietType'] && (
              <span className={styles.errorMessage} role="alert">
                {fieldErrors['food.dietType']}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="weeklyFoodWasteKg">
              Weekly food waste (kg)
            </label>
            <input
              id="weeklyFoodWasteKg"
              type="number"
              min="0"
              className={fieldClass('food.weeklyFoodWasteKg')}
              value={weeklyFoodWasteKg}
              onChange={(e) => setWeeklyFoodWasteKg(e.target.value)}
              onBlur={() => handleBlur('food.weeklyFoodWasteKg')}
              placeholder="e.g. 1.5"
            />
            {fieldErrors['food.weeklyFoodWasteKg'] && (
              <span className={styles.errorMessage} role="alert">
                {fieldErrors['food.weeklyFoodWasteKg']}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      <button type="submit" className={styles.submitButton}>
        Calculate Footprint
      </button>
    </form>
  );
}
