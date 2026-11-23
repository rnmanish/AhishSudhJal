'use client';

import { useCallback, useMemo, useState } from 'react';
import type { TdsClassification, TdsGrade } from '../../core/domain/value-objects/TdsReading';
import type {
  TdsQualityAnalysisResult,
  WaterSourceType,
} from '../../core/use-cases/tds/CalculateTdsQualityUseCase';
import { CalculateTdsQualityUseCase } from '../../core/use-cases/tds/CalculateTdsQualityUseCase';
import { useLanguage } from '../i18n/useLanguage';

export interface TdsPresetOption {
  readonly ppm: number;
  readonly labelEn: string;
  readonly labelHi: string;
}

export const TDS_PRESETS: readonly TdsPresetOption[] = [
  { ppm: 40, labelEn: '40 PPM (Low Mineral)', labelHi: '40 PPM (कम खनिज)' },
  { ppm: 120, labelEn: '120 PPM (Ideal RO)', labelHi: '120 PPM (आदर्श आरओ)' },
  { ppm: 220, labelEn: '220 PPM (Good Water)', labelHi: '220 PPM (अच्छा पेयजल)' },
  { ppm: 420, labelEn: '420 PPM (Hard Water)', labelHi: '420 PPM (कठोर पानी)' },
  { ppm: 750, labelEn: '750 PPM (Unsafe)', labelHi: '750 PPM (अत्यधिक दूषित)' },
];

export const DEFAULT_TDS_PPM = 120;
export const MIN_TDS_PPM = 0;
export const MAX_TDS_PPM = 1000;

export interface UseTdsAnalyzerOptions {
  readonly initialPpm?: number;
  readonly initialSource?: WaterSourceType;
  readonly useCase?: CalculateTdsQualityUseCase;
}

export interface UseTdsAnalyzerReturn {
  readonly ppm: number;
  readonly setPpm: (nextPpm: number) => void;
  readonly source: WaterSourceType | undefined;
  readonly setSource: (nextSource: WaterSourceType | undefined) => void;
  readonly analysisResult: TdsQualityAnalysisResult;
  readonly classification: TdsClassification;
  readonly isSafe: boolean;
  readonly activeGrade: TdsGrade;
  readonly sourceContext: string | undefined;
  readonly statusLabel: string;
  readonly statusDescription: string;
  readonly actionRequired: string;
  readonly colorHex: string;
  readonly reset: () => void;
  readonly presets: readonly TdsPresetOption[];
}

/**
 * Normalizes input PPM values to ensure non-negative finite bounds.
 */
function sanitizePpm(rawPpmInput: number): number {
  if (!Number.isFinite(rawPpmInput) || rawPpmInput < MIN_TDS_PPM) {
    return MIN_TDS_PPM;
  }
  return Math.min(Math.round(rawPpmInput), MAX_TDS_PPM);
}

/**
 * Custom React hook (Layer 3 Interface Adapter / Presenter)
 * Coordinates TDS water quality analysis and provides reactive state for the TDS analyzer UI.
 */
export function useTdsAnalyzer(options?: UseTdsAnalyzerOptions): UseTdsAnalyzerReturn {
  const { isHindi } = useLanguage();

  const initialPpmValue = useMemo(() => {
    if (typeof options?.initialPpm === 'number') {
      return sanitizePpm(options.initialPpm);
    }
    return DEFAULT_TDS_PPM;
  }, [options?.initialPpm]);

  const [currentPpm, setCurrentPpmState] = useState<number>(initialPpmValue);
  const [currentSource, setCurrentSourceState] = useState<WaterSourceType | undefined>(
    options?.initialSource
  );

  const activeUseCase = useMemo(() => {
    return options?.useCase ?? new CalculateTdsQualityUseCase();
  }, [options?.useCase]);

  const analysisResult = useMemo<TdsQualityAnalysisResult>(() => {
    return activeUseCase.execute(currentPpm, currentSource);
  }, [activeUseCase, currentPpm, currentSource]);

  const handleSetPpm = useCallback((nextPpmInput: number) => {
    setCurrentPpmState(sanitizePpm(nextPpmInput));
  }, []);

  const handleSetSource = useCallback((nextSourceInput: WaterSourceType | undefined) => {
    setCurrentSourceState(nextSourceInput);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentPpmState(initialPpmValue);
    setCurrentSourceState(options?.initialSource);
  }, [initialPpmValue, options?.initialSource]);

  const classification = analysisResult.classification;
  const isSafe = classification.isSafe;
  const activeGrade = classification.grade;
  const colorHex = classification.colorHex;

  const sourceContext = useMemo(() => {
    if (isHindi) {
      return analysisResult.sourceContextHi;
    }
    return analysisResult.sourceContextEn;
  }, [isHindi, analysisResult.sourceContextHi, analysisResult.sourceContextEn]);

  const statusLabel = useMemo(() => {
    if (isHindi) {
      return classification.labelHi;
    }
    return classification.labelEn;
  }, [isHindi, classification.labelHi, classification.labelEn]);

  const statusDescription = useMemo(() => {
    if (isHindi) {
      return classification.descriptionHi;
    }
    return classification.descriptionEn;
  }, [isHindi, classification.descriptionHi, classification.descriptionEn]);

  const actionRequired = useMemo(() => {
    if (isHindi) {
      return classification.actionRequiredHi;
    }
    return classification.actionRequiredEn;
  }, [isHindi, classification.actionRequiredHi, classification.actionRequiredEn]);

  return {
    ppm: currentPpm,
    setPpm: handleSetPpm,
    source: currentSource,
    setSource: handleSetSource,
    analysisResult,
    classification,
    isSafe,
    activeGrade,
    sourceContext,
    statusLabel,
    statusDescription,
    actionRequired,
    colorHex,
    reset: handleReset,
    presets: TDS_PRESETS,
  };
}
