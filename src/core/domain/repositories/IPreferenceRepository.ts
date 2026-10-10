export interface SavedCustomerDetails {
  customerName: string;
  customerPhone: string;
  villageId: string;
  landmark: string;
}

export interface IPreferenceRepository {
  getLanguage(): string | null;
  setLanguage(lang: string): void;
  getSavedCustomerDetails(): SavedCustomerDetails | null;
  saveCustomerDetails(details: SavedCustomerDetails): void;
}
