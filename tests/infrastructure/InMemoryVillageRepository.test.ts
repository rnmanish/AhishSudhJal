import { describe, it, expect } from 'vitest';
import { InMemoryVillageRepository } from '../../src/infrastructure/repositories/InMemoryVillageRepository';
import { VILLAGES } from '../../src/infrastructure/config/villages.data';
import type { VillageRecord } from '../../src/infrastructure/config/villages.data';

describe('InMemoryVillageRepository', () => {
  it('should initialize with all 15 Siwan villages from centralized dataset by default', async () => {
    const repository = new InMemoryVillageRepository();
    const villages = await repository.getAll();

    expect(villages).toHaveLength(15);
    expect(VILLAGES).toHaveLength(15);
  });

  it('should accurately represent each of the 15 Siwan villages with correct SLAs and distances', async () => {
    const repository = new InMemoryVillageRepository();

    const expectedVillages: Array<{
      id: string;
      nameEn: string;
      nameHi: string;
      pincode: string;
      distanceKm: number;
      slaEn: string;
      slaHi: string;
      isPlant?: boolean;
    }> = [
      {
        id: 'sarsar',
        nameEn: 'Sarsar',
        nameHi: 'सरसर',
        pincode: '841226',
        distanceKm: 0,
        slaEn: 'Within 30 Mins (Plant)',
        slaHi: '30 मिनट के भीतर (प्लांट)',
        isPlant: true,
      },
      {
        id: 'puraina',
        nameEn: 'Puraina',
        nameHi: 'पुरैना',
        pincode: '841226',
        distanceKm: 2.5,
        slaEn: 'Within 1 Hour',
        slaHi: '1 घंटे के भीतर',
      },
      {
        id: 'chhap',
        nameEn: 'Chhap',
        nameHi: 'छाप',
        pincode: '841XXX',
        distanceKm: 3.0,
        slaEn: 'Within 1 Hour',
        slaHi: '1 घंटे के भीतर',
      },
      {
        id: 'nathu-chhap',
        nameEn: 'Nathu Chhap',
        nameHi: 'नत्थू छाप',
        pincode: '841XXX',
        distanceKm: 3.5,
        slaEn: 'Within 1-2 Hours',
        slaHi: '1-2 घंटे के भीतर',
      },
      {
        id: 'mohammadpur',
        nameEn: 'MohammadPur',
        nameHi: 'मोहम्मदपुर',
        pincode: '841XXX',
        distanceKm: 4.0,
        slaEn: 'Within 1-2 Hours',
        slaHi: '1-2 घंटे के भीतर',
      },
      {
        id: 'mirapur',
        nameEn: 'Mirapur',
        nameHi: 'मीरापुर',
        pincode: '841XXX',
        distanceKm: 3.8,
        slaEn: 'Within 1-2 Hours',
        slaHi: '1-2 घंटे के भीतर',
      },
      {
        id: 'batrauli',
        nameEn: 'Batrauli',
        nameHi: 'बतरौली',
        pincode: '841XXX',
        distanceKm: 4.2,
        slaEn: 'Within 1-2 Hours',
        slaHi: '1-2 घंटे के भीतर',
      },
      {
        id: 'bishunpur',
        nameEn: 'Bishunpur',
        nameHi: 'विशुनपुर',
        pincode: '841XXX',
        distanceKm: 5.0,
        slaEn: 'Within 2 Hours',
        slaHi: '2 घंटे के भीतर',
      },
      {
        id: 'amlori',
        nameEn: 'Amlori',
        nameHi: 'अमलोरी',
        pincode: '841XXX',
        distanceKm: 4.5,
        slaEn: 'Within 1-2 Hours',
        slaHi: '1-2 घंटे के भीतर',
      },
      {
        id: 'bansopali',
        nameEn: 'Bansopali',
        nameHi: 'बांसोपाली',
        pincode: '841XXX',
        distanceKm: 5.2,
        slaEn: 'Within 2 Hours',
        slaHi: '2 घंटे के भीतर',
      },
      {
        id: 'karanpura',
        nameEn: 'Karanpura',
        nameHi: 'करणपुरा',
        pincode: '841XXX',
        distanceKm: 3.2,
        slaEn: 'Within 1 Hour',
        slaHi: '1 घंटे के भीतर',
      },
      {
        id: 'jafra',
        nameEn: 'Jafra',
        nameHi: 'जाफरा',
        pincode: '841XXX',
        distanceKm: 6.0,
        slaEn: 'Within 2 Hours',
        slaHi: '2 घंटे के भीतर',
      },
      {
        id: 'pararia',
        nameEn: 'Pararia',
        nameHi: 'पररिया',
        pincode: '841XXX',
        distanceKm: 5.8,
        slaEn: 'Within 2 Hours',
        slaHi: '2 घंटे के भीतर',
      },
      {
        id: 'majhwa',
        nameEn: 'Majhwa',
        nameHi: 'मझवा',
        pincode: '841XXX',
        distanceKm: 6.5,
        slaEn: 'Within 2 Hours',
        slaHi: '2 घंटे के भीतर',
      },
      {
        id: 'bishunpurwa',
        nameEn: 'Bishunpurwa',
        nameHi: 'विशुनपुरवा',
        pincode: '841XXX',
        distanceKm: 7.0,
        slaEn: 'Within 2-3 Hours',
        slaHi: '2-3 घंटे के भीतर',
      },
    ];

    for (const expected of expectedVillages) {
      const village = await repository.getById(expected.id);
      expect(village).not.toBeNull();
      expect(village?.getId()).toBe(expected.id);
      expect(village?.getName('en')).toBe(expected.nameEn);
      expect(village?.getName('hi')).toBe(expected.nameHi);
      expect(village?.getPincode()).toBe(expected.pincode);
      expect(village?.getDistanceKm()).toBe(expected.distanceKm);
      expect(village?.getDeliverySla('en')).toBe(expected.slaEn);
      expect(village?.getDeliverySla('hi')).toBe(expected.slaHi);
      expect(village?.isPlantLocation()).toBe(Boolean(expected.isPlant));
    }
  });

  it('should find village by ID case-insensitively and return null when not found', async () => {
    const repository = new InMemoryVillageRepository();

    const villageUpper = await repository.getById('PURAINA');
    expect(villageUpper).not.toBeNull();
    expect(villageUpper?.getId()).toBe('puraina');

    const villageMixed = await repository.getById('  Sarsar  ');
    expect(villageMixed).not.toBeNull();
    expect(villageMixed?.getId()).toBe('sarsar');

    const notFound = await repository.getById('non-existent-village');
    expect(notFound).toBeNull();

    const emptyId = await repository.getById('   ');
    expect(emptyId).toBeNull();
  });

  it('should search villages by English name, Hindi name, and pincode', async () => {
    const repository = new InMemoryVillageRepository();

    const byEnglish = await repository.search('Puraina');
    expect(byEnglish).toHaveLength(1);
    expect(byEnglish[0].getId()).toBe('puraina');

    const byHindi = await repository.search('पुरैना');
    expect(byHindi).toHaveLength(1);
    expect(byHindi[0].getId()).toBe('puraina');

    const byPincode = await repository.search('841226');
    // Sarsar and Puraina both share pincode 841226
    expect(byPincode.length).toBeGreaterThanOrEqual(2);
    const ids = byPincode.map((v) => v.getId());
    expect(ids).toContain('sarsar');
    expect(ids).toContain('puraina');

    const partialEnglish = await repository.search('chhap');
    // Matches 'chhap' and 'nathu-chhap'
    expect(partialEnglish.length).toBe(2);

    const emptySearch = await repository.search('   ');
    expect(emptySearch).toEqual([]);
  });

  it('should verify serviceability correctly for served and unserved locations', async () => {
    const repository = new InMemoryVillageRepository();

    // Served locations (acceptance criteria: Puraina returns true)
    expect(await repository.isServiceable('Puraina')).toBe(true);
    expect(await repository.isServiceable('पुरैना')).toBe(true);
    expect(await repository.isServiceable('sarsar')).toBe(true);
    expect(await repository.isServiceable('841226')).toBe(true);
    expect(await repository.isServiceable('Batrauli')).toBe(true);

    // Unserved locations (acceptance criteria: Patna returns false)
    expect(await repository.isServiceable('Patna')).toBe(false);
    expect(await repository.isServiceable('Delhi')).toBe(false);
    expect(await repository.isServiceable('Siwan City')).toBe(false);
    expect(await repository.isServiceable('')).toBe(false);
    expect(await repository.isServiceable('   ')).toBe(false);
  });

  it('should support injecting custom datasets for test isolation', async () => {
    const mockData: VillageRecord[] = [
      {
        id: 'test-village',
        name: 'Test Village',
        nameHindi: 'टेस्ट गाँव',
        pincode: '841001',
        distanceKm: 1.0,
        deliverySla: 'Within 45 Mins',
        deliverySlaHindi: '45 मिनट के भीतर',
      },
    ];

    const customRepo = new InMemoryVillageRepository(mockData);
    const all = await customRepo.getAll();

    expect(all).toHaveLength(1);
    expect(all[0].getId()).toBe('test-village');
    expect(await customRepo.isServiceable('test-village')).toBe(true);
    expect(await customRepo.isServiceable('Puraina')).toBe(false);
  });

  it('should maintain immutability when getAll() is called', async () => {
    const repository = new InMemoryVillageRepository();
    const villages = await repository.getAll();

    // Mutating the returned array should not affect subsequent calls
    villages.pop();
    expect(villages).toHaveLength(14);

    const freshVillages = await repository.getAll();
    expect(freshVillages).toHaveLength(15);
  });
});
