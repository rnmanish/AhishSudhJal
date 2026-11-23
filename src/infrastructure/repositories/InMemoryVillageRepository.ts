import type { IVillageRepository } from '../../core/domain/repositories/IVillageRepository';
import { VillageCoverage } from '../../core/domain/entities/VillageCoverage';
import type { VillageRecord } from '../config/villages.data';
import { VILLAGES } from '../config/villages.data';

export class InMemoryVillageRepository implements IVillageRepository {
  private readonly villages: readonly VillageCoverage[];

  constructor(data: readonly VillageRecord[] = VILLAGES) {
    this.villages = Object.freeze(
      data.map(
        (record) =>
          new VillageCoverage({
            id: record.id,
            name: record.name,
            nameHindi: record.nameHindi,
            pincode: record.pincode,
            distanceKm: record.distanceKm,
            deliverySla: record.deliverySla,
            deliverySlaHindi: record.deliverySlaHindi,
            isPlantLocation: record.isPlantLocation,
          })
      )
    );
  }

  public async getAll(): Promise<VillageCoverage[]> {
    return [...this.villages];
  }

  public async getById(id: string): Promise<VillageCoverage | null> {
    const cleanId = id.trim().toLowerCase();
    if (!cleanId) {
      return null;
    }
    const match = this.villages.find((v) => v.getId().toLowerCase() === cleanId);
    return match ?? null;
  }

  public async search(query: string): Promise<VillageCoverage[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return [];
    }
    return this.villages.filter((v) => v.matchesQuery(cleanQuery));
  }

  public async isServiceable(query: string): Promise<boolean> {
    const results = await this.search(query);
    return results.length > 0;
  }
}
