'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { fetchFeedbackData, type FeedbackRow } from './actions/feedback-data';
import type { BranchValue } from '@/components/BranchSwitcher';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return dateStr; }
}

function StarDisplay({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: `${size}px`,
            color: star <= rating ? '#c9a96e' : 'rgba(180,174,172,0.3)',
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortField = 'rating' | 'created_at';
type SortDir = 'asc' | 'desc';

// ─── Main component ──────────────────────────────────────────────────────────

export default function FeedbackDashboard({
  branchSlug,
}: {
  branchSlug: BranchValue;
}) {
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [stats, setStats] = useState({ total: 0, averageRating: 0 });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadFeedback = useCallback(async (slug: BranchValue) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await fetchFeedbackData(slug);
      setFeedback(result.feedback);
      setStats(result.stats);
      if (result.error) setFetchError(result.error);
    } catch {
      setFetchError('Failed to load feedback.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Silent refresh: updates data without showing loading spinner
  const silentRefresh = useCallback(async (slug: BranchValue) => {
    try {
      const result = await fetchFeedbackData(slug);
      if (!result.error) {
        setFeedback(result.feedback);
        setStats(result.stats);
      }
    } catch {
      // Silently ignore errors on auto-refresh
    }
  }, []);

  useEffect(() => {
    loadFeedback(branchSlug);
  }, [branchSlug, loadFeedback]);

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
    if (!q) return feedback;
    return feedback.filter(
      (f) => f.customer_name.toLowerCase().includes(q) || f.customer_phone.includes(q)
    );
  }, [feedback, search]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortField === 'rating') {
        return sortDir === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      }
      return sortDir === 'desc'
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at);
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
          Loading feedback…
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
          {
            label: 'Average Rating',
            value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—',
            accent: true,
            extra: stats.averageRating > 0 ? (
              <div style={{ marginTop: '8px' }}>
                <StarDisplay rating={Math.round(stats.averageRating)} size={20} />
              </div>
            ) : null,
          },
          { label: 'Total Feedback', value: stats.total },
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
            {'extra' in s && s.extra}
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
          placeholder="Search by customer name or phone…"
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
        {sorted.length} feedback entr{sorted.length !== 1 ? 'ies' : 'y'}
        {search ? ` · matching "${search}"` : ''}
      </p>

      {/* ── Feedback table ── */}
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
              {search ? 'No results found' : 'No feedback yet'}
            </p>
            <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '16px', color: '#b4aeac', marginTop: '10px', maxWidth: '640px', marginInline: 'auto', lineHeight: 1.6 }}>
              {search
                ? `No feedback matches "${search}". Try clearing your search.`
                : 'Feedback will appear here once customers submit reviews.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.6fr 1.1fr 0.8fr 1fr 1fr 1.8fr 1fr',
                gap: '12px',
                padding: '16px 24px',
                borderBottom: '1px solid rgba(180,174,172,0.15)',
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
              className="hidden-mobile"
            >
              {[
                { label: 'Customer', sortable: false },
                { label: 'Phone', sortable: false },
                { label: 'Branch', sortable: false },
                { label: 'Service', sortable: false },
                { label: 'Rating', sortable: true, field: 'rating' as SortField },
                { label: 'Comment', sortable: false },
                { label: 'Date', sortable: true, field: 'created_at' as SortField },
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
            {sorted.map((fb) => {
              const isExpanded = expandedId === fb.id;
              return (
                <div key={fb.id} style={{ borderBottom: '1px solid rgba(180,174,172,0.08)' }}>
                  {/* Desktop row */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : fb.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.6fr 1.1fr 0.8fr 1fr 1fr 1.8fr 1fr',
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
                      <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '17px', color: '#ffffff', fontWeight: 600 }}>
                        {fb.customer_name}
                      </span>
                      <span style={{ fontSize: '11px', color: isExpanded ? '#c9a96e' : '#8e8886', transition: 'color 0.15s' }}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>

                    {/* Phone */}
                    <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '16px', color: '#c9a96e', fontWeight: 500 }}>
                      {fb.customer_phone}
                    </span>

                    {/* Branch */}
                    <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#b4aeac', textTransform: 'capitalize' }}>
                      {fb.branch_slug === 'gopanpally' ? 'Gopanpally' : fb.branch_slug ? 'Tellapur' : '—'}
                    </span>

                    {/* Service */}
                    <span style={{
                      fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                      fontSize: '14px',
                      color: fb.service_name ? '#e2dedb' : '#646464',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {fb.service_name ?? '—'}
                    </span>

                    {/* Rating */}
                    <div>
                      <StarDisplay rating={fb.rating} size={16} />
                    </div>

                    {/* Comment */}
                    <span style={{
                      fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#e2dedb',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {fb.comment || '—'}
                    </span>

                    {/* Date */}
                    <span style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#8e8886' }}>
                      {formatDate(fb.created_at)}
                    </span>
                  </div>

                  {/* Mobile card */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : fb.id)}
                    style={{
                      padding: '20px 24px',
                      cursor: 'pointer',
                      borderTop: '1px solid rgba(180,174,172,0.08)',
                      backgroundColor: isExpanded ? 'rgba(201,169,110,0.06)' : 'transparent',
                    }}
                    className="mobile-only"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '18px', color: '#ffffff', fontWeight: 600 }}>
                          {fb.customer_name}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '15px', color: '#c9a96e', marginTop: '4px', fontWeight: 500 }}>
                          {fb.customer_phone}
                        </p>
                      </div>
                      <StarDisplay rating={fb.rating} size={16} />
                    </div>
                    <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#b4aeac' }}>
                      {formatDate(fb.created_at)} · {fb.branch_slug === 'gopanpally' ? 'Gopanpally' : 'Tellapur'}
                      {fb.service_name && ` · ${fb.service_name}`}
                    </p>
                  </div>

                  {/* Expanded comment */}
                  {isExpanded && fb.comment && (
                    <div style={{ backgroundColor: '#0c0c0c', borderTop: '1px solid rgba(180,174,172,0.12)', padding: '20px 28px' }}>
                      <p style={{
                        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                        fontSize: '13px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#8e8886',
                        fontWeight: 600,
                        marginBottom: '10px',
                      }}>
                        Full Comment
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                        fontSize: '15px',
                        color: '#e2dedb',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}>
                        {fb.comment}
                      </p>
                    </div>
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
