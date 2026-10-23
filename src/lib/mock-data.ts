import type {
  PortfolioCategory,
  PortfolioProject,
  PortfolioSection,
  PortfolioService,
  SiteProfile,
} from "@/lib/types";
import { latestProjectsSection } from "@/lib/home-sections";

export const demoProfile: SiteProfile = {
  brandName: "SHOBAKY STUDIO",
  founderName: "MOHAMED ALSHOBAKY",
  description: "Independent graphic design by Mohamed Alshobaky.",
  accentColor: "#101010",
  email: "hello@shobakystudio.com",
  socials: {
    Instagram: "#",
    Behance: "#",
    LinkedIn: "#",
  },
};

export const demoProjects: PortfolioProject[] = [
  {
    id: "demo-noura",
    publishedAt: "2026-10-18T12:00:00.000Z",
    title: "Noura Objects",
    slug: "noura-objects",
    excerpt: "A tactile identity for a considered objects label.",
    description:
      "Noura Objects is a study in warmth, tactility, and deliberate detail. The identity balances a compact wordmark with generous editorial compositions, creating a world that feels precise without becoming precious.",
    client: "Noura Objects",
    year: 2026,
    services: ["Brand Strategy", "Visual Identity", "Art Direction"],
    category: { name: "Brand Identity", slug: "brand-identity" },
    tags: ["Identity", "Packaging", "Editorial"],
    isFeatured: true,
    visual: "noura",
  },
  {
    id: "demo-form",
    publishedAt: "2026-10-15T12:00:00.000Z",
    title: "Form & Field",
    slug: "form-and-field",
    excerpt: "An evolving visual language for everyday movement.",
    description:
      "A lean campaign system made to adapt from print to motion and social surfaces. Bold letterforms, strict crops, and a generous tempo give the work a recognisable rhythm.",
    client: "Form & Field",
    year: 2026,
    services: ["Campaign", "Typography", "Motion Direction"],
    category: { name: "Campaigns", slug: "campaigns" },
    tags: ["Campaign", "Type", "Motion"],
    isFeatured: true,
    visual: "form",
  },
  {
    id: "demo-index",
    publishedAt: "2026-10-10T12:00:00.000Z",
    title: "Index / Archive",
    slug: "index-archive",
    excerpt: "A digital archive with a calm, useful rhythm.",
    description:
      "A flexible interface framework for a growing cultural archive. Information hierarchy, interface tone, and editorial pacing are designed to let the collection take the lead.",
    client: "Index Archive",
    year: 2026,
    services: ["Digital Design", "UI Systems", "Art Direction"],
    category: { name: "Digital", slug: "digital" },
    tags: ["Digital", "UX", "Archive"],
    isFeatured: true,
    visual: "index",
  },
  {
    id: "demo-signal",
    publishedAt: "2026-09-20T12:00:00.000Z",
    title: "Signal / Still",
    slug: "signal-still",
    excerpt: "A campaign framework for a new cultural programme.",
    description:
      "A modular system intended to announce, organise, and extend a changing programme across posters, screens, and social content.",
    client: "Signal / Still",
    year: 2025,
    services: ["Campaign", "Editorial", "Production"],
    category: { name: "Campaigns", slug: "campaigns" },
    tags: ["Campaign", "Editorial"],
    isFeatured: false,
    visual: "studio",
  },
  {
    id: "demo-studio",
    publishedAt: "2026-09-05T12:00:00.000Z",
    title: "Studio Notes",
    slug: "studio-notes",
    excerpt: "An editorial identity for a new kind of reference.",
    description:
      "A restrained identity system focused on material, margins, and an evolving collection of notes.",
    year: 2025,
    services: ["Identity", "Editorial"],
    category: { name: "Brand Identity", slug: "brand-identity" },
    tags: ["Editorial", "Identity"],
    isFeatured: false,
    visual: "mono",
  },
  {
    id: "demo-common",
    title: "Common Ground",
    slug: "common-ground",
    excerpt: "A digital meeting point for a creative community.",
    description: "An illustrative digital design study exploring a simple visual system for sharing ideas, references, and conversations.",
    year: 2026,
    services: ["Digital Design", "Visual Identity"],
    category: { name: "Digital", slug: "digital" },
    tags: ["Digital", "Community"],
    isFeatured: false,
    publishedAt: "2026-10-21T12:00:00.000Z",
    visual: "index",
  },
];

export const demoCategories: PortfolioCategory[] = [
  {
    id: "category-identity",
    name: "Brand Identity",
    slug: "brand-identity",
    description: "Systems built to be recognised, used, and remembered.",
    projectCount: 2,
  },
  {
    id: "category-campaigns",
    name: "Campaigns",
    slug: "campaigns",
    description: "Clear concepts with enough range to travel.",
    projectCount: 2,
  },
  {
    id: "category-digital",
    name: "Digital",
    slug: "digital",
    description: "Useful interfaces with an editorial point of view.",
    projectCount: 2,
  },
];

export const demoServices: PortfolioService[] = [
  {
    id: "service-identity",
    title: "Brand Identity",
    slug: "brand-identity",
    description: "Distinct visual systems built for recognition and longevity.",
    iconKey: "Shapes",
  },
  {
    id: "service-campaign",
    title: "Campaign Art Direction",
    slug: "campaign-art-direction",
    description: "Clear ideas with a visual language made to move.",
    iconKey: "Sparkles",
  },
  {
    id: "service-digital",
    title: "Digital Design",
    slug: "digital-design",
    description: "Focused digital experiences with an editorial point of view.",
    iconKey: "PanelsTopLeft",
  },
];

export const demoSections: PortfolioSection[] = [
  {
    id: "section-hero",
    key: "hero",
    label: "Hero",
    type: "HERO",
    isVisible: true,
    sortOrder: 0,
    content: {
      eyebrow: "Independent graphic design",
      title: "Ideas, shaped into systems.",
      body: "SHOBAKY STUDIO is the independent practice of Mohamed Alshobaky.",
    },
  },
  {
    id: "section-work",
    key: "featured-work",
    label: "Selected Work",
    type: "FEATURED_PROJECTS",
    isVisible: true,
    sortOrder: 1,
    content: {
      eyebrow: "Selected work",
      title: "Selected with a point of view.",
      background: "dark",
    },
  },
  {
    ...latestProjectsSection,
    id: "section-latest-projects",
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: "section-services",
    key: "services",
    label: "Services",
    type: "SERVICES",
    isVisible: true,
    sortOrder: 4,
    content: null,
  },
  {
    id: "section-cta",
    key: "cta",
    label: "Contact CTA",
    type: "CTA",
    isVisible: true,
    sortOrder: 5,
    content: {
      title: "Have a project in mind?",
      body: "Tell me a little about it, and we can find the right direction.",
    },
  },
];
