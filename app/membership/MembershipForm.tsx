'use client';

import { useState } from 'react';
import { joinMembership } from '@/app/actions/membership';
import { useFormStatus } from 'react-dom';

type Branch = {
  id: string;
  name: string;
};

type MembershipFormProps = {
  branches: Branch[];
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%',
        padding: '16px',
        backgroundColor: '#c9a96e',
        color: '#000000',
        border: 'none',
        borderRadius: '0',
        fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
        fontSize: '18px',
        letterSpacing: '0.05em',
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.7 : 1,
        transition: 'opacity 0.2s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {pending ? (
        <>
          <span
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(0,0,0,0.2)',
              borderTopColor: '#000000',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          JOINING...
        </>
      ) : (
        'JOIN KRISTY CLUB'
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}

export default function MembershipForm({ branches }: MembershipFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await joinMembership(formData);

    if (res.error) {
      setErrorMessage(res.error);
    } else if (res.success) {
      setSuccessMessage(`${res.message} Your Membership ID is: ${res.membershipId}`);
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(201,169,110,0.3)',
    color: '#ffffff',
    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
    fontSize: '13px',
    color: '#b4aeac',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  };

  if (successMessage) {
    return (
      <div
        style={{
          padding: '48px',
          backgroundColor: '#111111',
          border: '1px solid rgba(201,169,110,0.2)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>✨</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
            fontSize: '28px',
            color: '#c9a96e',
            marginBottom: '16px',
          }}
        >
          Welcome to the Club!
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '15px',
            color: '#b4aeac',
            lineHeight: 1.6,
          }}
        >
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '32px',
        backgroundColor: '#111111',
        border: '1px solid rgba(201,169,110,0.2)',
      }}
    >
      {errorMessage && (
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#f87171',
            marginBottom: '24px',
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '14px',
          }}
        >
          {errorMessage}
        </div>
      )}

      <form action={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Jane Doe"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.8)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.3)')}
          />
        </div>

        <div>
          <label style={labelStyle}>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            maxLength={10}
            placeholder="10-digit mobile number"
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            }}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.8)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.3)')}
          />
        </div>

        <div>
          <label style={labelStyle}>Email Address (Optional)</label>
          <input
            type="email"
            name="email"
            placeholder="jane@example.com"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.8)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.3)')}
          />
        </div>

        <div>
          <label style={labelStyle}>Date of Birth (Optional)</label>
          <input
            type="date"
            name="dob"
            style={{ ...inputStyle, colorScheme: 'dark' }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.8)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.3)')}
          />
          <p
            style={{
              marginTop: '6px',
              fontSize: '12px',
              color: '#646464',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            }}
          >
            Join the club to receive special birthday perks!
          </p>
        </div>

        <div>
          <label style={labelStyle}>Preferred Branch *</label>
          <select
            name="preferred_branch_id"
            required
            style={{
              ...inputStyle,
              appearance: 'none',
              backgroundImage:
                'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23c9a96e%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '12px auto',
              paddingRight: '40px',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.8)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.3)')}
          >
            <option value="">Select a branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '16px' }}>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
