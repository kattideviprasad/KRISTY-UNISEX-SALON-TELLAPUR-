'use client';

import { useActionState, useState, useMemo } from 'react';
import { submitFeedback, type FeedbackFormState } from '@/app/actions/feedback';
import type { SalonService } from '@/app/booking/services';

const STARS = [1, 2, 3, 4, 5];

const fieldStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
  fontSize: '16px',
  color: '#000000',
  backgroundColor: '#ffffff',
  border: '1px solid #b4aeac',
  borderRadius: '5px',
  padding: '14px 16px',
  outline: 'none',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#3b3429',
  display: 'block',
  marginBottom: '8px',
};

export default function FeedbackForm({ defaultBranch, services }: { defaultBranch: string; services: SalonService[] }) {
  const [state, formAction, isPending] = useActionState<FeedbackFormState, FormData>(submitFeedback, {
    success: false,
  });
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [phone, setPhone] = useState('');

  // Handle phone input: strictly allow digits only, capped at 10
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  // Group services by category for the dropdown
  const groupedServices = useMemo(() => {
    const groups: Record<string, SalonService[]> = {};
    for (const service of services) {
      const cat = service.category || 'General Services';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(service);
    }
    return groups;
  }, [services]);

  if (state.success) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #b4aeac',
          borderRadius: '5px',
          padding: '48px 32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
        <h2
          style={{
            fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
            fontSize: '28px',
            color: '#3b3429',
            fontWeight: 400,
            marginBottom: '12px',
          }}
        >
          Thank You!
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '16px',
            color: '#646464',
            lineHeight: 1.6,
            maxWidth: '360px',
            margin: '0 auto',
          }}
        >
          Your feedback has been submitted. We truly appreciate you taking the time to share your experience with us.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #b4aeac',
          borderRadius: '5px',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
            fontSize: '24px',
            color: '#3b3429',
            fontWeight: 400,
          }}
        >
          Your Experience
        </h2>

        {/* Error */}
        {state.error && (
          <div
            style={{
              backgroundColor: 'rgba(229,115,115,0.08)',
              border: '1px solid rgba(229,115,115,0.3)',
              borderRadius: '5px',
              padding: '12px 16px',
              color: '#c0392b',
              fontSize: '14px',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            }}
          >
            {state.error}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="feedback-name" style={labelStyle}>Your Name</label>
          <input
            id="feedback-name"
            name="name"
            type="text"
            required
            placeholder="Enter your full name"
            style={fieldStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#3b3429')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#b4aeac')}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="feedback-phone" style={labelStyle}>Phone Number</label>
          <input
            id="feedback-phone"
            name="phone"
            type="tel"
            required
            placeholder="10-digit mobile number"
            value={phone}
            onChange={handlePhoneChange}
            maxLength={10}
            inputMode="numeric"
            style={fieldStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#3b3429')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#b4aeac')}
          />
        </div>

        {/* Branch */}
        <div>
          <label htmlFor="feedback-branch" style={labelStyle}>Branch Visited</label>
          <select
            id="feedback-branch"
            name="branch"
            defaultValue={defaultBranch}
            style={{ ...fieldStyle, cursor: 'pointer', appearance: 'auto' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#3b3429')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#b4aeac')}
          >
            <option value="tellapur">Tellapur — Osman Nagar</option>
            <option value="gopanpally">Gopanpally — The Original</option>
          </select>
        </div>

        {/* Service Received (optional) */}
        <div>
          <label htmlFor="feedback-service" style={labelStyle}>
            Service Received <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#8e8886' }}>(optional)</span>
          </label>
          <select
            id="feedback-service"
            name="service_id"
            defaultValue=""
            style={{ ...fieldStyle, cursor: 'pointer', appearance: 'auto' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#3b3429')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#b4aeac')}
          >
            <option value="">Select a service (optional)</option>
            {Object.entries(groupedServices).map(([category, items]) => (
              <optgroup key={category} label={category}>
                {items.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Star Rating */}
        <div>
          <label style={labelStyle}>Rating</label>
          <input type="hidden" name="rating" value={rating} />
          <div style={{ display: 'flex', gap: '6px' }}>
            {STARS.map((star) => {
              const filled = star <= (hoveredStar || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '36px',
                    lineHeight: 1,
                    color: filled ? '#c9a96e' : '#d4d0cc',
                    transition: 'color 0.15s, transform 0.15s',
                    transform: filled ? 'scale(1.1)' : 'scale(1)',
                    padding: '2px',
                  }}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              );
            })}
          </div>
          {rating === 0 && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#8e8886', marginTop: '6px' }}>
              Tap a star to rate your experience
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="feedback-comment" style={labelStyle}>
            Comments <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#8e8886' }}>(optional)</span>
          </label>
          <textarea
            id="feedback-comment"
            name="comment"
            rows={4}
            placeholder="Tell us about your experience…"
            style={{ ...fieldStyle, resize: 'vertical', minHeight: '100px' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#3b3429')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#b4aeac')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || rating === 0}
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: '#ffffff',
            backgroundColor: isPending ? '#646464' : '#3b3429',
            border: 'none',
            borderRadius: '5px',
            padding: '16px 24px',
            cursor: isPending || rating === 0 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            opacity: rating === 0 ? 0.6 : 1,
            width: '100%',
          }}
        >
          {isPending ? 'Submitting…' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
}
