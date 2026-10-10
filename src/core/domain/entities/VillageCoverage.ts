export interface VillageCoverageProps {
  id: string;
  name: string;
  nameHindi: string;
  pincode: string;
  distanceKm: number;
  deliverySla: string;
  deliverySlaHindi: string;
  isPlantLocation?: boolean;
}

export class VillageCoverage {
  constructor(private readonly props: VillageCoverageProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getName(lang: 'hi' | 'en' = 'hi'): string {
    return lang === 'hi' ? this.props.nameHindi : this.props.name;
  }

  public getPincode(): string {
    return this.props.pincode;
  }

  public getDistanceKm(): number {
    return this.props.distanceKm;
  }

  public getDeliverySla(lang: 'hi' | 'en' = 'hi'): string {
    return lang === 'hi' ? this.props.deliverySlaHindi : this.props.deliverySla;
  }

  public isPlantLocation(): boolean {
    return Boolean(this.props.isPlantLocation);
  }

  public matchesQuery(query: string): boolean {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return false;
    }
    return (
      this.props.name.toLowerCase().includes(clean) ||
      this.props.nameHindi.includes(clean) ||
      this.props.pincode.includes(clean) ||
      this.props.id.toLowerCase().includes(clean)
    );
  }
}
