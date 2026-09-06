-- ═══════════════════════════════════════════════════════════════════════════
-- KRISTY UNISEX SALON — Multi-Branch Schema Migration
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/lopyfhtncrhjimnkhfwf/sql/new
--
-- This creates NEW tables alongside the existing ones. It does NOT drop
-- the original "bookings" or "services" tables.
-- ═══════════════════════════════════════════════════════════════════════════

-- Ensure UUID generation is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. branches ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS branches (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text        NOT NULL UNIQUE CHECK (slug IN ('tellapur', 'gopanpally')),
  name       text        NOT NULL,
  address    text,
  phone      text,
  hours      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── 2. customers ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  phone      text        NOT NULL UNIQUE,
  email      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── 3. staff ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id  uuid        NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  role       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── 4. services (new version — "services_v2") ─────────────────────────
-- Named "services_v2" to avoid conflicting with the existing "services" table.
-- Once old data is migrated you can rename / drop the original.
CREATE TABLE IF NOT EXISTS services_v2 (
  id               uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text    NOT NULL,
  category         text,
  price            integer,           -- price in INR (whole rupees)
  duration_minutes integer,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ─── 5. packages ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
  id          uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text     NOT NULL,
  price       integer,
  service_ids uuid[],
  gender      text     CHECK (gender IN ('men', 'women')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── 6. bookings (new version — "bookings_v2") ─────────────────────────
CREATE TABLE IF NOT EXISTS bookings_v2 (
  id           uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id    uuid  NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  customer_id  uuid  NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_id   uuid  REFERENCES services_v2(id) ON DELETE SET NULL,
  package_id   uuid  REFERENCES packages(id) ON DELETE SET NULL,
  staff_id     uuid  REFERENCES staff(id) ON DELETE SET NULL,
  booking_date date  NOT NULL,
  booking_time time  NOT NULL,
  status       text  NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','completed','cancelled')),
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ─── 7. memberships ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memberships (
  id          uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid  NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  tier        text,
  start_date  date,
  expiry_date date,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── 8. feedback ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id   uuid    NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  customer_id uuid    REFERENCES customers(id) ON DELETE SET NULL,
  rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── 9. billing ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS billing (
  id              uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      uuid  NOT NULL REFERENCES bookings_v2(id) ON DELETE CASCADE,
  amount          integer,
  payment_method  text,
  payment_status  text  NOT NULL DEFAULT 'unpaid'
                        CHECK (payment_status IN ('unpaid', 'test_paid')),
  created_at      timestamptz NOT NULL DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS on every table
ALTER TABLE branches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback    ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing     ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ────────────────────────────────────────────────────────
-- The service role key bypasses RLS entirely, so server-side writes
-- (booking.ts server action) do NOT need public INSERT/SELECT policies
-- on sensitive tables like customers, bookings_v2, or billing.
--
-- Only grant public access to non-sensitive, read-only data needed by the
-- client-side booking form UI.

-- Feedback: public can insert (future client-side feedback form)
DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
DROP POLICY IF EXISTS "public_insert_feedback" ON feedback;
CREATE POLICY "public_insert_feedback"
  ON feedback FOR INSERT
  TO public
  WITH CHECK (true);

-- Memberships: public can insert (future client-side signup)
DROP POLICY IF EXISTS "anon_insert_memberships" ON memberships;
DROP POLICY IF EXISTS "public_insert_memberships" ON memberships;
CREATE POLICY "public_insert_memberships"
  ON memberships FOR INSERT
  TO public
  WITH CHECK (true);

-- ── Public read policies (non-sensitive data for the booking form) ──────
-- Branches: public can read (needed to resolve slug → branch_id in UI)
DROP POLICY IF EXISTS "anon_read_branches" ON branches;
DROP POLICY IF EXISTS "public_read_branches" ON branches;
CREATE POLICY "public_read_branches"
  ON branches FOR SELECT
  TO public
  USING (true);

-- Services_v2: public can read (needed for service dropdown)
DROP POLICY IF EXISTS "anon_read_services_v2" ON services_v2;
DROP POLICY IF EXISTS "public_read_services_v2" ON services_v2;
CREATE POLICY "public_read_services_v2"
  ON services_v2 FOR SELECT
  TO public
  USING (true);

-- Packages: public can read (for future package selection UI)
DROP POLICY IF EXISTS "anon_read_packages" ON packages;
DROP POLICY IF EXISTS "public_read_packages" ON packages;
CREATE POLICY "public_read_packages"
  ON packages FOR SELECT
  TO public
  USING (true);

-- Clean up any stale policies from previous migrations
DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
DROP POLICY IF EXISTS "public_insert_customers" ON customers;
DROP POLICY IF EXISTS "public_select_customers_by_phone" ON customers;
DROP POLICY IF EXISTS "anon_insert_bookings_v2" ON bookings_v2;
DROP POLICY IF EXISTS "public_insert_bookings_v2" ON bookings_v2;



-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA — Branch locations
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO branches (slug, name, address, phone, hours) VALUES
  (
    'tellapur',
    'KRISTY Unisex Salon — Tellapur',
    'Door No 27, 14/32, Osman Nagar Rd, beside Vision Arsha, Tellapur, Hyderabad, Telangana 502034',
    '095156 25554',
    '8:00 AM - 10:00 PM'
  ),
  (
    'gopanpally',
    'KRISTY Unisex Salon — Gopanpally',
    '1st Floor, Tellapur Rd, opp. Muppa Green Grandeur, Gopanpalle, Gopanpally, Hyderabad, Telangana 500046',
    '091532 24444',
    '7:00 AM - 11:00 PM'
  )
ON CONFLICT (slug) DO UPDATE SET
  name    = EXCLUDED.name,
  address = EXCLUDED.address,
  phone   = EXCLUDED.phone,
  hours   = EXCLUDED.hours;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION (uncomment to run after migration)
-- ═══════════════════════════════════════════════════════════════════════════
-- SELECT * FROM branches;
-- SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public'
--   ORDER BY table_name;
