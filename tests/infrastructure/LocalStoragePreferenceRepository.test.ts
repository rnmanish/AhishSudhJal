import { describe, it, expect, beforeEach } from 'vitest';
import type {
  SavedCustomerDetails,
} from '../../src/core/domain/repositories/IPreferenceRepository';
import type { IStorageLike } from '../../src/infrastructure/repositories/LocalStoragePreferenceRepository';
import { LocalStoragePreferenceRepository } from '../../src/infrastructure/repositories/LocalStoragePreferenceRepository';

class MockStorage implements IStorageLike {
  private readonly store = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public rawDump(): Record<string, string> {
    return Object.fromEntries(this.store.entries());
  }
}

describe('LocalStoragePreferenceRepository', () => {
  let mockStorage: MockStorage;
  let repository: LocalStoragePreferenceRepository;

  const validCustomer: SavedCustomerDetails = {
    customerName: 'Rajesh Kumar',
    customerPhone: '9876543210',
    villageId: 'puraina',
    landmark: 'Near Kali Mandir',
  };

  beforeEach(() => {
    mockStorage = new MockStorage();
    repository = new LocalStoragePreferenceRepository({ storage: mockStorage });
  });

  describe('Static Constants', () => {
    it('should expose default storage key constants', () => {
      expect(LocalStoragePreferenceRepository.DEFAULT_LANGUAGE_KEY).toBe('asj_lang');
      expect(LocalStoragePreferenceRepository.DEFAULT_CUSTOMER_DETAILS_KEY).toBe('asj_customer_details');
    });
  });

  describe('Language Preference Management', () => {
    it('should return null when no language is stored', () => {
      expect(repository.getLanguage()).toBeNull();
    });

    it('should store and retrieve "hi" language preference', () => {
      repository.setLanguage('hi');
      expect(repository.getLanguage()).toBe('hi');
      expect(mockStorage.getItem('asj_lang')).toBe('hi');
    });

    it('should store and retrieve "en" language preference', () => {
      repository.setLanguage('en');
      expect(repository.getLanguage()).toBe('en');
      expect(mockStorage.getItem('asj_lang')).toBe('en');
    });

    it('should normalize uppercase and whitespace in language code', () => {
      repository.setLanguage('  HI  ');
      expect(repository.getLanguage()).toBe('hi');

      repository.setLanguage(' EN ');
      expect(repository.getLanguage()).toBe('en');
    });

    it('should throw an error for unsupported language codes', () => {
      expect(() => repository.setLanguage('es')).toThrowError(
        /Unsupported language code: "es"/
      );
      expect(() => repository.setLanguage('fr')).toThrowError(
        /Unsupported language code: "fr"/
      );
      expect(() => repository.setLanguage('')).toThrowError(
        /Language code must be a non-empty string/
      );
    });

    it('should return null if the underlying storage contains corrupted/unsupported language', () => {
      mockStorage.setItem('asj_lang', 'corrupted_code');
      expect(repository.getLanguage()).toBeNull();

      mockStorage.setItem('asj_lang', '   ');
      expect(repository.getLanguage()).toBeNull();
    });
  });

  describe('Customer Details Management', () => {
    it('should return null when no customer details are stored', () => {
      expect(repository.getSavedCustomerDetails()).toBeNull();
    });

    it('should save and retrieve valid customer details', () => {
      repository.saveCustomerDetails(validCustomer);

      const retrieved = repository.getSavedCustomerDetails();
      expect(retrieved).not.toBeNull();
      expect(retrieved).toEqual(validCustomer);
    });

    it('should trim string values when saving customer details', () => {
      repository.saveCustomerDetails({
        customerName: '  Amit Verma  ',
        customerPhone: ' 9876543210 ',
        villageId: ' sarsar ',
        landmark: ' Shiv Mandir ',
      });

      const retrieved = repository.getSavedCustomerDetails();
      expect(retrieved).toEqual({
        customerName: 'Amit Verma',
        customerPhone: '9876543210',
        villageId: 'sarsar',
        landmark: 'Shiv Mandir',
      });
    });

    it('should throw error when saving non-object or invalid arguments', () => {
      expect(() => repository.saveCustomerDetails(null as unknown as SavedCustomerDetails)).toThrowError(
        /Customer details must be a non-null object/
      );
      expect(() => repository.saveCustomerDetails([] as unknown as SavedCustomerDetails)).toThrowError(
        /Customer details must be a non-null object/
      );
    });

    it('should throw error when customer details fields are not strings', () => {
      expect(() =>
        repository.saveCustomerDetails({
          customerName: 123 as unknown as string,
          customerPhone: '9876543210',
          villageId: 'puraina',
          landmark: '',
        })
      ).toThrowError(/All customer details fields.*must be strings/);

      expect(() =>
        repository.saveCustomerDetails({
          customerName: 'Amit',
          customerPhone: null as unknown as string,
          villageId: 'puraina',
          landmark: '',
        })
      ).toThrowError(/All customer details fields.*must be strings/);
    });

    it('should return null if stored JSON is malformed', () => {
      mockStorage.setItem('asj_customer_details', '{invalid_json');
      expect(repository.getSavedCustomerDetails()).toBeNull();
    });

    it('should return null if stored JSON is not an object or is an array', () => {
      mockStorage.setItem('asj_customer_details', JSON.stringify(['item1', 'item2']));
      expect(repository.getSavedCustomerDetails()).toBeNull();

      mockStorage.setItem('asj_customer_details', JSON.stringify('just a string'));
      expect(repository.getSavedCustomerDetails()).toBeNull();

      mockStorage.setItem('asj_customer_details', JSON.stringify(42));
      expect(repository.getSavedCustomerDetails()).toBeNull();
    });

    it('should return null if stored JSON object has missing or invalid property types', () => {
      mockStorage.setItem(
        'asj_customer_details',
        JSON.stringify({ customerName: 'Rajesh' }) // missing phone, village, landmark
      );
      expect(repository.getSavedCustomerDetails()).toBeNull();

      mockStorage.setItem(
        'asj_customer_details',
        JSON.stringify({
          customerName: 'Rajesh',
          customerPhone: 9876543210, // number instead of string
          villageId: 'puraina',
          landmark: 'School',
        })
      );
      expect(repository.getSavedCustomerDetails()).toBeNull();
    });
  });

  describe('Clearing Preferences', () => {
    it('should clear only customer details when clearCustomerDetails() is invoked', () => {
      repository.setLanguage('hi');
      repository.saveCustomerDetails(validCustomer);

      repository.clearCustomerDetails();

      expect(repository.getSavedCustomerDetails()).toBeNull();
      expect(repository.getLanguage()).toBe('hi');
      expect(mockStorage.getItem('asj_customer_details')).toBeNull();
      expect(mockStorage.getItem('asj_lang')).toBe('hi');
    });

    it('should clear both language and customer details when clearPreferences() is invoked', () => {
      repository.setLanguage('hi');
      repository.saveCustomerDetails(validCustomer);

      repository.clearPreferences();

      expect(repository.getLanguage()).toBeNull();
      expect(repository.getSavedCustomerDetails()).toBeNull();
      expect(mockStorage.getItem('asj_lang')).toBeNull();
      expect(mockStorage.getItem('asj_customer_details')).toBeNull();
    });
  });

  describe('Custom Configuration Options', () => {
    it('should respect custom storage keys when provided in options', () => {
      const customRepo = new LocalStoragePreferenceRepository({
        storage: mockStorage,
        languageKey: 'custom_lang_key',
        customerDetailsKey: 'custom_customer_key',
      });

      customRepo.setLanguage('en');
      customRepo.saveCustomerDetails(validCustomer);

      expect(mockStorage.getItem('custom_lang_key')).toBe('en');
      expect(mockStorage.getItem('asj_lang')).toBeNull();

      expect(mockStorage.getItem('custom_customer_key')).not.toBeNull();
      expect(mockStorage.getItem('asj_customer_details')).toBeNull();

      expect(customRepo.getLanguage()).toBe('en');
      expect(customRepo.getSavedCustomerDetails()).toEqual(validCustomer);
    });
  });

  describe('SSR Safety & Undefined Window Guard', () => {
    it('should safely return null and no-op without error when storage is absent (Node/SSR)', () => {
      // In default Node.js test environment, window is undefined
      const ssrRepo = new LocalStoragePreferenceRepository();

      expect(ssrRepo.getLanguage()).toBeNull();
      expect(() => ssrRepo.setLanguage('hi')).not.toThrow();

      expect(ssrRepo.getSavedCustomerDetails()).toBeNull();
      expect(() => ssrRepo.saveCustomerDetails(validCustomer)).not.toThrow();

      expect(() => ssrRepo.clearCustomerDetails()).not.toThrow();
      expect(() => ssrRepo.clearPreferences()).not.toThrow();
    });
  });

  describe('Storage Fault Tolerance (Security/Quota Errors)', () => {
    it('should gracefully handle storage.getItem throwing errors', () => {
      const faultyStorage: IStorageLike = {
        getItem: () => {
          throw new Error('SecurityError: Access Denied');
        },
        setItem: () => {},
        removeItem: () => {},
      };

      const resilientRepo = new LocalStoragePreferenceRepository({ storage: faultyStorage });
      expect(resilientRepo.getLanguage()).toBeNull();
      expect(resilientRepo.getSavedCustomerDetails()).toBeNull();
    });

    it('should gracefully handle storage.setItem throwing QuotaExceededError', () => {
      const quotaExceededStorage: IStorageLike = {
        getItem: () => null,
        setItem: () => {
          throw new Error('DOMException: QuotaExceededError');
        },
        removeItem: () => {},
      };

      const resilientRepo = new LocalStoragePreferenceRepository({ storage: quotaExceededStorage });
      expect(() => resilientRepo.setLanguage('hi')).not.toThrow();
      expect(() => resilientRepo.saveCustomerDetails(validCustomer)).not.toThrow();
    });

    it('should gracefully handle storage.removeItem throwing errors', () => {
      const faultyStorage: IStorageLike = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {
          throw new Error('Storage write prohibited');
        },
      };

      const resilientRepo = new LocalStoragePreferenceRepository({ storage: faultyStorage });
      expect(() => resilientRepo.clearCustomerDetails()).not.toThrow();
      expect(() => resilientRepo.clearPreferences()).not.toThrow();
    });
  });
});
