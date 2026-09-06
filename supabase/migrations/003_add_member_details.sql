-- ═══════════════════════════════════════════════════════════════════════════
-- KRISTY UNISEX SALON — Add Member Details to Customers
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this in the Supabase SQL Editor BEFORE deploying the updated code.
-- This adds dob and preferred_branch_id to customers table to support
-- the new membership sign-up flow.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS dob date,
  ADD COLUMN IF NOT EXISTS preferred_branch_id uuid REFERENCES branches(id) ON DELETE SET NULL;
