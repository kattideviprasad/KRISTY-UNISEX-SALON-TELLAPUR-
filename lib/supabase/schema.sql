-- ─── KRISTY UNISEX SALON — Supabase Schema ──────────────────────────────
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/lopyfhtncrhjimnkhfwf/sql/new

-- Enable UUID extension (should already be available)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── services table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text        NOT NULL,
  description       text,
  price_inr         integer,                    -- price in Indian Rupees
  duration_minutes  integer,
  category          text,                       -- e.g. 'Hair', 'Face & Skin Care', 'Bridal & Makeup'
  is_active         boolean     NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ─── bookings table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name     text        NOT NULL,
  customer_phone    text        NOT NULL,
  customer_email    text,
  service_id        uuid        REFERENCES services(id) ON DELETE SET NULL,
  service_name      text,
  preferred_date    date        NOT NULL,
  preferred_time    time        NOT NULL,
  notes             text,
  status            text        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','confirmed','cancelled')),
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ─── Row Level Security (RLS) ────────────────────────────────────────────
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "public_read_active_services" ON services;
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
DROP POLICY IF EXISTS "public_read_bookings" ON bookings;

-- Anyone can read active services
CREATE POLICY "public_read_active_services"
  ON services FOR SELECT
  USING (is_active = true);

-- Anyone can insert a booking (client booking form)
CREATE POLICY "public_insert_bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- ─── Seed Salon Services ─────────────────────────────────────────────────
INSERT INTO services (name, category, duration_minutes) VALUES
  ('Facial', 'Face & Skin Care', 45),
  ('Anti Acne Facial', 'Face & Skin Care', 60),
  ('Skin Treatment', 'Face & Skin Care', 60),
  ('Skin Treatment – Anti Acne', 'Face & Skin Care', 60),
  ('D-Tan Pack – Face', 'Face & Skin Care', 30),
  ('Tan Pack – Face', 'Face & Skin Care', 30),
  ('Chemical Peel Treatment', 'Face & Skin Care', 45),
  ('Facial Wrinkles', 'Face & Skin Care', 60),
  ('Radiance Rejuvenating Cocoa Facial', 'Face & Skin Care', 60),
  ('Facial Glow', 'Face & Skin Care', 45),
  ('Pimple Treatment', 'Face & Skin Care', 45),
  ('Vital Peel Facial', 'Face & Skin Care', 60),
  ('Thermo Herb Facial', 'Face & Skin Care', 60),
  ('Hair Cut', 'Hair', 30),
  ('Advance Hair Cut', 'Hair', 45),
  ('Hair Styling', 'Hair', 45),
  ('Hair Extension', 'Hair', 90),
  ('Shaving', 'Hair', 20),
  ('Basic Makeup', 'Bridal & Makeup', 60),
  ('Bridal Package', 'Bridal & Makeup', 180),
  ('Basic Mehandi', 'Bridal & Makeup', 60),
  ('Bridal Mehandi', 'Bridal & Makeup', 120),
  ('Threading – Eyebrows', 'Threading', 15),
  ('Premium Manicure', 'Nails', 45);
