UPDATE public.governance_units AS existing
SET title = 'Projects Directorate'
WHERE lower(btrim(existing.title)) = 'project directorate'
  AND NOT EXISTS (
    SELECT 1
    FROM public.governance_units AS canonical
    WHERE lower(btrim(canonical.title)) = 'projects directorate'
  );

UPDATE public.governance_units AS existing
SET title = 'Department of Research, Innovation, and Education/Professional Development'
WHERE lower(btrim(existing.title)) = 'research, innovation & professional development'
  AND NOT EXISTS (
    SELECT 1
    FROM public.governance_units AS canonical
    WHERE lower(btrim(canonical.title)) =
      'department of research, innovation, and education/professional development'
  );

WITH desired_units(title, unit_type, sort_order) AS (
  VALUES
    ('Presidium', 'committee', 0),
    ('Parliament', 'committee', 1),
    ('Publicity Department', 'department', 2),
    ('Finance Department', 'department', 3),
    ('Advisors', 'committee', 4),
    ('Department of Welfare', 'department', 5),
    ('Legal and Constitutional Affairs', 'department', 6),
    ('Projects Directorate', 'department', 7),
    ('Department of Research, Innovation, and Education/Professional Development', 'department', 8)
)
INSERT INTO public.governance_units (
  title,
  unit_type,
  sort_order,
  is_visible
)
SELECT desired.title, desired.unit_type, desired.sort_order, true
FROM desired_units AS desired
WHERE NOT EXISTS (
  SELECT 1
  FROM public.governance_units AS existing
  WHERE lower(btrim(existing.title)) = lower(desired.title)
);

WITH desired_units(title, unit_type, sort_order) AS (
  VALUES
    ('Presidium', 'committee', 0),
    ('Parliament', 'committee', 1),
    ('Publicity Department', 'department', 2),
    ('Finance Department', 'department', 3),
    ('Advisors', 'committee', 4),
    ('Department of Welfare', 'department', 5),
    ('Legal and Constitutional Affairs', 'department', 6),
    ('Projects Directorate', 'department', 7),
    ('Department of Research, Innovation, and Education/Professional Development', 'department', 8)
)
UPDATE public.governance_units AS existing
SET
  title = desired.title,
  unit_type = desired.unit_type,
  sort_order = desired.sort_order,
  is_visible = true,
  updated_at = now()
FROM desired_units AS desired
WHERE lower(btrim(existing.title)) = lower(desired.title);
