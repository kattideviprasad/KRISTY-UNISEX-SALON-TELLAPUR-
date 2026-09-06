-- ═══════════════════════════════════════════════════════════════════════════
-- KRISTY UNISEX SALON — Add service_id to feedback table
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this in the Supabase SQL Editor BEFORE deploying the updated code.
-- This adds an optional service reference to feedback entries.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES services_v2(id) ON DELETE SET NULL;
