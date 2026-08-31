'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from '../actions/auth';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn(username, password);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error('Login submission error:', err);
      setError('Unable to complete sign in. Please check your credentials and try again.');
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(180,174,172,0.25)',
    borderRadius: '6px',
    padding: '12px 16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: '#b4aeac',
    textTransform: 'uppercase',
    marginBottom: '8px',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#111111',
          border: '1px solid rgba(180,174,172,0.2)',
          borderRadius: '10px',
          padding: '44px 38px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(180,174,172,0.3)', marginBottom: '18px' }}>
            <Image src="/logo.png" alt="KRISTY UNISEX SALON" width={64} height={64} priority style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-heading), ui-serif, Georgia, serif', fontSize: '21px', letterSpacing: '0.06em', color: '#ffffff', marginBottom: '6px' }}>
            KRISTY UNISEX SALON
          </p>
          <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '13px', letterSpacing: '0.14em', color: '#c9a96e', textTransform: 'uppercase', fontWeight: 600 }}>
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username */}
          <div>
            <label htmlFor="admin-username" style={labelStyle}>Admin ID</label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kristy"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#c9a96e')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(180,174,172,0.25)')}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-password" style={labelStyle}>Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#c9a96e')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(180,174,172,0.25)')}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif', fontSize: '14px', color: '#e57373', backgroundColor: 'rgba(229,115,115,0.1)', border: '1px solid rgba(229,115,115,0.25)', borderRadius: '6px', padding: '12px 16px' }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#000000',
              backgroundColor: loading ? '#a07840' : '#c9a96e',
              border: 'none',
              borderRadius: '6px',
              padding: '14px 20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '6px',
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#dfc38d'; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#c9a96e'; }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
