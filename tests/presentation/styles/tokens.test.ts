import { describe, it, expect } from 'vitest';
import * as fileSystem from 'node:fs';
import * as pathModule from 'node:path';

/**
 * Calculates relative luminance according to WCAG 2.1 specifications:
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function calculateRelativeLuminance(hexColor: string): number {
  const normalizedHex = hexColor.replace('#', '').trim();
  const redChannel = Number.parseInt(normalizedHex.slice(0, 2), 16) / 255;
  const greenChannel = Number.parseInt(normalizedHex.slice(2, 4), 16) / 255;
  const blueChannel = Number.parseInt(normalizedHex.slice(4, 6), 16) / 255;

  const transformComponent = (component: number): number => {
    if (component <= 0.03928) {
      return component / 12.92;
    }
    return Math.pow((component + 0.055) / 1.055, 2.4);
  };

  const linearRed = transformComponent(redChannel);
  const linearGreen = transformComponent(greenChannel);
  const linearBlue = transformComponent(blueChannel);

  return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue;
}

/**
 * Calculates contrast ratio between two hex colors according to WCAG 2.1:
 * (Luminance1 + 0.05) / (Luminance2 + 0.05) where Luminance1 is the lighter color.
 */
function calculateContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const foregroundLuminance = calculateRelativeLuminance(foregroundHex);
  const backgroundLuminance = calculateRelativeLuminance(backgroundHex);

  const lighterLuminance = Math.max(foregroundLuminance, backgroundLuminance);
  const darkerLuminance = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighterLuminance + 0.05) / (darkerLuminance + 0.05);
}

describe('Aquatic CSS Design System Tokens (tokens.css)', () => {
  const tokensFilePath = pathModule.resolve(__dirname, '../../../src/presentation/styles/tokens.css');
  const tokensCssContent = fileSystem.readFileSync(tokensFilePath, 'utf-8');

  it('defines all required deep aquatic surface and background variables', () => {
    expect(tokensCssContent).toContain('--color-bg-base: #030c1a;');
    expect(tokensCssContent).toContain('--color-bg-surface: #051329;');
    expect(tokensCssContent).toContain('--color-bg-surface-elevated: #092042;');
    expect(tokensCssContent).toContain('--color-bg-card:');
    expect(tokensCssContent).toContain('--color-bg-glass:');
  });

  it('defines the ocean blue primary shades and aquatic accents', () => {
    expect(tokensCssContent).toContain('--color-primary-950:');
    expect(tokensCssContent).toContain('--color-primary-900:');
    expect(tokensCssContent).toContain('--color-primary-800:');
    expect(tokensCssContent).toContain('--color-primary-700:');
    expect(tokensCssContent).toContain('--color-primary-600:');
    expect(tokensCssContent).toContain('--color-primary-500:');
    expect(tokensCssContent).toContain('--color-accent-cyan:');
    expect(tokensCssContent).toContain('--color-accent-teal:');
  });

  it('defines official WhatsApp brand colors with high-contrast text', () => {
    expect(tokensCssContent).toContain('--color-whatsapp-primary: #25d366;');
    expect(tokensCssContent).toContain('--color-whatsapp-contrast-text: #03140a;');
  });

  it('defines functional status colors for TDS water verdicts and alerts', () => {
    expect(tokensCssContent).toContain('--color-status-success:');
    expect(tokensCssContent).toContain('--color-status-warning:');
    expect(tokensCssContent).toContain('--color-status-danger:');
    expect(tokensCssContent).toContain('--color-status-info:');
  });

  it('defines glassmorphism blur and shadow variables', () => {
    expect(tokensCssContent).toContain('--glass-blur-sm: 6px;');
    expect(tokensCssContent).toContain('--glass-blur-md: 12px;');
    expect(tokensCssContent).toContain('--glass-blur-lg: 20px;');
    expect(tokensCssContent).toContain('--glass-shadow-sm:');
    expect(tokensCssContent).toContain('--glass-shadow-md:');
    expect(tokensCssContent).toContain('--glass-shadow-lg:');
  });

  it('defines mobile touch target minimum of 44px per WCAG and rural mobile requirements', () => {
    expect(tokensCssContent).toContain('--touch-target-min: 44px;');
  });

  it('defines bilingual font family stacks', () => {
    expect(tokensCssContent).toContain('--font-family-hindi:');
    expect(tokensCssContent).toContain('Noto Sans Devanagari');
    expect(tokensCssContent).toContain('--font-family-english:');
    expect(tokensCssContent).toContain('Plus Jakarta Sans');
  });

  describe('WCAG 2.1 AA & AAA Color Contrast Verification', () => {
    const surfaceBackgroundHex = '#051329';

    it('verifies primary text (#f8fafc) achieves WCAG AAA (> 7.0:1) on surface', () => {
      const contrastRatio = calculateContrastRatio('#f8fafc', surfaceBackgroundHex);
      expect(contrastRatio).toBeGreaterThanOrEqual(7.0);
    });

    it('verifies secondary text (#cbd5e1) achieves WCAG AAA (> 7.0:1) on surface', () => {
      const contrastRatio = calculateContrastRatio('#cbd5e1', surfaceBackgroundHex);
      expect(contrastRatio).toBeGreaterThanOrEqual(7.0);
    });

    it('verifies muted text (#94a3b8) achieves WCAG AA (> 4.5:1) on surface', () => {
      const contrastRatio = calculateContrastRatio('#94a3b8', surfaceBackgroundHex);
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });

    it('verifies sky blue accent text (#38bdf8) achieves WCAG AAA (> 7.0:1) on surface', () => {
      const contrastRatio = calculateContrastRatio('#38bdf8', surfaceBackgroundHex);
      expect(contrastRatio).toBeGreaterThanOrEqual(7.0);
    });

    it('verifies cyan accent text (#22d3ee) achieves WCAG AAA (> 7.0:1) on surface', () => {
      const contrastRatio = calculateContrastRatio('#22d3ee', surfaceBackgroundHex);
      expect(contrastRatio).toBeGreaterThanOrEqual(7.0);
    });

    it('verifies WhatsApp CTA button text (#03140a) achieves WCAG AAA (> 7.0:1) on #25d366', () => {
      const contrastRatio = calculateContrastRatio('#03140a', '#25d366');
      expect(contrastRatio).toBeGreaterThanOrEqual(7.0);
    });
  });
});

describe('Global Aquatic Stylesheet (globals.css)', () => {
  const globalsFilePath = pathModule.resolve(__dirname, '../../../src/presentation/styles/globals.css');
  const globalsCssContent = fileSystem.readFileSync(globalsFilePath, 'utf-8');

  it('defines @font-face rules with font-display: swap for fast rendering', () => {
    expect(globalsCssContent).toContain('@font-face');
    expect(globalsCssContent).toContain("font-family: 'Noto Sans Devanagari'");
    expect(globalsCssContent).toContain("font-family: 'Plus Jakarta Sans'");
    expect(globalsCssContent).toContain('font-display: swap');
  });

  it('enforces prefers-reduced-motion for motion sensitivity accessibility', () => {
    expect(globalsCssContent).toContain('@media (prefers-reduced-motion: reduce)');
    expect(globalsCssContent).toContain('animation-duration: 0.01ms !important;');
  });

  it('defines glassmorphic container classes (.glass-card, .glass-card-interactive, .glass-panel, .glass-pill)', () => {
    expect(globalsCssContent).toContain('.glass-card {');
    expect(globalsCssContent).toContain('.glass-card-interactive {');
    expect(globalsCssContent).toContain('.glass-panel {');
    expect(globalsCssContent).toContain('.glass-pill {');
    expect(globalsCssContent).toContain('backdrop-filter: blur(');
  });

  it('defines interactive button classes with touch targets and WhatsApp styling', () => {
    expect(globalsCssContent).toContain('.btn {');
    expect(globalsCssContent).toContain('min-height: var(--touch-target-min, 44px);');
    expect(globalsCssContent).toContain('.btn-whatsapp {');
    expect(globalsCssContent).toContain('.btn-primary {');
    expect(globalsCssContent).toContain('.btn-secondary {');
  });

  it('defines status badges for TDS water safety verdicts', () => {
    expect(globalsCssContent).toContain('.badge-safe {');
    expect(globalsCssContent).toContain('.badge-moderate {');
    expect(globalsCssContent).toContain('.badge-hazard {');
    expect(globalsCssContent).toContain('.badge-info {');
  });

  it('enforces visible keyboard focus outlines and screen-reader utility', () => {
    expect(globalsCssContent).toContain(':focus-visible {');
    expect(globalsCssContent).toContain('outline: 2px solid');
    expect(globalsCssContent).toContain('.sr-only {');
  });
});
