import { describe, it, expect } from 'vitest';
import { ValidateVillageServiceabilityUseCase } from '../../../src/core/use-cases/serviceability/ValidateVillageServiceabilityUseCase';
import type { IVillageRepository } from '../../../src/core/domain/repositories/IVillageRepository';
import { VillageCoverage } from '../../../src/core/domain/entities/VillageCoverage';

class MockVillageRepository implements IVillageRepository {
  private villages: VillageCoverage[] = [
    new VillageCoverage({
      id: 'puraina',
      name: 'Puraina',
      nameHindi: 'पुरैना',
      pincode: '841226',
      distanceKm: 2.5,
      deliverySla: 'Within 1 Hour',
      deliverySlaHindi: '1 घंटे के भीतर',
    }),
    new VillageCoverage({
      id: 'sarsar',
      name: 'Sarsar',
      nameHindi: 'सरसर',
      pincode: '841226',
      distanceKm: 0,
      deliverySla: 'Within 30 Mins (Plant)',
      deliverySlaHindi: '30 मिनट के भीतर (प्लांट)',
      isPlantLocation: true,
    }),
  ];

  async getAll(): Promise<VillageCoverage[]> {
    return this.villages;
  }

  async getById(id: string): Promise<VillageCoverage | null> {
    return this.villages.find((v) => v.getId() === id) ?? null;
  }

  async search(query: string): Promise<VillageCoverage[]> {
    return this.villages.filter((v) => v.matchesQuery(query));
  }

  async isServiceable(query: string): Promise<boolean> {
    const results = await this.search(query);
    return results.length > 0;
  }
}

describe('ValidateVillageServiceabilityUseCase', () => {
  const repo = new MockVillageRepository();
  const useCase = new ValidateVillageServiceabilityUseCase(repo);

  it('validates serviceable village by English name', async () => {
    const result = await useCase.execute('Puraina');
    expect(result.isServiceable).toBe(true);
    expect(result.village?.getId()).toBe('puraina');
    expect(result.deliverySlaEn).toBe('Within 1 Hour');
  });

  it('validates serviceable village by Hindi name', async () => {
    const result = await useCase.execute('सरसर');
    expect(result.isServiceable).toBe(true);
    expect(result.village?.getId()).toBe('sarsar');
    expect(result.village?.isPlantLocation()).toBe(true);
  });

  it('returns unserviceable for outside location', async () => {
    const result = await useCase.execute('Patna');
    expect(result.isServiceable).toBe(false);
    expect(result.village).toBeNull();
    expect(result.messageHi).toContain('वर्तमान में इस गाँव में सीधी डिलीवरी उपलब्ध नहीं है');
  });

  it('handles empty query gracefully', async () => {
    const result = await useCase.execute('   ');
    expect(result.isServiceable).toBe(false);
    expect(result.messageEn).toContain('Please enter your village name');
  });
});
