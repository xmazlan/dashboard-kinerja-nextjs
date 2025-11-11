export type SiteConfig = {
  name: string;
  author: string;
  description: string;
  keywords: Array<string>;
  locale: string;
  type: string;
  publishedTime: string;
  twitterCard: string;
  url: {
    base: string;
    author: string;
  };
  links: {
    github: string;
  };
  ogImage: string;
};

export interface BreadcrumbType {
  label: string;
  href: string;
  isCurrent?: boolean;
}


// Export all types
export * from './mosque';
export * from './main-menu';
export * from './permission';
export * from './role';
export * from './user';
export * from './announcement';
export * from './slider';
export * from './cta-banner';