import { describe, it, expect } from 'vitest';
import { VillageCoverage } from '../../../src/core/domain/entities/VillageCoverage';

describe('VillageCoverage Entity', () => {
  const sarsarPlant = new VillageCoverage({
    id: 'sarsar',
    name: 'Sarsar',
    nameHindi: 'सरसर',
    pincode: '841226',
    distanceKm: 0,
    deliverySla: 'Within 30 Mins (Plant)',
    deliverySlaHindi: '30 मिनट के भीतर (प्लांट)',
    isPlantLocation: true,
  });

  const purainaVillage = new VillageCoverage({
    id: 'puraina',
    name: 'Puraina',
    nameHindi: 'पुरैना',
    pincode: '841226',
    distanceKm: 2.5,
    deliverySla: 'Within 1 Hour',
    deliverySlaHindi: '1 घंटे के भीतर',
  });

  it('correctly distinguishes plant location from neighboring villages', () => {
    expect(sarsarPlant.isPlantLocation()).toBe(true);
    expect(purainaVillage.isPlantLocation()).toBe(false);
  });

  it('returns localized names and turnaround SLAs', () => {
    expect(purainaVillage.getName('hi')).toBe('पुरैना');
    expect(purainaVillage.getName('en')).toBe('Puraina');
    expect(purainaVillage.getDeliverySla('hi')).toBe('1 घंटे के भीतर');
    expect(purainaVillage.getDeliverySla('en')).toBe('Within 1 Hour');
  });

  it('matches search queries across English name, Hindi name, and pincode', () => {
    expect(purainaVillage.matchesQuery('puraina')).toBe(true);
    expect(purainaVillage.matchesQuery('PURAINA')).toBe(true);
    expect(purainaVillage.matchesQuery('पुरैना')).toBe(true);
    expect(purainaVillage.matchesQuery('841226')).toBe(true);
    expect(purainaVillage.matchesQuery('Siwan')).toBe(false);
  });
});
