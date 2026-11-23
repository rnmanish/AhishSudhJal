import type {
  IPreferenceRepository,
  SavedCustomerDetails,
} from '../../core/domain/repositories/IPreferenceRepository';

export interface IStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface LocalStoragePreferenceOptions {
  readonly storage?: IStorageLike;
  readonly languageKey?: string;
  readonly customerDetailsKey?: string;
}

export class LocalStoragePreferenceRepository implements IPreferenceRepository {
  public static readonly DEFAULT_LANGUAGE_KEY = 'asj_lang';
  public static readonly DEFAULT_CUSTOMER_DETAILS_KEY = 'asj_customer_details';

  private readonly explicitStorage?: IStorageLike;
  private readonly languageKey: string;
  private readonly customerDetailsKey: string;

  constructor(options?: LocalStoragePreferenceOptions) {
    this.explicitStorage = options?.storage;
    this.languageKey = options?.languageKey ?? LocalStoragePreferenceRepository.DEFAULT_LANGUAGE_KEY;
    this.customerDetailsKey =
      options?.customerDetailsKey ??
      LocalStoragePreferenceRepository.DEFAULT_CUSTOMER_DETAILS_KEY;
  }

  public getLanguage(): string | null {
    const storage = this.resolveStorage();
    if (!storage) {
      return null;
    }

    try {
      const rawValue = storage.getItem(this.languageKey);
      if (!rawValue) {
        return null;
      }
      const normalized = rawValue.trim().toLowerCase();
      if (normalized === 'hi' || normalized === 'en') {
        return normalized;
      }
      return null;
    } catch {
      return null;
    }
  }

  public setLanguage(lang: string): void {
    if (!lang || typeof lang !== 'string') {
      throw new Error('Language code must be a non-empty string.');
    }

    const normalized = lang.trim().toLowerCase();
    if (normalized !== 'hi' && normalized !== 'en') {
      throw new Error(
        `Unsupported language code: "${lang}". Supported codes are 'hi' and 'en'.`
      );
    }

    const storage = this.resolveStorage();
    if (!storage) {
      return;
    }

    try {
      storage.setItem(this.languageKey, normalized);
    } catch {
      // Graceful fallback for quota exceeded or storage-restricted environments
    }
  }

  public getSavedCustomerDetails(): SavedCustomerDetails | null {
    const storage = this.resolveStorage();
    if (!storage) {
      return null;
    }

    try {
      const rawValue = storage.getItem(this.customerDetailsKey);
      if (!rawValue) {
        return null;
      }

      const parsed: unknown = JSON.parse(rawValue);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }

      const candidate = parsed as Record<string, unknown>;
      if (
        typeof candidate.customerName !== 'string' ||
        typeof candidate.customerPhone !== 'string' ||
        typeof candidate.villageId !== 'string' ||
        typeof candidate.landmark !== 'string'
      ) {
        return null;
      }

      return {
        customerName: candidate.customerName,
        customerPhone: candidate.customerPhone,
        villageId: candidate.villageId,
        landmark: candidate.landmark,
      };
    } catch {
      return null;
    }
  }

  public saveCustomerDetails(details: SavedCustomerDetails): void {
    if (!details || typeof details !== 'object' || Array.isArray(details)) {
      throw new Error('Customer details must be a non-null object.');
    }

    if (
      typeof details.customerName !== 'string' ||
      typeof details.customerPhone !== 'string' ||
      typeof details.villageId !== 'string' ||
      typeof details.landmark !== 'string'
    ) {
      throw new Error(
        'All customer details fields (customerName, customerPhone, villageId, landmark) must be strings.'
      );
    }

    const storage = this.resolveStorage();
    if (!storage) {
      return;
    }

    try {
      const payload = JSON.stringify({
        customerName: details.customerName.trim(),
        customerPhone: details.customerPhone.trim(),
        villageId: details.villageId.trim(),
        landmark: details.landmark.trim(),
      });
      storage.setItem(this.customerDetailsKey, payload);
    } catch {
      // Graceful fallback for quota exceeded or storage-restricted environments
    }
  }

  public clearCustomerDetails(): void {
    const storage = this.resolveStorage();
    if (!storage) {
      return;
    }

    try {
      storage.removeItem(this.customerDetailsKey);
    } catch {
      // Graceful fallback
    }
  }

  public clearPreferences(): void {
    const storage = this.resolveStorage();
    if (!storage) {
      return;
    }

    try {
      storage.removeItem(this.languageKey);
      storage.removeItem(this.customerDetailsKey);
    } catch {
      // Graceful fallback
    }
  }

  private resolveStorage(): IStorageLike | null {
    if (this.explicitStorage) {
      return this.explicitStorage;
    }

    if (typeof window === 'undefined') {
      return null;
    }

    try {
      if (typeof window.localStorage !== 'undefined') {
        return window.localStorage;
      }
    } catch {
      return null;
    }

    return null;
  }
}
