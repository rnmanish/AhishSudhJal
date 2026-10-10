export class Money {
  private readonly amountInRupees: number;

  constructor(amountInRupees: number) {
    if (!Number.isFinite(amountInRupees) || amountInRupees < 0) {
      throw new Error(`Invalid monetary amount: ${amountInRupees}. Amount must be a non-negative number.`);
    }
    this.amountInRupees = amountInRupees;
  }

  public static zero(): Money {
    return new Money(0);
  }

  public static fromRupees(rupees: number): Money {
    return new Money(rupees);
  }

  public getAmount(): number {
    return this.amountInRupees;
  }

  public add(other: Money): Money {
    return new Money(this.amountInRupees + other.amountInRupees);
  }

  public subtract(other: Money): Money {
    const result = this.amountInRupees - other.amountInRupees;
    if (result < 0) {
      throw new Error(`Monetary subtract resulted in negative amount: ${result}`);
    }
    return new Money(result);
  }

  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor cannot be negative');
    }
    return new Money(this.amountInRupees * factor);
  }

  public format(currencySymbol = '₹'): string {
    return `${currencySymbol}${this.amountInRupees.toLocaleString('en-IN')}`;
  }

  public isZero(): boolean {
    return this.amountInRupees === 0;
  }
}
