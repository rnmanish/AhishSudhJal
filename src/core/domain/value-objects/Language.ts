export type SupportedLanguage = 'hi' | 'en';

export class Language {
  private readonly code: SupportedLanguage;

  constructor(code: string) {
    if (code !== 'hi' && code !== 'en') {
      throw new Error(`Unsupported language code: "${code}". Supported codes are 'hi' and 'en'.`);
    }
    this.code = code;
  }

  public static hindi(): Language {
    return new Language('hi');
  }

  public static english(): Language {
    return new Language('en');
  }

  public getCode(): SupportedLanguage {
    return this.code;
  }

  public isHindi(): boolean {
    return this.code === 'hi';
  }

  public isEnglish(): boolean {
    return this.code === 'en';
  }

  public toggle(): Language {
    return new Language(this.code === 'hi' ? 'en' : 'hi');
  }

  public getDisplayName(): string {
    return this.code === 'hi' ? 'हिन्दी' : 'English';
  }
}
