export type Provider = 'Shopify' | 'Extend' | 'Codup';
export type Screen = 'planner' | 'summary';

export interface Feature {
  id: string;
  category: string;
  feature: string;
  provider: Provider;
  app?: string;
}

export interface AppState {
  selectedFeatures: Set<string>;
  notes: string;
  currentScreen: Screen;
  aiLoading: boolean;
  userName: string;
  showEmailModal: boolean;
}
