import type { IVillageRepository } from '../../domain/repositories/IVillageRepository';
import type { VillageCoverage } from '../../domain/entities/VillageCoverage';

export interface ServiceabilityResult {
  isServiceable: boolean;
  village: VillageCoverage | null;
  messageHi: string;
  messageEn: string;
  deliverySlaHi?: string;
  deliverySlaEn?: string;
}

export class ValidateVillageServiceabilityUseCase {
  constructor(private readonly villageRepo: IVillageRepository) {}

  public async execute(query: string): Promise<ServiceabilityResult> {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        isServiceable: false,
        village: null,
        messageHi: 'कृपया अपने गाँव का नाम या पिनकोड दर्ज करें।',
        messageEn: 'Please enter your village name or pincode.',
      };
    }

    const matches = await this.villageRepo.search(trimmed);
    const matchedVillage = matches.length > 0 ? matches[0] : null;

    if (matchedVillage) {
      return {
        isServiceable: true,
        village: matchedVillage,
        messageHi: `बधाई! ${matchedVillage.getName('hi')} में डिलीवरी उपलब्ध है।`,
        messageEn: `Great news! Ashish Sudh Jal delivers to ${matchedVillage.getName('en')}.`,
        deliverySlaHi: matchedVillage.getDeliverySla('hi'),
        deliverySlaEn: matchedVillage.getDeliverySla('en'),
      };
    }

    return {
      isServiceable: false,
      village: null,
      messageHi: 'वर्तमान में इस गाँव में सीधी डिलीवरी उपलब्ध नहीं है। हम जल्द विस्तार कर रहे हैं!',
      messageEn: 'Direct delivery is not yet available in this area. We are expanding soon!',
    };
  }
}
