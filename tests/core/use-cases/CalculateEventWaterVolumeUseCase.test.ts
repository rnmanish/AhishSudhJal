import { describe, it, expect } from 'vitest';
import { CalculateEventWaterVolumeUseCase } from '../../../src/core/use-cases/order/CalculateEventWaterVolumeUseCase';

describe('CalculateEventWaterVolumeUseCase', () => {
  const useCase = new CalculateEventWaterVolumeUseCase();

  it('calculates water volume for 100 guests in normal season', () => {
    const result = useCase.execute({ guestCount: 100, season: 'normal', durationHours: 4 });
    // 100 * 0.75 = 75L, +15% buffer = 11L -> 86L -> 5 jars (20L each)
    expect(result.estimatedLitres).toBeGreaterThanOrEqual(80);
    expect(result.recommended20LJars).toBe(5);
    expect(result.notesHi).toContain('कोई सिक्योरिटी डिपॉजिट नहीं');
  });

  it('adjusts consumption for summer weddings with higher intake', () => {
    const normal = useCase.execute({ guestCount: 200, season: 'normal' });
    const summer = useCase.execute({ guestCount: 200, season: 'summer' });

    expect(summer.estimatedLitres).toBeGreaterThan(normal.estimatedLitres);
    expect(summer.recommended20LJars).toBeGreaterThan(normal.recommended20LJars);
  });

  it('rejects invalid guest counts', () => {
    expect(() => useCase.execute({ guestCount: 0 })).toThrow();
    expect(() => useCase.execute({ guestCount: -50 })).toThrow();
  });
});
