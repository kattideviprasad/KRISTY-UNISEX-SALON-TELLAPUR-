'use client';

import { useState, useMemo, useTransition, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { signOut } from './actions/auth';
import { updateBookingStatus } from './actions/bookings';
import { fetchDashboardData } from './actions/dashboard-data';
import type { Booking } from './page';
import BranchSwitcher, { type BranchValue } from '@/components/BranchSwitcher';
import CustomersDashboard from './CustomersDashboard';
import FeedbackDashboard from './FeedbackDashboard';
import MembersDashboard from './MembersDashboard';

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

function getLocalDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDateGroup(dateStr: string, todayStr: string) {
  if (dateStr === todayStr) return { label: 'Today', order: 1 };
  
  const d = new Date(dateStr);
  const t = new Date(todayStr);
  const diff = Math.round((d.getTime() - t.getTime()) / (1000 * 3600 * 24));
  
  if (diff === 1) return { label: 'Tomorrow', order: 2 };
  if (diff > 1 && diff <= 7) return { label: 'Upcoming (Next 7 Days)', order: 3 };
  if (diff > 7) return { label: 'Later', order: 4 };
  return { label: 'Past', order: 5 };
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
  adminEmail,
}: {
  adminEmail: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branchSlug, setBranchSlug] = useState<BranchValue>('tellapur');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'customers' | 'feedback' | 'members'>('bookings');

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Fetch bookings whenever branchSlug changes
  const loadBookings = useCallback(async (slug: BranchValue) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await fetchDashboardData(slug);
      setBookings(result.bookings as Booking[]);
      if (result.error) setFetchError(result.error);
    } catch {
      setFetchError('Failed to load bookings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Silent refresh: updates data without showing loading spinner
  const silentRefreshBookings = useCallback(async (slug: BranchValue) => {
    try {
      const result = await fetchDashboardData(slug);
      if (!result.error) {
        setBookings(result.bookings as Booking[]);
      }
    } catch {
      // Silently ignore errors on auto-refresh
    }
  }, []);

  useEffect(() => {
    loadBookings(branchSlug);
  }, [branchSlug, loadBookings]);

  // Auto-refresh every 60 seconds for the active tab (silent — no spinner)
  useEffect(() => {
    if (activeTab !== 'bookings') return;
    const interval = setInterval(() => {
      silentRefreshBookings(branchSlug);
    }, 60_000);
    return () => clearInterval(interval);
  }, [branchSlug, activeTab, silentRefreshBookings]);

  function handleBranchChange(value: BranchValue) {
    setBranchSlug(value);
    setExpandedId(null);
  }

  // Stats
  const weekStart = useMemo(() => getWeekStart(), []);
  const stats = useMemo(() => {
    const total = bookings.length;
    const thisWeek = bookings.filter((b) => new Date(b.created_at) >= weekStart).length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    return { total, thisWeek, pending };
  }, [bookings, weekStart]);

  // Filtered and sorted bookings
  const filtered = useMemo(() => {
    const res = bookings.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_phone.includes(q);
      return matchStatus && matchSearch;
    });

    const todayStr = getLocalDateString();
    
    res.sort((a, b) => {
      const aGroup = getDateGroup(a.preferred_date, todayStr);
      const bGroup = getDateGroup(b.preferred_date, todayStr);
      
      if (aGroup.order !== bGroup.order) return aGroup.order - bGroup.order;
      
      // Within same group: if past, sort descending. else ascending.
      if (aGroup.order === 5) {
        if (a.preferred_date !== b.preferred_date) return b.preferred_date.localeCompare(a.preferred_date);
        return b.preferred_time.localeCompare(a.preferred_time);
      } else {
        if (a.preferred_date !== b.preferred_date) return a.preferred_date.localeCompare(b.preferred_date);
        return a.preferred_time.localeCompare(b.preferred_time);
      }
    });

    return res;
  }, [bookings, statusFilter, search]);

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
          <BranchSwitcher value={branchSlug} onChange={handleBranchChange} />
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

      {/* ── Tab Bar ── */}
      <div
        style={{
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid rgba(180,174,172,0.15)',
          padding: '0 28px',
          display: 'flex',
          gap: '0',
        }}
      >
        {['bookings', 'customers', 'feedback', 'members'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'bookings' | 'customers' | 'feedback' | 'members')}
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'capitalize',
                color: isActive ? '#c9a96e' : '#8e8886',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #c9a96e' : '2px solid transparent',
                padding: '14px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#b4aeac';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#8e8886';
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 28px' }}>

        {/* ── Bookings Tab ── */}
        {activeTab === 'bookings' && (<>

        {/* ── Loading indicator ── */}
        {isLoading && (
          <div
            style={{
              backgroundColor: 'rgba(201,169,110,0.08)',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: '8px',
              padding: '14px 20px',
              marginBottom: '24px',
              color: '#c9a96e',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(201,169,110,0.3)', borderTopColor: '#c9a96e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Loading bookings…
          </div>
        )}

        {/* ── Error Banner if any ── */}
        {fetchError && !isLoading && (
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
                {search ? 'No results found' : 'No bookings yet'}
              </p>
              <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '16px', color: '#b4aeac', marginTop: '10px', maxWidth: '640px', marginInline: 'auto', lineHeight: 1.6 }}>
                {search
                  ? `No bookings match "${search}". Try clearing your search.`
                  : statusFilter !== 'all'
                  ? 'No bookings match the selected status filter.'
                  : 'No bookings have been placed for this branch yet. They\u2019ll appear here once customers start booking.'}
              </p>
            </div>
          ) : (
            <>
              {/* Table header — hidden on mobile */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 1.4fr 1.8fr 1.3fr 1fr 1fr',
                  gap: '12px',
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(180,174,172,0.15)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
                className="hidden-mobile"
              >
                {['Client Name', 'Phone Number', 'Service', 'Appointment', 'Status', 'Submitted'].map((h) => (
                  <span key={h} style={{ ...sectionLabel, fontSize: '13px' }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((booking, index) => {
                const isExpanded = expandedId === booking.id;
                const todayStr = getLocalDateString();
                const currentGroup = getDateGroup(booking.preferred_date, todayStr).label;
                const prevGroup = index > 0 ? getDateGroup(filtered[index - 1].preferred_date, todayStr).label : null;
                const showHeader = currentGroup !== prevGroup;

                return (
                  <div key={booking.id}>
                    {showHeader && (
                      <div style={{
                        padding: '12px 24px',
                        backgroundColor: currentGroup === 'Today' ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid rgba(180,174,172,0.15)',
                        borderTop: index > 0 ? '1px solid rgba(180,174,172,0.15)' : 'none',
                        color: currentGroup === 'Today' ? '#c9a96e' : '#b4aeac',
                        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        position: 'sticky',
                        top: '70px', // Below the top navbar
                        zIndex: 10,
                      }}>
                        {currentGroup}
                      </div>
                    )}
                    <div style={{ borderBottom: '1px solid rgba(180,174,172,0.08)' }}>
                      {/* ── Desktop row ── */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.8fr 1.4fr 1.8fr 1.3fr 1fr 1fr',
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
                  </div>
                );
              })}
            </>
          )}
        </div>

        </>)}

        {/* ── Customers Tab ── */}
        {activeTab === 'customers' && (
          <CustomersDashboard branchSlug={branchSlug} />
        )}

        {/* ── Feedback Tab ── */}
        {activeTab === 'feedback' && (
          <FeedbackDashboard branchSlug={branchSlug} />
        )}

        {/* ── Members Tab ── */}
        {activeTab === 'members' && (
          <MembersDashboard />
        )}
      </div>

      {/* Responsive CSS — inline for admin only */}
      <style>{`
        .hidden-mobile { display: grid !important; }
        .mobile-only   { display: none !important; }
        @media (max-width: 860px) {
          .hidden-mobile { display: none !important; }
          .mobile-only   { display: block !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
