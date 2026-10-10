import { TdsReading } from '../../domain/value-objects/TdsReading';
import type { TdsClassification } from '../../domain/value-objects/TdsReading';


export type WaterSourceType = 'chapakal' | 'submersible' | 'nal_jal' | 'tanker';

export interface TdsQualityAnalysisResult {
  ppm: number;
  classification: TdsClassification;
  sourceContextEn?: string;
  sourceContextHi?: string;
}

export class CalculateTdsQualityUseCase {
  public execute(ppm: number, source?: WaterSourceType): TdsQualityAnalysisResult {
    const reading = new TdsReading(ppm);
    const classification = reading.getClassification();

    let sourceContextEn: string | undefined;
    let sourceContextHi: string | undefined;

    if (source === 'chapakal') {
      sourceContextEn = 'Handpumps (Chapakal) in Siwan often draw shallow groundwater with heavy iron and seasonal impurities.';
      sourceContextHi = 'सिवान में चापाकल का पानी उथले जलस्तर से आता है, जिसमें आयरन और मौसमी अशुद्धियों की संभावना अधिक होती है।';
    } else if (source === 'submersible') {
      sourceContextEn = 'Submersible bores draw deeper water, but high TDS indicates dissolved minerals and calcium hardness.';
      sourceContextHi = 'सबमर्सिबल का पानी गहरे स्तर से आता है, लेकिन उच्च टीडीएस इसमें घुले खनिजों और कठोरता को दर्शाता है।';
    } else if (source === 'nal_jal') {
      sourceContextEn = 'Nal-Jal piped water varies by village supply. Ensure TDS is within 50–150 for safe family drinking.';
      sourceContextHi = 'नल-जल योजना का पानी गाँव की आपूर्ति पर निर्भर करता है। परिवार के स्वास्थ्य हेतु टीडीएस 50-150 के बीच होना चाहिए।';
    } else if (source === 'tanker') {
      sourceContextEn = 'Tanker water source is unverified. Double-stage purification is recommended before direct consumption.';
      sourceContextHi = 'टैंकर के पानी का स्रोत असत्यापित होता है। सीधे पीने से पहले इसका शुद्धिकरण अत्यंत आवश्यक है।';
    }

    return {
      ppm: reading.getPpm(),
      classification,
      sourceContextEn,
      sourceContextHi,
    };
  }
}
