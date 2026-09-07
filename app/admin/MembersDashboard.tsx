'use client';

import { useState, useEffect, useCallback } from 'react';
import { type MemberRow, fetchMembersData } from './actions/members-data';

export default function MembersDashboard() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof MemberRow>('join_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Silent auto-refresh every 60s
  const silentRefresh = useCallback(async () => {
    setIsLoading(true);
    const newData = await fetchMembersData();
    setMembers(newData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    silentRefresh();
    const interval = setInterval(silentRefresh, 60_000);
    return () => clearInterval(interval);
  }, [silentRefresh]);

  // Derived filtered & sorted data
  const processed = members
    .filter((m) => {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.branch_name && m.branch_name.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal === null) return sortDir === 'asc' ? 1 : -1;
      if (bVal === null) return sortDir === 'asc' ? -1 : 1;

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: keyof MemberRow) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIndicator = ({ field }: { field: keyof MemberRow }) => {
    if (sortField !== field) return <span style={{ opacity: 0.3 }}>↕</span>;
    return <span>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls & Stats */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-between items-stretch md:items-start mb-6">
        <div className="flex-1 min-w-[300px] w-full">
          <input
            type="text"
            placeholder="Search members (name, phone, email, branch)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: '#111111',
              border: '1px solid rgba(201,169,110,0.3)',
              color: '#ffffff',
              borderRadius: '8px',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#111111',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: '12px',
            minWidth: '200px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              color: '#b4aeac',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            Total Members
          </p>
          <p
            style={{
              fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
              fontSize: '32px',
              color: '#c9a96e',
              lineHeight: 1,
            }}
          >
            {members.length}
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(17,17,17,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <span style={{ color: '#c9a96e' }}>Refreshing...</span>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(201,169,110,0.2)',
                  backgroundColor: '#0a0a0a',
                }}
              >
                <th
                  onClick={() => toggleSort('name')}
                  style={{ padding: '16px', cursor: 'pointer', color: '#b4aeac', fontWeight: 500 }}
                >
                  Name <SortIndicator field="name" />
                </th>
                <th
                  style={{ padding: '16px', color: '#b4aeac', fontWeight: 500 }}
                >
                  Contact
                </th>
                <th
                  onClick={() => toggleSort('branch_name')}
                  style={{ padding: '16px', cursor: 'pointer', color: '#b4aeac', fontWeight: 500 }}
                >
                  Branch <SortIndicator field="branch_name" />
                </th>
                <th
                  onClick={() => toggleSort('dob')}
                  style={{ padding: '16px', cursor: 'pointer', color: '#b4aeac', fontWeight: 500 }}
                >
                  Birthday <SortIndicator field="dob" />
                </th>
                <th
                  onClick={() => toggleSort('join_date')}
                  style={{ padding: '16px', cursor: 'pointer', color: '#b4aeac', fontWeight: 500 }}
                >
                  Joined <SortIndicator field="join_date" />
                </th>
              </tr>
            </thead>
            <tbody>
              {processed.map((m) => (
                <tr
                  key={m.id}
                  style={{
                    borderBottom: '1px solid rgba(180,174,172,0.1)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '16px', color: '#f2f1ed' }}>
                    <div style={{ fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontSize: '12px', color: '#c9a96e', marginTop: '4px' }}>{m.tier}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#b4aeac' }}>
                    <div>{m.phone}</div>
                    {m.email && <div style={{ fontSize: '12px', marginTop: '2px' }}>{m.email}</div>}
                  </td>
                  <td style={{ padding: '16px', color: '#b4aeac' }}>
                    {m.branch_name || '—'}
                  </td>
                  <td style={{ padding: '16px', color: '#b4aeac' }}>
                    {m.dob ? new Date(m.dob).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td style={{ padding: '16px', color: '#b4aeac' }}>
                    {new Date(m.join_date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {processed.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#646464' }}>
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
