import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BookingWizard } from '../../../src/presentation/components/wizard/BookingWizard';
import type { BookingWizardProps } from '../../../src/presentation/components/wizard/BookingWizard';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { ContainerProvider } from '../../../src/infrastructure/di/AppProviders';
import { createAppContainer } from '../../../src/infrastructure/di/container';
import { hindiDict, englishDict } from '../../../src/locales';

function renderWizardWithLanguage(
  languageOption: 'hi' | 'en' = 'hi',
  wizardProps?: BookingWizardProps
): string {
  const containerDouble = createAppContainer();

  return renderToStaticMarkup(
    React.createElement(
      ContainerProvider,
      { container: containerDouble },
      React.createElement(
        LanguageProvider,
        { initialLanguage: languageOption },
        React.createElement(BookingWizard, wizardProps)
      )
    )
  );
}

describe('BookingWizard Component (src/presentation/components/wizard/BookingWizard.tsx)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedWizardConsumer(): JSX.Element {
        return React.createElement(BookingWizard);
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedWizardConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('Default Hindi Rendering (Bilingual Hindi-First)', () => {
    it('should render semantic section with proper role, id, and aria-labelledby', () => {
      const htmlMarkup = renderWizardWithLanguage('hi');

      expect(htmlMarkup).toContain('<section id="booking"');
      expect(htmlMarkup).toContain('role="region"');
      expect(htmlMarkup).toContain('aria-labelledby=');
    });

    it('should render section badge, title, and subtitle in Hindi', () => {
      const htmlMarkup = renderWizardWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.wizard.sectionBadge);
      expect(htmlMarkup).toContain(hindiDict.wizard.sectionTitle);
      expect(htmlMarkup).toContain(hindiDict.wizard.sectionSubtitle);
    });

    it('should render 4-step stepper with accessible navigation and Hindi labels', () => {
      const htmlMarkup = renderWizardWithLanguage('hi');

      expect(htmlMarkup).toContain('role="radio"');
      expect(htmlMarkup).toContain(hindiDict.wizard.stepNames.serviceSelect);
      expect(htmlMarkup).toContain(hindiDict.wizard.stepNames.quantityDetails);
      expect(htmlMarkup).toContain(hindiDict.wizard.stepNames.customerDetails);
      expect(htmlMarkup).toContain(hindiDict.wizard.stepNames.reviewSummary);
    });

    it('should render all 3 confirmed commercial service options in Step 1', () => {
      const htmlMarkup = renderWizardWithLanguage('hi');

      // 1. 20L Jar (Normal / Cool)
      expect(htmlMarkup).toContain('20 लीटर आरओ पानी जार (नॉर्मल / ठंडा)');
      expect(htmlMarkup).toContain(hindiDict.wizard.services.jarNormal.subtitle);
      expect(htmlMarkup).toContain('₹30 / ₹25 सब्सक्रिप्शन');

      // 2. Bulk Packaged Bottles
      expect(htmlMarkup).toContain(hindiDict.wizard.services.bulkBottles.title);
      expect(htmlMarkup).toContain(hindiDict.wizard.services.bulkBottles.subtitle);
      expect(htmlMarkup).toContain('थोक दर (कार्टन)');

      // 3. Event & Wedding Supply
      expect(htmlMarkup).toContain(hindiDict.wizard.services.eventSupply.title);
      expect(htmlMarkup).toContain(hindiDict.wizard.services.eventSupply.subtitle);
      expect(htmlMarkup).toContain('शादी व समारोह आपूर्ति');
    });

    it('should confirm absolute zero reference to RO servicing across the entire wizard', () => {
      const htmlMarkup = renderWizardWithLanguage('hi');

      const lowerMarkup = htmlMarkup.toLowerCase();
      expect(lowerMarkup).not.toContain('ro servicing');
      expect(lowerMarkup).not.toContain('filter change');
      expect(lowerMarkup).not.toContain('membrane repair');
      expect(lowerMarkup).not.toContain('सर्विसिंग');
      expect(lowerMarkup).not.toContain('रिपेयर');
    });
  });

  describe('English Rendering', () => {
    it('should render section header, step labels, and service options in English', () => {
      const htmlMarkup = renderWizardWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.wizard.sectionBadge);
      expect(htmlMarkup).toContain(englishDict.wizard.sectionTitle);
      expect(htmlMarkup).toContain(englishDict.wizard.sectionSubtitle);

      // English step names
      expect(htmlMarkup).toContain(englishDict.wizard.stepNames.serviceSelect);
      expect(htmlMarkup).toContain('Quantity &amp; Plan');
      expect(htmlMarkup).toContain(englishDict.wizard.stepNames.customerDetails);
      expect(htmlMarkup).toContain(englishDict.wizard.stepNames.reviewSummary);

      // English service options
      expect(htmlMarkup).toContain('20L RO Water Jar (Normal / Cool)');
      expect(htmlMarkup).toContain(englishDict.wizard.services.bulkBottles.title);
      expect(htmlMarkup).toContain('Event &amp; Wedding Supply');
    });
  });

  describe('Step 2: Quantity Details Rendering for Specific Services', () => {
    it('should render 20L jar controls: temperature pills, counter, recurring discount, deposit card', () => {
      const htmlMarkup = renderWizardWithLanguage('hi', {
        options: { initialStep: 2, initialServiceType: 'jar' },
      });

      expect(htmlMarkup).toContain('नॉर्मल पानी (20L)');
      expect(htmlMarkup).toContain('ठंडा / चिल्ड पानी (20L)');
      expect(htmlMarkup).toContain(hindiDict.wizard.form.jarQuantityLabel);
      expect(htmlMarkup).toContain(hindiDict.wizard.form.recurringCheckboxLabel);
      expect(htmlMarkup).toContain(hindiDict.wizard.form.firstOrderCheckboxLabel);
      expect(htmlMarkup).toContain('अनुमानित शुल्क विवरण:');
    });

    it('should render bulk bottles controls: carton counter and zero deposit info card', () => {
      const htmlMarkup = renderWizardWithLanguage('hi', {
        options: { initialStep: 2, initialServiceType: 'bulk_bottles' },
      });

      expect(htmlMarkup).toContain(hindiDict.wizard.form.bottleQuantityLabel);
      expect(htmlMarkup).toContain('24 सीलबंद बोतलें प्रति कार्टन');
      expect(htmlMarkup).toContain('₹0 डिपॉजिट');
    });

    it('should render event supply controls: guest input, event types, and volume estimate card', () => {
      const htmlMarkup = renderWizardWithLanguage('hi', {
        options: { initialStep: 2, initialServiceType: 'event' },
      });

      expect(htmlMarkup).toContain(hindiDict.wizard.form.eventGuestsLabel);
      expect(htmlMarkup).toContain(hindiDict.wizard.form.eventTypeLabel);
      expect(htmlMarkup).toContain('शादी / रिसेप्शन');
      expect(htmlMarkup).toContain('मौसम (पानी खपत दर):');
      expect(htmlMarkup).toContain(hindiDict.wizard.form.eventEstimatedVolume);
      expect(htmlMarkup).toContain(hindiDict.wizard.summary.eventZeroDepositNotice);
    });
  });

  describe('Step 3: Customer Details Rendering', () => {
    it('should render name input, phone with +91 prefix, village selector, landmark, and save checkbox', () => {
      const htmlMarkup = renderWizardWithLanguage('hi', {
        options: { initialStep: 3 },
      });

      expect(htmlMarkup).toContain(hindiDict.wizard.form.customerDetailsHeading);
      expect(htmlMarkup).toContain(hindiDict.wizard.form.fullNameLabel);
      expect(htmlMarkup).toContain('+91');
      expect(htmlMarkup).toContain(hindiDict.wizard.form.phoneLabel);
      expect(htmlMarkup).toContain(hindiDict.wizard.form.villageLabel);
      expect(htmlMarkup).toContain(hindiDict.wizard.form.landmarkLabel);
      expect(htmlMarkup).toContain(hindiDict.wizard.form.saveDetailsLabel);
    });
  });

  describe('Step 4: Review Summary & WhatsApp CTA Rendering', () => {
    it('should render review cards, delivery destination, COD notice, and WhatsApp CTA button', () => {
      const htmlMarkup = renderWizardWithLanguage('hi', {
        options: { initialStep: 4, initialServiceType: 'jar' },
      });

      expect(htmlMarkup).toContain(hindiDict.wizard.summary.heading);
      expect(htmlMarkup).toContain(hindiDict.wizard.summary.selectedService);
      expect(htmlMarkup).toContain(hindiDict.wizard.summary.totalPayable);
      expect(htmlMarkup).toContain(hindiDict.wizard.summary.deliveryTo);
      expect(htmlMarkup).toContain(hindiDict.wizard.summary.codNotice);
      expect(htmlMarkup).toContain(hindiDict.wizard.summary.submitWhatsAppBtn);
    });
  });
});
