-- Add the independently managed Latest Projects section to existing portfolios.
-- CUSTOM is the existing flexible HomeSection type; its key selects the renderer.
DO $$
DECLARE
  latest_order INTEGER;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "HomeSection" WHERE "key" = 'latest-projects') THEN
    SELECT COALESCE((SELECT "sortOrder" + 1 FROM "HomeSection" WHERE "key" = 'featured-work'), 2)
      INTO latest_order;

    UPDATE "HomeSection"
      SET "sortOrder" = "sortOrder" + 1
      WHERE "sortOrder" >= latest_order;

    INSERT INTO "HomeSection" ("id", "key", "label", "type", "isVisible", "sortOrder", "content", "updatedAt")
    VALUES (
      'section_latest_projects',
      'latest-projects',
      'Latest Projects',
      'CUSTOM',
      true,
      latest_order,
      '{"eyebrow":"Latest projects","title":"The latest from the studio.","body":"A look at the six most recently published projects.","background":"light"}'::jsonb,
      CURRENT_TIMESTAMP
    );
  END IF;
END;
$$;
