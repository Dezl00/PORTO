import { PrismaClient, ProjectStatus, SectionType } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { latestProjectsSection } from "../src/lib/home-sections";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed Neon.");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

async function main() {
  const [identity, campaigns, digital] = await Promise.all(
    [
      ["Brand Identity", "brand-identity", "Systems with a clear point of view."],
      ["Campaigns", "campaigns", "Ideas made to travel."],
      ["Digital", "digital", "Digital surfaces with editorial restraint."],
    ].map(([name, slug, description], sortOrder) =>
      prisma.category.upsert({
        where: { slug },
        update: { name, description, sortOrder },
        create: { name, slug, description, sortOrder },
      }),
    ),
  );

  await prisma.project.upsert({
    where: { slug: "noura-objects" },
    update: {},
    create: {
      title: "Noura Objects",
      slug: "noura-objects",
      excerpt: "A tactile identity for a considered objects label.",
      description:
        "Noura Objects is a study in warmth, tactility, and deliberate detail. The system balances a compact wordmark with generous editorial compositions.",
      client: "Noura Objects",
      year: 2026,
      services: ["Brand Strategy", "Identity", "Art Direction"],
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date(),
      categoryId: identity.id,
    },
  });

  await prisma.project.upsert({
    where: { slug: "form-and-field" },
    update: {},
    create: {
      title: "Form & Field",
      slug: "form-and-field",
      excerpt: "An evolving visual language for everyday movement.",
      description: "A lean campaign system built to adapt from print to motion to social surfaces.",
      year: 2026,
      services: ["Campaign", "Typography", "Motion Direction"],
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date(),
      categoryId: campaigns.id,
    },
  });

  await prisma.project.upsert({
    where: { slug: "index-archive" },
    update: {},
    create: {
      title: "Index / Archive",
      slug: "index-archive",
      excerpt: "A digital archive with a calm, useful rhythm.",
      description: "A flexible interface framework for browsing a growing cultural archive.",
      year: 2026,
      services: ["Digital Design", "UI Systems"],
      status: ProjectStatus.PUBLISHED,
      publishedAt: new Date(),
      categoryId: digital.id,
    },
  });

  await Promise.all([
    prisma.service.upsert({
      where: { slug: "brand-identity" },
      update: {},
      create: { title: "Brand Identity", slug: "brand-identity", description: "Distinct visual systems built for recognition and longevity.", iconKey: "Shapes", sortOrder: 0 },
    }),
    prisma.service.upsert({
      where: { slug: "campaign-art-direction" },
      update: {},
      create: { title: "Campaign Art Direction", slug: "campaign-art-direction", description: "Clear ideas with a visual language made to move.", iconKey: "Sparkles", sortOrder: 1 },
    }),
    prisma.service.upsert({
      where: { slug: "digital-design" },
      update: {},
      create: { title: "Digital Design", slug: "digital-design", description: "Focused digital experiences with an editorial point of view.", iconKey: "PanelsTopLeft", sortOrder: 2 },
    }),
  ]);

  await Promise.all([
    prisma.homeSection.upsert({
      where: { key: "hero" },
      update: {},
      create: { key: "hero", label: "Hero", type: SectionType.HERO, sortOrder: 0, content: { eyebrow: "Independent graphic design", title: "Ideas, shaped into systems.", body: "SHOBAKY STUDIO is the independent practice of Mohamed Alshobaky." } },
    }),
    prisma.homeSection.upsert({
      where: { key: "featured-work" },
      update: {},
      create: { key: "featured-work", label: "Selected Work", type: SectionType.FEATURED_PROJECTS, sortOrder: 1, content: { eyebrow: "Selected work", title: "Selected with a point of view.", background: "dark" } },
    }),
    prisma.homeSection.upsert({
      where: { key: latestProjectsSection.key },
      update: {},
      create: { ...latestProjectsSection, sortOrder: 2 },
    }),
    prisma.homeSection.upsert({
      where: { key: "services" },
      update: {},
      create: { key: "services", label: "Services", type: SectionType.SERVICES, sortOrder: 4 },
    }),
    prisma.homeSection.upsert({
      where: { key: "cta" },
      update: {},
      create: { key: "cta", label: "Contact CTA", type: SectionType.CTA, sortOrder: 5, content: { title: "Have a project in mind?", body: "Tell me a little about it, and we can find the right direction." } },
    }),
  ]);

  await prisma.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: {
      id: "site",
      socialLinks: { instagram: "", behance: "", linkedin: "" },
      contactDetails: { email: "hello@shobakystudio.com", whatsapp: "" },
    },
  });
}

main()
  .then(() => console.log("Seeded SHOBAKY STUDIO."))
  .finally(async () => prisma.$disconnect());
