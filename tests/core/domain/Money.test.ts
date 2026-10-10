import { describe, it, expect } from 'vitest';
import { Money } from '../../../src/core/domain/value-objects/Money';

describe('Money Value Object', () => {
  it('throws on negative values', () => {
    expect(() => new Money(-10)).toThrow();
  });

  it('performs arithmetic operations correctly', () => {
    const m30 = Money.fromRupees(30);
    const m25 = Money.fromRupees(25);

    expect(m30.getAmount()).toBe(30);
    expect(m30.add(m25).getAmount()).toBe(55);
    expect(m30.subtract(m25).getAmount()).toBe(5);
    expect(m30.multiply(4).getAmount()).toBe(120);
    expect(m30.format()).toBe('₹30');
  });

  it('prevents negative balances on subtraction', () => {
    const m10 = Money.fromRupees(10);
    const m20 = Money.fromRupees(20);
    expect(() => m10.subtract(m20)).toThrow();
  });
});
