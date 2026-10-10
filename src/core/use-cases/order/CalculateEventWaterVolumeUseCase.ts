export type EventSeason = 'summer' | 'winter' | 'normal';

export interface EventWaterVolumeInput {
  guestCount: number;
  durationHours?: number;
  season?: EventSeason;
}

export interface EventWaterVolumeEstimate {
  guestCount: number;
  estimatedLitres: number;
  recommended20LJars: number;
  recommendedCartons250ml: number; // 24 bottles per carton
  bufferLitres: number;
  notesHi: string;
  notesEn: string;
}

export class CalculateEventWaterVolumeUseCase {
  public execute(input: EventWaterVolumeInput): EventWaterVolumeEstimate {
    const { guestCount, durationHours = 4, season = 'normal' } = input;

    if (guestCount <= 0) {
      throw new Error('Guest count must be greater than zero.');
    }

    // Base consumption in litres per guest
    let litresPerGuest = 0.75;
    if (season === 'summer') {
      litresPerGuest = 1.25;
    } else if (season === 'winter') {
      litresPerGuest = 0.5;
    }

    // Extended event adjustment (> 5 hours)
    if (durationHours > 5) {
      litresPerGuest *= 1.2;
    }

    const rawLitres = guestCount * litresPerGuest;
    // Add 15% safety buffer for spills/food prep
    const bufferLitres = Math.round(rawLitres * 0.15);
    const estimatedLitres = Math.round(rawLitres + bufferLitres);

    // 20L jars needed (ceil)
    const recommended20LJars = Math.max(1, Math.ceil(estimatedLitres / 20));

    // Cartons of 250ml bottles (approx 24 bottles = 6L per carton)
    const recommendedCartons250ml = Math.ceil(guestCount / 24);

    return {
      guestCount,
      estimatedLitres,
      recommended20LJars,
      recommendedCartons250ml,
      bufferLitres,
      notesHi: `अनुमानित कुल पानी: ${estimatedLitres} लीटर (${recommended20LJars} जार)। शादियों और आयोजनों के लिए जार या डिस्पेंसर पर कोई सिक्योरिटी डिपॉजिट नहीं लिया जाता है।`,
      notesEn: `Estimated Total Water: ${estimatedLitres} Litres (~${recommended20LJars} Jars). Note: Zero deposit is charged for events on jars or dispensers.`,
    };
  }
}
