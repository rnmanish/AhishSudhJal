import type { VillageCoverage } from '../entities/VillageCoverage';

export interface IVillageRepository {
  getAll(): Promise<VillageCoverage[]>;
  getById(id: string): Promise<VillageCoverage | null>;
  search(query: string): Promise<VillageCoverage[]>;
  isServiceable(query: string): Promise<boolean>;
}
