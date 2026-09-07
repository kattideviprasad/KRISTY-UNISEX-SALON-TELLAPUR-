-- Add indexes to improve dashboard query performance

CREATE INDEX IF NOT EXISTS idx_bookings_v2_branch_id_created_at 
ON bookings_v2 (branch_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_v2_branch_id_booking_date 
ON bookings_v2 (branch_id, booking_date DESC, booking_time DESC);
