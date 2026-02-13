export interface FeatureFlags {
  scriptEditor: boolean;
  breakdowns: boolean;
  storyboards: boolean;
  scheduling: boolean;
  tasks: boolean;
  budget: boolean;
  festivalTracker: boolean;
  filesReview: boolean;
  integrations: boolean;
  aiAddon: boolean;
  beatBoard: boolean;
  watermarkedLinks: boolean;
  revisionColors: boolean;
  templateCenter: boolean;
  smartSearch: boolean;
  dailiesReview: boolean;
  deliveryQc: boolean;
  rightsTracker: boolean;
  casting: boolean;
  locationHub: boolean;
  saudiFeatures: boolean;
  billingStripe: boolean;
}

const isDev = typeof process !== 'undefined'
  ? process.env.NODE_ENV !== 'production'
  : true;

export const flags: FeatureFlags = {
  scriptEditor: true,
  breakdowns: isDev,
  storyboards: isDev,
  scheduling: isDev,
  tasks: isDev,
  budget: isDev,
  festivalTracker: isDev,
  filesReview: isDev,
  integrations: isDev,
  aiAddon: false,
  beatBoard: isDev,
  watermarkedLinks: isDev,
  revisionColors: isDev,
  templateCenter: isDev,
  smartSearch: isDev,
  dailiesReview: isDev,
  deliveryQc: isDev,
  rightsTracker: isDev,
  casting: isDev,
  locationHub: isDev,
  saudiFeatures: isDev,
  billingStripe: isDev,
};
