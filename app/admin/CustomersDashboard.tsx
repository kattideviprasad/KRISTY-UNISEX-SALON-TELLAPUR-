'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { fetchCustomersData, type CustomerRow, type CustomerBooking } from './actions/customers-data';
import type { BranchValue } from '@/components/BranchSwitcher';

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

// ─── Status badge (reusing booking status colors) ─────────────────────────────

const VISIT_STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  new:     { bg: 'rgba(201,169,110,0.12)', color: '#c9a96e', border: 'rgba(201,169,110,0.4)' },
  regular: { bg: 'rgba(100,185,120,0.12)', color: '#7ecf91', border: 'rgba(100,185,120,0.4)' },
};

function VisitStatusBadge({ visitCount }: { visitCount: number }) {
  const status = visitCount >= 2 ? 'regular' : 'new';
  const style = VISIT_STATUS_COLORS[status];
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
      {status === 'regular' ? 'Regular' : 'New'}
    </span>
  );
}

// ─── Booking status badge ─────────────────────────────────────────────────────

const BOOKING_STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  pending:   { bg: 'rgba(201,169,110,0.12)', color: '#c9a96e',  border: 'rgba(201,169,110,0.4)' },
  confirmed: { bg: 'rgba(100,185,120,0.12)', color: '#7ecf91',  border: 'rgba(100,185,120,0.4)' },
  cancelled: { bg: 'rgba(229,115,115,0.12)', color: '#e57373',  border: 'rgba(229,115,115,0.4)' },
  completed: { bg: 'rgba(130,150,200,0.12)', color: '#8ea9d4',  border: 'rgba(130,150,200,0.4)' },
};

function BookingStatusBadge({ status }: { status: string }) {
  const style = BOOKING_STATUS_COLORS[status] ?? BOOKING_STATUS_COLORS.pending;
  return (
    <span
      style={{
        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: style.color,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '4px',
        padding: '3px 8px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

// ─── Customer detail panel (booking history) ──────────────────────────────────

function CustomerDetail({ bookings }: { bookings: CustomerBooking[] }) {
  if (bookings.length === 0) {
    return (
      <div style={{ backgroundColor: '#0c0c0c', borderTop: '1px solid rgba(180,174,172,0.12)', padding: '24px 28px' }}>
        <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#8e8886' }}>
          No booking history found.
        </p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0c0c0c', borderTop: '1px solid rgba(180,174,172,0.12)', padding: '20px 28px' }}>
      <p style={{
        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
        fontSize: '13px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#8e8886',
        fontWeight: 600,
        marginBottom: '14px',
      }}>
        Booking History ({bookings.length})
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.5fr 1fr 0.8fr',
              gap: '12px',
              padding: '10px 16px',
              backgroundColor: '#111111',
              borderRadius: '6px',
              border: '1px solid rgba(180,174,172,0.08)',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#ffffff', fontWeight: 500 }}>
              {formatDate(b.booking_date)} · {formatTime(b.booking_time)}
            </span>
            <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#e2dedb' }}>
              {b.service_name ?? '—'}
            </span>
            <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '13px', color: '#b4aeac', textTransform: 'capitalize' }}>
              {b.branch_slug === 'gopanpally' ? 'Gopanpally' : b.branch_slug ? 'Tellapur' : '—'}
            </span>
            <div>
              <BookingStatusBadge status={b.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortField = 'visit_count' | 'last_visit_date';
type SortDir = 'asc' | 'desc';

// ─── Main component ──────────────────────────────────────────────────────────

export default function CustomersDashboard({
  branchSlug,
}: {
  branchSlug: BranchValue;
}) {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [stats, setStats] = useState({ total: 0, newThisMonth: 0, repeatVisitors: 0 });
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('last_visit_date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const loadCustomers = useCallback(async (slug: BranchValue) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await fetchCustomersData(slug);
      setCustomers(result.customers);
      setStats(result.stats);
      if (result.error) setFetchError(result.error);
    } catch {
      setFetchError('Failed to load customers.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Silent refresh: updates data without showing loading spinner
  const silentRefresh = useCallback(async (slug: BranchValue) => {
    try {
      const result = await fetchCustomersData(slug);
      if (!result.error) {
        setCustomers(result.customers);
        setStats(result.stats);
      }
    } catch {
      // Silently ignore errors on auto-refresh
    }
  }, []);

  useEffect(() => {
    loadCustomers(branchSlug);
  }, [branchSlug, loadCustomers]);

  // Auto-refresh every 60 seconds (silent — no spinner)
  useEffect(() => {
    const interval = setInterval(() => {
      silentRefresh(branchSlug);
    }, 60_000);
    return () => clearInterval(interval);
  }, [branchSlug, silentRefresh]);

  // Search filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = customers;
    if (q) {
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }
    return result;
  }, [customers, search]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortField === 'visit_count') {
        return sortDir === 'desc' ? b.visit_count - a.visit_count : a.visit_count - b.visit_count;
      }
      // last_visit_date
      const aDate = a.last_visit_date ?? '';
      const bDate = b.last_visit_date ?? '';
      return sortDir === 'desc' ? bDate.localeCompare(aDate) : aDate.localeCompare(bDate);
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function sortIndicator(field: SortField) {
    if (sortField !== field) return ' ↕';
    return sortDir === 'desc' ? ' ↓' : ' ↑';
  }

  const sectionLabel: React.CSSProperties = {
    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#8e8886',
    fontWeight: 600,
  };

  return (
    <>
      {/* ── Loading ── */}
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
          Loading customers…
        </div>
      )}

      {/* ── Error ── */}
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
          { label: 'Total Customers', value: stats.total },
          { label: 'New This Month', value: stats.newThisMonth },
          { label: 'Repeat Visitors', value: stats.repeatVisitors, accent: true },
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

      {/* ── Search ── */}
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid rgba(180,174,172,0.15)',
          borderRadius: '10px',
          padding: '20px 24px',
          marginBottom: '24px',
        }}
      >
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
            width: '100%',
            maxWidth: '500px',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#c9a96e')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(180,174,172,0.25)')}
        />
      </div>

      {/* ── Results count ── */}
      <p style={{ ...sectionLabel, fontSize: '14px', marginBottom: '14px' }}>
        {sorted.length} customer{sorted.length !== 1 ? 's' : ''}
        {search ? ` · matching "${search}"` : ''}
      </p>

      {/* ── Customer table ── */}
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid rgba(180,174,172,0.15)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {sorted.length === 0 ? (
          <div style={{ padding: '64px 28px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-heading), ui-serif, Georgia, serif', fontSize: '26px', color: '#f2f1ed' }}>
              {search ? 'No results found' : 'No customers yet'}
            </p>
            <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '16px', color: '#b4aeac', marginTop: '10px', maxWidth: '640px', marginInline: 'auto', lineHeight: 1.6 }}>
              {search
                ? `No customers match "${search}". Try clearing your search.`
                : 'Customer records will appear here once bookings are placed.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.8fr 1.4fr 1fr 0.8fr 1.1fr 0.8fr',
                gap: '12px',
                padding: '16px 24px',
                borderBottom: '1px solid rgba(180,174,172,0.15)',
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
              className="hidden-mobile"
            >
              {[
                { label: 'Client Name', sortable: false },
                { label: 'Phone Number', sortable: false },
                { label: 'Branch', sortable: false },
                { label: 'Visits', sortable: true, field: 'visit_count' as SortField },
                { label: 'Last Visit', sortable: true, field: 'last_visit_date' as SortField },
                { label: 'Status', sortable: false },
              ].map((h) => (
                <span
                  key={h.label}
                  onClick={h.sortable ? () => handleSort(h.field!) : undefined}
                  style={{
                    ...sectionLabel,
                    fontSize: '13px',
                    cursor: h.sortable ? 'pointer' : 'default',
                    userSelect: h.sortable ? 'none' : undefined,
                    transition: 'color 0.15s',
                    color: h.sortable && sortField === h.field ? '#c9a96e' : '#8e8886',
                  }}
                >
                  {h.label}{h.sortable ? sortIndicator(h.field!) : ''}
                </span>
              ))}
            </div>

            {/* Rows */}
            {sorted.map((customer) => {
              const isExpanded = expandedId === customer.id;
              return (
                <div key={customer.id} style={{ borderBottom: '1px solid rgba(180,174,172,0.08)' }}>
                  {/* Desktop row */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.8fr 1.4fr 1fr 0.8fr 1.1fr 0.8fr',
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
                    className="hidden-mobile"
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
                        {customer.name}
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
                      {customer.phone}
                    </span>

                    {/* Branch */}
                    <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#b4aeac', textTransform: 'capitalize' }}>
                      {customer.most_recent_branch === 'gopanpally' ? 'Gopanpally' : customer.most_recent_branch ? 'Tellapur' : '—'}
                    </span>

                    {/* Visit Count */}
                    <span style={{ fontFamily: 'var(--font-heading), ui-serif, Georgia, serif', fontSize: '20px', color: '#ffffff', fontWeight: 600 }}>
                      {customer.visit_count}
                    </span>

                    {/* Last Visit */}
                    <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#8e8886' }}>
                      {customer.last_visit_date ? formatDate(customer.last_visit_date) : '—'}
                    </span>

                    {/* Status */}
                    <div>
                      <VisitStatusBadge visitCount={customer.visit_count} />
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : customer.id)}
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
                          {customer.name}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#c9a96e', marginTop: '4px', fontWeight: 500 }}>
                          {customer.phone}
                        </p>
                      </div>
                      <VisitStatusBadge visitCount={customer.visit_count} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#b4aeac' }}>
                      {customer.visit_count} visit{customer.visit_count !== 1 ? 's' : ''} · Last: {customer.last_visit_date ? formatDate(customer.last_visit_date) : '—'}
                    </p>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <CustomerDetail bookings={customer.bookings} />
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
