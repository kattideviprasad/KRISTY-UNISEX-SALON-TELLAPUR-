'use client';

import { useState, useMemo, useTransition } from 'react';
import Image from 'next/image';
import { signOut } from './actions/auth';
import { updateBookingStatus } from './actions/bookings';
import type { Booking } from './page';

// ─── Types & constants ────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending:   { bg: 'rgba(201,169,110,0.12)', color: '#c9a96e',  border: 'rgba(201,169,110,0.4)' },
  confirmed: { bg: 'rgba(100,185,120,0.12)', color: '#7ecf91',  border: 'rgba(100,185,120,0.4)' },
  cancelled: { bg: 'rgba(229,115,115,0.12)', color: '#e57373',  border: 'rgba(229,115,115,0.4)' },
  completed: { bg: 'rgba(130,150,200,0.12)', color: '#8ea9d4',  border: 'rgba(130,150,200,0.4)' },
};

const ALL_STATUSES = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];
const ALL_LOCATIONS = ['all', 'tellapur', 'gopanpally'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return dateStr; }
}

function formatTime(timeStr: string) {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDateTime(isoStr: string) {
  try {
    return new Date(isoStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return isoStr; }
}

function getWeekStart() {
  const now = new Date();
  const d = new Date(now);
  d.setDate(now.getDate() - now.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_COLORS[status] ?? STATUS_COLORS.pending;
  return (
    <span
      style={{
        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: style.color,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '5px',
        padding: '5px 12px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ─── Status action buttons ────────────────────────────────────────────────────

function StatusActions({
  bookingId,
  currentStatus,
  onUpdated,
}: {
  bookingId: string;
  currentStatus: string;
  onUpdated: (id: string, status: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [localError, setLocalError] = useState('');

  const actions = [
    { status: 'confirmed',  label: '✓ Confirm',  show: currentStatus === 'pending' },
    { status: 'completed',  label: '★ Complete',  show: currentStatus === 'confirmed' },
    { status: 'cancelled',  label: '✕ Cancel',   show: currentStatus !== 'cancelled' && currentStatus !== 'completed' },
    { status: 'pending',    label: '↺ Reset to Pending', show: currentStatus === 'cancelled' },
  ].filter((a) => a.show);

  function handleAction(status: string) {
    setLocalError('');
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, status);
      if (result?.error) {
        setLocalError(result.error);
      } else {
        onUpdated(bookingId, status);
      }
    });
  }

  const btnStyle = (status: string): React.CSSProperties => {
    const col = STATUS_COLORS[status] ?? STATUS_COLORS.pending;
    return {
      fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: col.color,
      backgroundColor: col.bg,
      border: `1px solid ${col.border}`,
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: isPending ? 'not-allowed' : 'pointer',
      opacity: isPending ? 0.6 : 1,
      transition: 'opacity 0.15s, background-color 0.15s',
    };
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
      {actions.map((a) => (
        <button
          key={a.status}
          disabled={isPending}
          onClick={() => handleAction(a.status)}
          style={btnStyle(a.status)}
        >
          {a.label}
        </button>
      ))}
      {localError && (
        <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#e57373' }}>
          {localError}
        </span>
      )}
    </div>
  );
}

// ─── Expanded booking detail panel ────────────────────────────────────────────

function BookingDetail({
  booking,
  onUpdated,
}: {
  booking: Booking;
  onUpdated: (id: string, status: string) => void;
}) {
  const row = (label: string, value: React.ReactNode) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid rgba(180,174,172,0.1)',
        alignItems: 'baseline',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
        fontSize: '13px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#8e8886',
        fontWeight: 600,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
        fontSize: '16px',
        color: '#f2f1ed',
        wordBreak: 'break-word',
      }}>
        {value ?? '—'}
      </span>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: '#0c0c0c',
        borderTop: '1px solid rgba(180,174,172,0.12)',
        padding: '24px 28px',
      }}
    >
      <div style={{ maxWidth: '700px' }}>
        {row('Client Name', booking.customer_name)}
        {row('Phone Number', (
          <a href={`tel:${booking.customer_phone}`} style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 600 }}>
            {booking.customer_phone}
          </a>
        ))}
        {booking.customer_email && row('Email Address', booking.customer_email)}
        {row('Requested Service', booking.service_name ?? booking.service_id ?? '—')}
        {row('Preferred Date', formatDate(booking.preferred_date))}
        {row('Preferred Time', formatTime(booking.preferred_time))}
        {booking.location && row('Studio Branch', booking.location === 'gopanpally' ? 'Gopanpally Studio' : 'Tellapur Studio')}
        {row('Current Status', <StatusBadge status={booking.status} />)}
        {booking.notes && row('Client Notes', (
          <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {booking.notes}
          </span>
        ))}
        {row('Submitted On', formatDateTime(booking.created_at))}
        {row('Booking ID', (
          <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#8e8886' }}>
            {booking.id}
          </span>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{
          fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#8e8886',
          marginBottom: '12px',
          fontWeight: 600,
        }}>
          Update Booking Status
        </p>
        <StatusActions
          bookingId={booking.id}
          currentStatus={booking.status}
          onUpdated={onUpdated}
        />
      </div>
    </div>
  );
}

// ─── Main dashboard component ─────────────────────────────────────────────────

export default function BookingsDashboard({
  bookings: initialBookings,
  adminEmail,
  fetchError,
}: {
  bookings: Booking[];
  adminEmail: string;
  fetchError?: string | null;
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [, startTransition] = useTransition();

  // Check if location column exists in any booking
  const hasLocation = bookings.some((b) => 'location' in b && b.location);

  // Stats
  const weekStart = useMemo(() => getWeekStart(), []);
  const stats = useMemo(() => {
    const total = bookings.length;
    const thisWeek = bookings.filter((b) => new Date(b.created_at) >= weekStart).length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    return { total, thisWeek, pending };
  }, [bookings, weekStart]);

  // Filtered bookings
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchLocation = locationFilter === 'all' || (b.location ?? 'tellapur') === locationFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_phone.includes(q);
      return matchStatus && matchLocation && matchSearch;
    });
  }, [bookings, statusFilter, locationFilter, search]);

  function handleStatusUpdated(id: string, status: string) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  const sqlPolicySnippet = `-- Run this in Supabase SQL Editor to allow admin queries to read and update bookings:
DROP POLICY IF EXISTS "admin_read_bookings" ON bookings;
CREATE POLICY "admin_read_bookings" ON bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_update_bookings" ON bookings;
CREATE POLICY "admin_update_bookings" ON bookings FOR UPDATE USING (true) WITH CHECK (true);`;

  function handleCopySql() {
    navigator.clipboard.writeText(sqlPolicySnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const sectionLabel: React.CSSProperties = {
    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#8e8886',
    fontWeight: 600,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#f2f1ed' }}>

      {/* ── Top bar ── */}
      <div
        style={{
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid rgba(180,174,172,0.15)',
          padding: '0 28px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(180,174,172,0.3)', flexShrink: 0 }}>
            <Image src="/logo.png" alt="Kristy" width={42} height={42} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-heading), ui-serif, Georgia, serif', fontSize: '19px', letterSpacing: '0.06em', color: '#ffffff', lineHeight: 1.1 }}>
              KRISTY UNISEX SALON
            </p>
            <p style={{ ...sectionLabel, fontSize: '12px', marginTop: '3px', color: '#c9a96e' }}>Admin Dashboard</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#b4aeac', display: 'none' }} className="md:inline">
            Logged in as <strong style={{ color: '#ffffff' }}>{adminEmail}</strong>
          </span>
          <button
            onClick={handleSignOut}
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.05em',
              color: '#f2f1ed',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(180,174,172,0.3)',
              borderRadius: '6px',
              padding: '8px 18px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c9a96e';
              e.currentTarget.style.color = '#c9a96e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(180,174,172,0.3)';
              e.currentTarget.style.color = '#f2f1ed';
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 28px' }}>

        {/* ── Error Banner if any ── */}
        {fetchError && (
          <div
            style={{
              backgroundColor: 'rgba(229,115,115,0.1)',
              border: '1px solid rgba(229,115,115,0.3)',
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '24px',
              color: '#e57373',
              fontSize: '15px',
            }}
          >
            <strong>Database Query Notice:</strong> {fetchError}
          </div>
        )}

        {/* ── Stats row ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {[
            { label: 'Total Bookings', value: stats.total },
            { label: 'This Week',      value: stats.thisWeek },
            { label: 'Pending Bookings', value: stats.pending, accent: true },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: '#111111',
                border: `1px solid ${s.accent ? 'rgba(201,169,110,0.4)' : 'rgba(180,174,172,0.15)'}`,
                borderRadius: '10px',
                padding: '24px 28px',
              }}
            >
              <p style={{ ...sectionLabel, fontSize: '13px', marginBottom: '12px' }}>{s.label}</p>
              <p
                style={{
                  fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                  fontSize: '44px',
                  color: s.accent ? '#c9a96e' : '#ffffff',
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid rgba(180,174,172,0.15)',
            borderRadius: '10px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <input
            type="search"
            placeholder="Search by client name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '16px',
              color: '#f2f1ed',
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(180,174,172,0.25)',
              borderRadius: '6px',
              padding: '11px 18px',
              outline: 'none',
              minWidth: '260px',
              flex: '1 1 260px',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#c9a96e')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(180,174,172,0.25)')}
          />

          {/* Status tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {ALL_STATUSES.map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    padding: '9px 18px',
                    borderRadius: '6px',
                    border: active ? '1px solid #c9a96e' : '1px solid rgba(180,174,172,0.2)',
                    backgroundColor: active ? 'rgba(201,169,110,0.18)' : 'transparent',
                    color: active ? '#c9a96e' : '#b4aeac',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {s === 'all' ? 'All Statuses' : STATUS_LABELS[s]}
                </button>
              );
            })}
          </div>

          {/* Location filter — only if data has location */}
          {hasLocation && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {ALL_LOCATIONS.map((loc) => {
                const active = locationFilter === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => setLocationFilter(loc)}
                    style={{
                      fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      padding: '9px 18px',
                      borderRadius: '6px',
                      border: active ? '1px solid rgba(180,174,172,0.6)' : '1px solid rgba(180,174,172,0.2)',
                      backgroundColor: active ? 'rgba(180,174,172,0.12)' : 'transparent',
                      color: active ? '#ffffff' : '#8e8886',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textTransform: 'capitalize',
                    }}
                  >
                    {loc === 'all' ? 'All Branches' : loc === 'tellapur' ? 'Tellapur' : 'Gopanpally'}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Results count ── */}
        <p style={{ ...sectionLabel, fontSize: '14px', marginBottom: '14px' }}>
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
          {statusFilter !== 'all' ? ` · ${STATUS_LABELS[statusFilter]}` : ''}
          {search ? ` · matching "${search}"` : ''}
        </p>

        {/* ── Bookings table / cards ── */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid rgba(180,174,172,0.15)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 28px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-heading), ui-serif, Georgia, serif', fontSize: '26px', color: '#f2f1ed' }}>
                No bookings displaying
              </p>
              <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '16px', color: '#b4aeac', marginTop: '10px', maxWidth: '640px', marginInline: 'auto', lineHeight: 1.6 }}>
                {search
                  ? `No bookings match "${search}". Try clearing your search.`
                  : bookings.length === 0
                  ? 'If bookings were submitted on your website but are not appearing here, Supabase Row-Level Security (RLS) is active on the bookings table and needs a SELECT policy.'
                  : 'No bookings match the selected status filter.'}
              </p>

              {bookings.length === 0 && (
                <div
                  style={{
                    marginTop: '28px',
                    maxWidth: '680px',
                    marginInline: 'auto',
                    backgroundColor: '#181818',
                    border: '1px solid rgba(201,169,110,0.3)',
                    borderRadius: '8px',
                    padding: '20px 24px',
                    textAlign: 'left',
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', fontWeight: 600, color: '#c9a96e', marginBottom: '8px' }}>
                    Quick Fix: Run this in Supabase SQL Editor
                  </p>
                  <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '13px', color: '#b4aeac', marginBottom: '14px' }}>
                    Go to <a href="https://supabase.com/dashboard/project/lopyfhtncrhjimnkhfwf/sql/new" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a96e', textDecoration: 'underline' }}>Supabase SQL Editor</a>, paste and run:
                  </p>
                  <pre
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      backgroundColor: '#0a0a0a',
                      padding: '14px',
                      borderRadius: '6px',
                      color: '#7ecf91',
                      overflowX: 'auto',
                      border: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: '14px',
                      lineHeight: 1.5,
                    }}
                  >
                    {sqlPolicySnippet}
                  </pre>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                      onClick={handleCopySql}
                      style={{
                        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: copiedSql ? '#7ecf91' : '#c9a96e',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {copiedSql ? '✓ Copied SQL to Clipboard!' : 'Copy SQL'}
                    </button>
                    <a
                      href="https://supabase.com/dashboard/project/lopyfhtncrhjimnkhfwf/sql/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                        fontSize: '13px',
                        color: '#c9a96e',
                        textDecoration: 'underline',
                      }}
                    >
                      Open Supabase SQL Editor →
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Table header — hidden on mobile */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: hasLocation
                    ? '1.8fr 1.4fr 1.6fr 1.3fr 1.1fr 1fr 1fr'
                    : '1.8fr 1.4fr 1.8fr 1.3fr 1fr 1fr',
                  gap: '12px',
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(180,174,172,0.15)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
                className="hidden-mobile"
              >
                {['Client Name', 'Phone Number', 'Service', 'Appointment', ...(hasLocation ? ['Branch'] : []), 'Status', 'Submitted'].map((h) => (
                  <span key={h} style={{ ...sectionLabel, fontSize: '13px' }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((booking) => {
                const isExpanded = expandedId === booking.id;
                return (
                  <div key={booking.id} style={{ borderBottom: '1px solid rgba(180,174,172,0.08)' }}>
                    {/* ── Desktop row ── */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: hasLocation
                          ? '1.8fr 1.4fr 1.6fr 1.3fr 1.1fr 1fr 1fr'
                          : '1.8fr 1.4fr 1.8fr 1.3fr 1fr 1fr',
                        gap: '12px',
                        padding: '18px 24px',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                        alignItems: 'center',
                        backgroundColor: isExpanded ? 'rgba(201,169,110,0.06)' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isExpanded) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isExpanded) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                            fontSize: '17px',
                            color: '#ffffff',
                            fontWeight: 600,
                          }}
                        >
                          {booking.customer_name}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: isExpanded ? '#c9a96e' : '#8e8886',
                          transition: 'color 0.15s',
                        }}>
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>

                      {/* Phone */}
                      <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '16px', color: '#c9a96e', fontWeight: 500 }}>
                        {booking.customer_phone}
                      </span>

                      {/* Service */}
                      <span
                        style={{
                          fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                          fontSize: '15px',
                          color: '#e2dedb',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {booking.service_name ?? '—'}
                      </span>

                      {/* Date & Time */}
                      <div>
                        <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#ffffff', fontWeight: 500 }}>
                          {formatDate(booking.preferred_date)}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#8e8886', marginTop: '2px' }}>
                          {formatTime(booking.preferred_time)}
                        </p>
                      </div>

                      {/* Location */}
                      {hasLocation && (
                        <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#b4aeac', textTransform: 'capitalize' }}>
                          {booking.location === 'gopanpally' ? 'Gopanpally' : booking.location ? 'Tellapur' : '—'}
                        </span>
                      )}

                      {/* Status */}
                      <div>
                        <StatusBadge status={booking.status} />
                      </div>

                      {/* Submitted */}
                      <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#8e8886' }}>
                        {formatDate(booking.created_at)}
                      </span>
                    </div>

                    {/* ── Mobile card ── */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                      style={{
                        padding: '20px 24px',
                        cursor: 'pointer',
                        borderTop: '1px solid rgba(180,174,172,0.08)',
                        backgroundColor: isExpanded ? 'rgba(201,169,110,0.06)' : 'transparent',
                      }}
                      className="mobile-only"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '18px', color: '#ffffff', fontWeight: 600 }}>
                            {booking.customer_name}
                          </p>
                          <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#c9a96e', marginTop: '4px', fontWeight: 500 }}>
                            {booking.customer_phone}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#b4aeac' }}>
                        {booking.service_name ?? 'Service'} · {formatDate(booking.preferred_date)} at {formatTime(booking.preferred_time)}
                      </p>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <BookingDetail
                        booking={booking}
                        onUpdated={handleStatusUpdated}
                      />
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Responsive CSS — inline for admin only */}
      <style>{`
        .hidden-mobile { display: grid !important; }
        .mobile-only   { display: none !important; }
        @media (max-width: 860px) {
          .hidden-mobile { display: none !important; }
          .mobile-only   { display: block !important; }
        }
      `}</style>
    </div>
  );
}
