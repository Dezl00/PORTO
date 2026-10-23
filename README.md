# SHOBAKY STUDIO

A fast, English-only portfolio and private CMS for **MOHAMED ALSHOBAKY**, built with Next.js, Prisma, Neon PostgreSQL, and Cloudinary.

## Included

- Flat, monochrome, responsive portfolio with locally bundled IBM Plex Sans.
- Project pages at `/projects/[slug]`, with editable unique slugs and redirects for changed published slugs.
- Categories, services, project covers, content blocks, SEO fields, contact inbox, homepage section visibility/order, and site settings.
- Selected Work uses only projects manually marked as featured, with three cards per desktop row. Latest Projects independently shows the six newest published projects.
- Regular project grids adapt from one to six columns; homepage section backgrounds can be white, light gray, or black.
- One-owner admin at `/admin`; no public sign-up, roles, or multi-user management.
- Signed Cloudinary uploads: the API secret remains server-only.
- Prisma schema, Neon-ready config, seed data, metadata, sitemap, robots.txt, and Vercel-ready build scripts.

## Run the visual demo locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a database connection, the public portfolio runs using clearly labelled demo content. The local-only admin demo login is:

```text
Email: admin@shobakystudio.local
Password: studio-demo
```

Those fallback credentials are disabled in production.

## Connect Neon and Cloudinary

1. Copy `.env.example` to `.env.local`.
2. Add Neon URLs:
   - `DATABASE_URL`: Neon pooled runtime connection string.
   - `DIRECT_URL`: Neon direct connection string for migrations.
3. Add the three Cloudinary server credentials.
4. Set `DEMO_MODE=false`.
5. Create an owner password hash:

```bash
npm run hash-password -- "choose-a-strong-password"
```

Paste the returned hash into `ADMIN_PASSWORD_HASH`, set `ADMIN_EMAIL`, and use a long random value for `AUTH_SECRET`.

6. Apply the included database migration and starter content:

```bash
npm run db:deploy
npm run db:seed
```

Prisma reads `.env.local` as well as `.env`, so the same local variables work for both Next.js and database commands.

## Admin workflow

1. Sign in at `/admin`.
2. Add categories, services, and homepage sections.
3. Create a project, choose its editable slug, and upload a Cloudinary cover.
4. Add ordered text or image blocks to build the project case study.
5. Publish it. Public pages, category pages, metadata, and sitemap are revalidated automatically.

To curate Selected Work, enable **Feature in Selected Work** in the project editor. Latest Projects uses publication dates automatically. Both sections have separate visibility, order, text, and background controls at `/admin/home`.

The Hero section also supports an optional Cloudinary image, alt text, and a visibility toggle. Leaving the image empty or hiding it removes the image column and centers the content. Mobile always shows centered text and buttons below the optional image.

The homepage no longer displays the Practice Areas section; project categories and category pages remain available. Desktop navigation uses a floating glass capsule. Public pages reveal individual content units on entry using one IntersectionObserver, with no animation dependency. Content stays visible without JavaScript, keyboard focus reveals hidden units immediately, and reduced-motion preferences disable reveal effects.

After updating an existing database, run `npm run db:deploy` to add the Latest Projects section while preserving existing sections and their content.

## Deploy to Vercel

Before the first production deploy, run migrations against Neon:

```bash
npm run db:deploy
npm run db:seed
```

Then import the repository in Vercel and configure these production environment variables:

```text
DATABASE_URL
DIRECT_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD_HASH
AUTH_SECRET
DEMO_MODE=false
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

The build command is already `prisma generate && next build`. Do not commit `.env.local` or any production credentials.

## Useful commands

```bash
npm run dev          # development server
npm run lint         # lint source files
npm run build        # generate Prisma client and make production build
npm run db:generate  # regenerate Prisma client
npm run db:migrate   # create a future development migration after editing the schema
npm run db:deploy    # apply existing migrations to production
npm run db:seed      # add starter content to Neon
```
