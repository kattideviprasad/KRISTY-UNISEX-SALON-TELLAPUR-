-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Adds a `location` column to the bookings table for the two-studios feature.

-- 1. Add the location column (enum-style text, default 'tellapur' for all existing rows)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT 'tellapur'
  CHECK (location IN ('tellapur', 'gopanpally'));

-- 2. Confirm existing rows all get 'tellapur' (already handled by DEFAULT above,
--    but this explicit UPDATE ensures any edge cases are covered)
UPDATE bookings SET location = 'tellapur' WHERE location IS NULL OR location NOT IN ('tellapur', 'gopanpally');

-- 3. (Optional) View what's there
-- SELECT id, customer_name, location, preferred_date FROM bookings ORDER BY created_at DESC LIMIT 20;
