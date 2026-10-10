import { describe, it, expect } from 'vitest';
import { Language } from '../../../src/core/domain/value-objects/Language';

describe('Language Value Object', () => {
  it('initializes Hindi by default helper', () => {
    const lang = Language.hindi();
    expect(lang.getCode()).toBe('hi');
    expect(lang.isHindi()).toBe(true);
    expect(lang.isEnglish()).toBe(false);
    expect(lang.getDisplayName()).toBe('हिन्दी');
  });

  it('initializes English by helper', () => {
    const lang = Language.english();
    expect(lang.getCode()).toBe('en');
    expect(lang.isEnglish()).toBe(true);
    expect(lang.isHindi()).toBe(false);
    expect(lang.getDisplayName()).toBe('English');
  });

  it('toggles seamlessly between Hindi and English', () => {
    const lang = Language.hindi();
    const toggled = lang.toggle();
    expect(toggled.isEnglish()).toBe(true);
    const toggledBack = toggled.toggle();
    expect(toggledBack.isHindi()).toBe(true);
  });

  it('rejects unsupported language codes', () => {
    expect(() => new Language('fr')).toThrow(/Unsupported language code/);
    expect(() => new Language('es')).toThrow(/Unsupported language code/);
  });
});
