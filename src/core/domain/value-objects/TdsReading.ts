export type TdsGrade = 'LOW_MINERAL' | 'IDEAL' | 'ACCEPTABLE' | 'HARD' | 'POOR';

export interface TdsClassification {
  grade: TdsGrade;
  labelEn: string;
  labelHi: string;
  descriptionEn: string;
  descriptionHi: string;
  colorHex: string;
  isSafe: boolean;
  actionRequiredEn: string;
  actionRequiredHi: string;
}

export class TdsReading {
  private readonly ppm: number;

  constructor(ppm: number) {
    if (!Number.isFinite(ppm) || ppm < 0) {
      throw new Error(`Invalid TDS reading: ${ppm}. PPM must be a non-negative number.`);
    }
    this.ppm = Math.round(ppm);
  }

  public getPpm(): number {
    return this.ppm;
  }

  public getClassification(): TdsClassification {
    if (this.ppm < 50) {
      return {
        grade: 'LOW_MINERAL',
        labelEn: 'Low Mineral Water',
        labelHi: 'कम खनिज युक्त पानी',
        descriptionEn: 'Lacks essential minerals. Micro-filtered but lacks natural salts.',
        descriptionHi: 'आवश्यक खनिजों की कमी। माइक्रो-फिल्टर लेकिन प्राकृतिक लवण कम हैं।',
        colorHex: '#38bdf8', // sky blue
        isSafe: true,
        actionRequiredEn: 'Safe, but mineralization recommended for long term use.',
        actionRequiredHi: 'सुरक्षित, लेकिन लंबे समय के लिए मिनरल्स जरूरी हैं।'
      };
    }
    if (this.ppm <= 150) {
      return {
        grade: 'IDEAL',
        labelEn: 'Ideal RO Drinking Water',
        labelHi: 'सर्वश्रेष्ठ आरओ शुद्ध पानी',
        descriptionEn: 'Optimal sweet taste and mineral balance. Standard quality delivered by Ashish Sudh Jal.',
        descriptionHi: 'उत्कृष्ट मीठा स्वाद और संतुलित मिनरल्स। आशीष शुद्ध जल द्वारा प्रदान की जाने वाली मानक गुणवत्ता।',
        colorHex: '#10b981', // emerald green
        isSafe: true,
        actionRequiredEn: 'Best quality for daily family consumption.',
        actionRequiredHi: 'दैनिक पारिवारिक उपयोग के लिए सर्वोत्तम गुणवत्ता।'
      };
    }
    if (this.ppm <= 300) {
      return {
        grade: 'ACCEPTABLE',
        labelEn: 'Good Drinking Water',
        labelHi: 'अच्छा पेयजल',
        descriptionEn: 'Acceptable mineral content. Safe for drinking.',
        descriptionHi: 'स्वीकार्य खनिज स्तर। पीने के लिए सुरक्षित।',
        colorHex: '#06b6d4', // cyan
        isSafe: true,
        actionRequiredEn: 'Acceptable drinking quality.',
        actionRequiredHi: 'पीने योग्य गुणवत्ता।'
      };
    }
    if (this.ppm <= 500) {
      return {
        grade: 'HARD',
        labelEn: 'Hard / High Minerals',
        labelHi: 'कठोर / अधिक खनिज वाला पानी',
        descriptionEn: 'Noticeable heavy taste, scaling on boiling utensils. Heavy for digestion.',
        descriptionHi: 'स्वाद भारी, उबालने पर बर्तनों पर सफेद परत। पाचन के लिए भारी।',
        colorHex: '#f59e0b', // amber
        isSafe: false,
        actionRequiredEn: 'RO purification strongly recommended.',
        actionRequiredHi: 'आरओ शुद्धिकरण की दृढ़ता से सलाह दी जाती है।'
      };
    }
    return {
      grade: 'POOR',
      labelEn: 'Unsafe / High Contamination',
      labelHi: 'असुरक्षित / अत्यधिक दूषित पानी',
      descriptionEn: 'Unsafe for direct drinking. High dissolved solids, risk of stomach ailments.',
      descriptionHi: 'सीधे पीने के लिए अनुपयुक्त। उच्च घुलित ठोस पदार्थ, पेट संबंधी बीमारियों का जोखिम।',
      colorHex: '#ef4444', // red
      isSafe: false,
      actionRequiredEn: 'Immediate RO purification required before consumption.',
      actionRequiredHi: 'पीने से पहले तुरंत आरओ शुद्धिकरण अनिवार्य है।'
    };
  }

  public isSafe(): boolean {
    return this.ppm <= 300;
  }
}
