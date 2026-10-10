import type { OrderDraft, CalculatedOrderSummary } from '../entities/OrderDraft';

export interface IOrderDispatcher {
  generateWhatsAppUrl(draft: OrderDraft, summary: CalculatedOrderSummary, lang: 'hi' | 'en'): string;
}
