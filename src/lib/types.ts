export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  client?: string | null;
  year?: number | null;
  services: string[];
  externalLink?: string | null;
  category: { name: string; slug: string } | null;
  tags: string[];
  isFeatured: boolean;
  publishedAt?: string;
  coverUrl?: string | null;
  coverAlt?: string | null;
  visual: "noura" | "form" | "index" | "studio" | "mono";
};

export type PortfolioBlock = {
  id: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "EMBED";
  layout: string;
  groupId?: string | null;
  content: Record<string, unknown> | null;
  assetUrl?: string | null;
  assetAlt?: string | null;
};

export type PortfolioCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  projectCount: number;
  coverUrl?: string | null;
};

export type PortfolioService = {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconKey: string;
};

export type PortfolioSection = {
  id: string;
  key: string;
  label: string;
  type: string;
  isVisible: boolean;
  sortOrder: number;
  content: Record<string, unknown> | null;
};

export type SiteProfile = {
  brandName: string;
  founderName: string;
  description: string;
  accentColor: string;
  email: string;
  socials: Record<string, string>;
};
