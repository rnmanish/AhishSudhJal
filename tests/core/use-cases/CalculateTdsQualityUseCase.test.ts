import { describe, it, expect } from 'vitest';
import { CalculateTdsQualityUseCase } from '../../../src/core/use-cases/tds/CalculateTdsQualityUseCase';

describe('CalculateTdsQualityUseCase', () => {
  const useCase = new CalculateTdsQualityUseCase();

  it('evaluates ideal TDS reading and provides source context', () => {
    const result = useCase.execute(110, 'chapakal');
    expect(result.ppm).toBe(110);
    expect(result.classification.grade).toBe('IDEAL');
    expect(result.classification.isSafe).toBe(true);
    expect(result.sourceContextHi).toContain('चापाकल');
  });

  it('evaluates poor water source and advises purification', () => {
    const result = useCase.execute(650, 'submersible');
    expect(result.classification.grade).toBe('POOR');
    expect(result.classification.isSafe).toBe(false);
    expect(result.sourceContextEn).toContain('Submersible');
  });
});
