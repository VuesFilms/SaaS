import { flags, type FeatureFlags } from './flags';

describe('flags', () => {
  it('scriptEditor is always true', () => {
    expect(flags.scriptEditor).toBe(true);
  });

  it('aiAddon is always false', () => {
    expect(flags.aiAddon).toBe(false);
  });

  it('all flags are boolean values', () => {
    for (const [key, value] of Object.entries(flags)) {
      expect(typeof value).toBe('boolean');
    }
  });

  it('FeatureFlags type has expected keys', () => {
    const expectedKeys: (keyof FeatureFlags)[] = [
      'scriptEditor',
      'breakdowns',
      'storyboards',
      'scheduling',
      'tasks',
      'budget',
      'festivalTracker',
      'filesReview',
      'integrations',
      'aiAddon',
      'beatBoard',
      'watermarkedLinks',
      'revisionColors',
      'templateCenter',
      'smartSearch',
      'dailiesReview',
      'deliveryQc',
      'rightsTracker',
      'casting',
      'locationHub',
      'saudiFeatures',
      'billingStripe',
    ];

    const flagKeys = Object.keys(flags);
    for (const key of expectedKeys) {
      expect(flagKeys).toContain(key);
    }
    expect(flagKeys).toHaveLength(expectedKeys.length);
  });
});
