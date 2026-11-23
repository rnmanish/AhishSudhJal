import { describe, it, expect } from 'vitest';
import { WhatsAppLinkDispatcher } from '../../src/infrastructure/dispatchers/WhatsAppLinkDispatcher';
import { OrderDraft } from '../../src/core/domain/entities/OrderDraft';
import { Product } from '../../src/core/domain/entities/Product';
import { IndianPhoneNumber } from '../../src/core/domain/value-objects/IndianPhoneNumber';

describe('WhatsAppLinkDispatcher', () => {
  const normalJarProduct = new Product({
    id: 'jar-normal',
    name: '20L Normal RO Water Jar',
    nameHindi: '20 लीटर नॉर्मल आरओ पानी जार',
    category: 'jar',
    priceRs: 30,
    recurringPriceRs: 25,
    recurringDiscountRs: 5,
    depositRs: 150,
    unit: 'jar',
    isAvailable: true,
    description: 'Multi-stage RO purified drinking water. Free doorstep delivery.',
    descriptionHindi: 'मल्टी-स्टेज आरओ शुद्ध पेयजल। मुफ्त डोरस्टेप डिलीवरी।',
  });

  const chilledJarProduct = new Product({
    id: 'jar-chilled',
    name: '20L Chilled / Cool RO Water Jar',
    nameHindi: '20 लीटर ठंडा आरओ पानी जार',
    category: 'jar',
    priceRs: 30,
    recurringPriceRs: 25,
    recurringDiscountRs: 5,
    depositRs: 150,
    unit: 'jar',
    isAvailable: true,
    description: 'Chilled RO water.',
    descriptionHindi: 'ठंडा आरओ पानी।',
  });

  const bulkBottlesProduct = new Product({
    id: 'bulk-bottles',
    name: 'Packaged Water Bottles (250ml / 500ml / 1L)',
    nameHindi: 'पैकेज्ड पानी बोतल (250ml / 500ml / 1L)',
    category: 'bulk_bottles',
    priceRs: null,
    recurringPriceRs: null,
    recurringDiscountRs: 0,
    depositRs: 0,
    unit: 'carton',
    isAvailable: true,
    description: 'Bulk bottles.',
    descriptionHindi: 'थोक बोतलें।',
  });

  const eventSupplyProduct = new Product({
    id: 'event-supply',
    name: 'Event / Party / Social Gathering Water Supply',
    nameHindi: 'इवेंट / पार्टी / समारोह जल आपूर्ति',
    category: 'event',
    priceRs: null,
    recurringPriceRs: null,
    recurringDiscountRs: 0,
    depositRs: 0,
    unit: 'custom',
    isAvailable: true,
    description: 'Event supply.',
    descriptionHindi: 'समारोह आपूर्ति।',
  });

  describe('Constructor & Business Phone Number Validation', () => {
    it('initializes with default Ashish Sudh Jal business number 918235882384', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      expect(dispatcher.getBusinessPhoneNumber()).toBe('918235882384');
    });

    it('normalizes formatted and 10-digit Indian numbers correctly', () => {
      const d1 = new WhatsAppLinkDispatcher('+91 82358 82384');
      expect(d1.getBusinessPhoneNumber()).toBe('918235882384');

      const d2 = new WhatsAppLinkDispatcher('8235882384');
      expect(d2.getBusinessPhoneNumber()).toBe('918235882384');

      const d3 = new WhatsAppLinkDispatcher('08235882384');
      expect(d3.getBusinessPhoneNumber()).toBe('918235882384');

      const d4 = new WhatsAppLinkDispatcher('919876543210');
      expect(d4.getBusinessPhoneNumber()).toBe('919876543210');
    });

    it('rejects invalid or non-Indian phone numbers defensively', () => {
      expect(() => new WhatsAppLinkDispatcher('')).toThrow('Business WhatsApp phone number must be a non-empty string.');
      expect(() => new WhatsAppLinkDispatcher('12345')).toThrow('Must be a valid 10-digit Indian mobile number');
      expect(() => new WhatsAppLinkDispatcher('abcdefghij')).toThrow('Must be a valid 10-digit Indian mobile number');
      expect(() => new WhatsAppLinkDispatcher('911234567890')).toThrow('Must be a valid 10-digit Indian mobile number');
    });
  });

  describe('20L Water Jar Orders', () => {
    it('formats a first-time one-time Normal Jar order in Hindi with ₹150 deposit', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 2,
        isRecurring: false,
        isFirstOrder: true,
        customerName: 'राहुल कुमार',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'puraina',
        villageName: 'पुरैना',
        landmark: 'शिव मंदिर के पास',
        notes: 'शाम 4 बजे तक चाहिए',
      });

      const summary = draft.calculateSummary(normalJarProduct);
      const message = dispatcher.formatMessage(draft, summary, 'hi');

      expect(message).toContain('💧 *आशीष शुद्ध जल (सरसर, सिवान)*');
      expect(message).toContain('नया ऑर्डर अनुरोध:');
      expect(message).toContain('• नाम: राहुल कुमार');
      expect(message).toContain('• फोन: 98765 43210');
      expect(message).toContain('• गाँव: पुरैना');
      expect(message).toContain('• लैंडमार्क: शिव मंदिर के पास');
      expect(message).toContain('• उत्पाद: 20L नॉर्मल आरओ पानी जार');
      expect(message).toContain('• मात्रा: 2 जार');
      expect(message).toContain('• ऑर्डर प्रकार: एक बार का ऑर्डर');
      expect(message).toContain('• दर: ₹30 प्रति जार');
      expect(message).toContain('• अमानत राशि: ₹150 (जार + डिस्पेंसर - केवल पहला ऑर्डर)');
      expect(message).toContain('💰 *भुगतान विवरण (कैश / यूपीआई):*');
      expect(message).toContain('• पानी शुल्क: ₹60');
      expect(message).toContain('• अमानत राशि: ₹150');
      expect(message).toContain('• कुल देय राशि: ₹210');
      expect(message).toContain('📝 *विशेष निर्देश:*\nशाम 4 बजे तक चाहिए');
      expect(message).toContain('कृपया ऑर्डर एवं डिलीवरी समय की पुष्टि करें। धन्यवाद!');
    });

    it('formats a first-time one-time Normal Jar order in English', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 1,
        isRecurring: false,
        isFirstOrder: true,
        customerName: 'Rahul Kumar',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'puraina',
        villageName: 'Puraina',
        landmark: 'Near Shiva Temple',
      });

      const summary = draft.calculateSummary(normalJarProduct);
      const message = dispatcher.formatMessage(draft, summary, 'en');

      expect(message).toContain('💧 *Ashish Sudh Jal (Sarsar, Siwan)*');
      expect(message).toContain('New Order Request:');
      expect(message).toContain('• Name: Rahul Kumar');
      expect(message).toContain('• Phone: 98765 43210');
      expect(message).toContain('• Village: Puraina');
      expect(message).toContain('• Landmark: Near Shiva Temple');
      expect(message).toContain('• Product: 20L Normal RO Water Jar');
      expect(message).toContain('• Quantity: 1 Jar');
      expect(message).toContain('• Order Type: One-time Order');
      expect(message).toContain('• Rate: ₹30 per jar');
      expect(message).toContain('• Deposit: ₹150 (Jar + Dispenser - First order only)');
      expect(message).toContain('💰 *Payment Details (Cash / UPI):*');
      expect(message).toContain('• Water Amount: ₹30');
      expect(message).toContain('• Deposit Amount: ₹150');
      expect(message).toContain('• Total Amount Payable: ₹180');
      expect(message).toContain('Please confirm the order and delivery SLA. Thank you!');
    });

    it('formats a recurring Chilled Jar subscription for existing customer in Hindi (₹5 savings, ₹0 deposit)', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'jar',
        productId: 'jar-chilled',
        temperature: 'chilled',
        quantity: 3,
        isRecurring: true,
        frequency: 'daily',
        isFirstOrder: false,
        customerName: 'सुनील शर्मा',
        customerPhone: new IndianPhoneNumber('8235882384'),
        villageId: 'sarsar',
        villageName: 'सरसर',
        landmark: '',
      });

      const summary = draft.calculateSummary(chilledJarProduct);
      const message = dispatcher.formatMessage(draft, summary, 'hi');

      expect(message).toContain('• उत्पाद: 20L ठंडा (चिल्ड) आरओ पानी जार');
      expect(message).toContain('• मात्रा: 3 जार');
      expect(message).toContain('• ऑर्डर प्रकार: नियमित सब्सक्रिप्शन (दैनिक)');
      expect(message).toContain('• दर: ₹25 प्रति जार');
      expect(message).toContain('• नियमित छूट: ₹15 बचत');
      expect(message).toContain('• अमानत राशि: ₹0 (पुराने ग्राहक - कोई अमानत राशि नहीं)');
      expect(message).toContain('• पानी शुल्क: ₹75');
      expect(message).toContain('• कुल बचत: ₹15');
      expect(message).toContain('• कुल देय राशि: ₹75');
      expect(message).not.toContain('• लैंडमार्क:');
      expect(message).not.toContain('📝 *विशेष निर्देश:*');
    });

    it('formats alternate_days and weekly subscriptions in English', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draftAlternate = new OrderDraft({
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 2,
        isRecurring: true,
        frequency: 'alternate_days',
        isFirstOrder: false,
        customerName: 'Sunil Sharma',
        customerPhone: new IndianPhoneNumber('8235882384'),
        villageId: 'sarsar',
        villageName: 'Sarsar',
        landmark: 'Near Panchayat Bhawan',
      });

      const summaryAlternate = draftAlternate.calculateSummary(normalJarProduct);
      const messageAlternate = dispatcher.formatMessage(draftAlternate, summaryAlternate, 'en');
      expect(messageAlternate).toContain('• Order Type: Recurring Subscription (Alternate Days)');
      expect(messageAlternate).toContain('• Rate: ₹25 per jar');
      expect(messageAlternate).toContain('• Recurring Discount: ₹10 savings');
      expect(messageAlternate).toContain('• Deposit: ₹0 (Existing customer - No deposit)');

      const draftWeekly = new OrderDraft({
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 2,
        isRecurring: true,
        frequency: 'weekly',
        isFirstOrder: false,
        customerName: 'Sunil Sharma',
        customerPhone: new IndianPhoneNumber('8235882384'),
        villageId: 'sarsar',
        villageName: 'Sarsar',
        landmark: '',
      });

      const summaryWeekly = draftWeekly.calculateSummary(normalJarProduct);
      const messageWeekly = dispatcher.formatMessage(draftWeekly, summaryWeekly, 'en');
      expect(messageWeekly).toContain('• Order Type: Recurring Subscription (Weekly)');
    });
  });

  describe('Bulk Packaged Bottles Orders', () => {
    it('formats bulk bottles inquiry in Hindi requesting custom quote', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'bulk_bottles',
        productId: 'bulk-bottles',
        quantity: 10,
        isRecurring: false,
        isFirstOrder: true,
        customerName: 'अमित कुमार',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'chhap',
        villageName: 'छाप',
        landmark: 'बाजार चौक',
        notes: '250ml और 500ml की बोतलें चाहिए',
      });

      const summary = draft.calculateSummary(bulkBottlesProduct);
      const message = dispatcher.formatMessage(draft, summary, 'hi');

      expect(message).toContain('• उत्पाद: पैकेज्ड पानी बोतल (250ml / 500ml / 1L)');
      expect(message).toContain('• अनुमानित मात्रा: 10 कार्टन');
      expect(message).toContain('• दर: थोक दर के लिए संपर्क करें (कस्टम कोटेशन)');
      expect(message).toContain('📝 *विशेष निर्देश:*\n250ml और 500ml की बोतलें चाहिए');
      expect(message).not.toContain('💰 *भुगतान विवरण');
    });

    it('formats bulk bottles inquiry in English', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'bulk_bottles',
        productId: 'bulk-bottles',
        quantity: 5,
        isRecurring: false,
        isFirstOrder: false,
        customerName: 'Amit Kumar',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'chhap',
        villageName: 'Chhap',
        landmark: 'Market Square',
      });

      const summary = draft.calculateSummary(bulkBottlesProduct);
      const message = dispatcher.formatMessage(draft, summary, 'en');

      expect(message).toContain('• Product: Packaged Water Bottles (250ml / 500ml / 1L)');
      expect(message).toContain('• Quantity: 5 Cartons');
      expect(message).toContain('• Rate: Contact for bulk pricing (Custom quote)');
    });
  });

  describe('Event Supply Orders', () => {
    it('formats event supply booking in Hindi with ₹0 deposit and event details', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'event',
        productId: 'event-supply',
        quantity: 0,
        isRecurring: false,
        isFirstOrder: true,
        customerName: 'विकास वर्मा',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'sarsar',
        villageName: 'सरसर',
        landmark: 'विवाह भवन',
        eventDetails: {
          guestCount: 500,
          eventType: 'शादी / विवाह',
          eventDate: '2026-11-20',
          estimatedLitres: 1000,
        },
        notes: 'ठंडे पानी की व्यवस्था जरूरी है',
      });

      const summary = draft.calculateSummary(eventSupplyProduct);
      const message = dispatcher.formatMessage(draft, summary, 'hi');

      expect(message).toContain('🎉 *समारोह / इवेंट विवरण:*');
      expect(message).toContain('• समारोह का प्रकार: शादी / विवाह');
      expect(message).toContain('• समारोह की तारीख: 2026-11-20');
      expect(message).toContain('• अनुमानित मेहमान: 500');
      expect(message).toContain('• अनुमानित पानी: 1000 लीटर');
      expect(message).toContain('• अमानत राशि: ₹0 (इवेंट ऑर्डर पर कोई जमा राशि नहीं)');
      expect(message).toContain('• दर: कस्टम कोटेशन');
      expect(message).toContain('📝 *विशेष निर्देश:*\nठंडे पानी की व्यवस्था जरूरी है');
    });

    it('formats event supply booking in English with ₹0 deposit', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'event',
        productId: 'event-supply',
        quantity: 0,
        isRecurring: false,
        isFirstOrder: false,
        customerName: 'Vikas Verma',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'sarsar',
        villageName: 'Sarsar',
        landmark: 'Community Hall',
        eventDetails: {
          guestCount: 300,
          eventType: 'Birthday Party',
          eventDate: '2026-12-05',
          estimatedLitres: 600,
        },
      });

      const summary = draft.calculateSummary(eventSupplyProduct);
      const message = dispatcher.formatMessage(draft, summary, 'en');

      expect(message).toContain('🎉 *Event Details:*');
      expect(message).toContain('• Event Type: Birthday Party');
      expect(message).toContain('• Event Date: 2026-12-05');
      expect(message).toContain('• Estimated Guests: 300');
      expect(message).toContain('• Estimated Water: 600 Litres');
      expect(message).toContain('• Deposit: ₹0 (Zero deposit for event orders)');
      expect(message).toContain('• Rate: Custom Quote');
    });
  });

  describe('WhatsApp URL Generation & Devanagari Unicode Safety', () => {
    it('generates a valid wa.me URL targeting 918235882384', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 1,
        isRecurring: false,
        isFirstOrder: false,
        customerName: 'राहुल',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'puraina',
        villageName: 'पुरैना',
        landmark: '',
      });

      const summary = draft.calculateSummary(normalJarProduct);
      const url = dispatcher.generateWhatsAppUrl(draft, summary, 'hi');

      expect(url.startsWith('https://wa.me/918235882384?text=')).toBe(true);

      const encodedText = url.replace('https://wa.me/918235882384?text=', '');
      const decodedText = decodeURIComponent(encodedText);

      expect(decodedText).toBe(dispatcher.formatMessage(draft, summary, 'hi'));
      expect(decodedText).toContain('आशीष शुद्ध जल');
      expect(decodedText).toContain('पुरैना');
    });

    it('generates a valid URL for a custom business phone number', () => {
      const customDispatcher = new WhatsAppLinkDispatcher('919876543210');
      const draft = new OrderDraft({
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 1,
        isRecurring: false,
        isFirstOrder: false,
        customerName: 'John',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'puraina',
        villageName: 'Puraina',
        landmark: '',
      });

      const summary = draft.calculateSummary(normalJarProduct);
      const url = customDispatcher.generateWhatsAppUrl(draft, summary, 'en');

      expect(url.startsWith('https://wa.me/919876543210?text=')).toBe(true);
    });

    it('strictly encodes special characters without encoding errors or crashes', () => {
      const dispatcher = new WhatsAppLinkDispatcher();
      const draft = new OrderDraft({
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 1,
        isRecurring: false,
        isFirstOrder: false,
        customerName: 'अमित & विकास (विशेष)',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'puraina',
        villageName: 'पुरैना / सिसवन',
        landmark: '100% शुद्ध #1 पानी',
        notes: 'कृपया 2:00 PM @ घर पर दें? धन्यवाद!',
      });

      const summary = draft.calculateSummary(normalJarProduct);
      const url = dispatcher.generateWhatsAppUrl(draft, summary, 'hi');

      expect(url).not.toContain(' ');
      expect(url).not.toContain('\n');

      const encodedText = url.replace('https://wa.me/918235882384?text=', '');
      const decodedText = decodeURIComponent(encodedText);
      expect(decodedText).toContain('अमित & विकास (विशेष)');
      expect(decodedText).toContain('100% शुद्ध #1 पानी');
      expect(decodedText).toContain('कृपया 2:00 PM @ घर पर दें? धन्यवाद!');
    });
  });
});
