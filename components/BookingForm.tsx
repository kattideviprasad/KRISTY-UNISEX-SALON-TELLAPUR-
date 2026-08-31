'use client';

import { useActionState, useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitBooking, type BookingFormState } from '@/app/actions/booking';

type Service = {
  id: string;
  name: string;
  price_inr?: number | null;
  duration_minutes?: number | null;
  category?: string;
};

const initialState: BookingFormState = { success: false };

// Available daily salon time slots (09:00 AM to 09:30 PM)
const ALL_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30',
];

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
  fontSize: '14px',
  color: '#000000',
  backgroundColor: '#ffffff',
  border: '1px solid #b4aeac',
  borderRadius: '5px',
  padding: '12px 14px',
  width: '100%',
  display: 'block',
  transition: 'border-color 0.2s',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
  fontSize: '12px',
  color: '#646464',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '8px',
};

function getLocalDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function BookingForm({ services }: { services: Service[] }) {
  const [state, formAction, isPending] = useActionState(submitBooking, initialState);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location');
  const [selectedLocation, setSelectedLocation] = useState(
    locationParam === 'gopanpally' ? 'gopanpally' : 'tellapur'
  );
  // Sync location if URL param changes (e.g. navigating between book links)
  const didSyncLocation = useRef(false);
  useEffect(() => {
    if (!didSyncLocation.current && locationParam) {
      didSyncLocation.current = true;
      setSelectedLocation(locationParam === 'gopanpally' ? 'gopanpally' : 'tellapur');
    }
  }, [locationParam]);

  // Pre-select service from URL ?service_name= param (set by "Book this service" buttons)
  const serviceNameParam = searchParams.get('service_name');
  const didSyncService = useRef(false);
  useEffect(() => {
    if (!didSyncService.current && serviceNameParam && services.length > 0) {
      didSyncService.current = true;
      const match = services.find(
        (s) => s.name.toLowerCase() === serviceNameParam.toLowerCase()
      );
      if (match) setSelectedServiceId(match.id);
    }
  }, [serviceNameParam, services]);

  // Date and Time state
  const todayStr = useMemo(() => getLocalDateString(), []);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('');

  // Find currently selected service name to pass along
  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId]
  );

  // Group services by category for easier browsing
  const groupedServices = useMemo(() => {
    const groups: Record<string, Service[]> = {};
    for (const service of services) {
      const cat = service.category || 'General Services';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(service);
    }
    return groups;
  }, [services]);

  // Strict 10-digit check
  const isPhoneValid = phone.length === 10 && /^[6-9]/.test(phone);
  const showPhoneError = phoneTouched && phone.length > 0 && !isPhoneValid;

  // Filter available time slots: if selected date is today, exclude past slots
  const availableTimeSlots = useMemo(() => {
    const today = getLocalDateString();
    if (selectedDate !== today) {
      return ALL_TIME_SLOTS;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Only allow upcoming slots with at least a 10-minute lead time
    return ALL_TIME_SLOTS.filter((slot) => {
      const [h, m] = slot.split(':').map(Number);
      const slotMinutes = h * 60 + m;
      return slotMinutes > currentMinutes + 10;
    });
  }, [selectedDate]);

  // If currently selected time is no longer available (e.g. date changed to today), clear it
  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime('');
    }
  }, [availableTimeSlots, selectedTime]);

  // Handle phone input: strictly allow digits only, capped at 10
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const isToday = selectedDate === todayStr;
  const noSlotsRemainingToday = isToday && availableTimeSlots.length === 0;

  if (state.success) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '5px',
          padding: '64px 48px',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '0 auto',
          border: '1px solid rgba(180,174,172,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        {/* Success checkmark */}
        <div
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#c9a96e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 4px 16px rgba(201, 169, 110, 0.3)',
          }}
        >
          <span style={{ fontSize: '24px', color: '#000000', fontWeight: 'bold' }}>✓</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
            fontSize: '32px',
            lineHeight: 1.08,
            color: '#000000',
            fontWeight: 400,
            marginBottom: '16px',
          }}
        >
          Appointment Requested
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
            fontSize: '15px',
            lineHeight: 1.6,
            color: '#646464',
            marginBottom: '24px',
          }}
        >
          Thank you — your request has been recorded. Our team will review your
          preferred slot and confirm your visit by phone. For immediate booking, call{' '}
          <a
            href="tel:+919515625554"
            style={{ color: '#000000', fontWeight: 600, textDecoration: 'none' }}
          >
            095156 25554
          </a>
          .
        </p>

        {state.bookingId && (
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '12px',
              color: '#888888',
              letterSpacing: '0.06em',
            }}
          >
            Booking Reference: <strong style={{ color: '#000000' }}>{state.bookingId.slice(0, 8).toUpperCase()}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      action={formAction}
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Hidden inputs */}
      <input type="hidden" name="service_name" value={selectedService?.name || ''} />
      <input type="hidden" name="location" value={selectedLocation} />

      {/* Pre-filled service banner — shown when arriving from "Book this service" */}
      {serviceNameParam && selectedService && (
        <div
          style={{
            backgroundColor: '#f2f1ed',
            borderRadius: '5px',
            padding: '14px 18px',
            borderLeft: '3px solid #c9a96e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '11px',
                color: '#646464',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Pre-selected service
            </p>
            <p
              style={{
                fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                fontSize: '16px',
                color: '#000000',
                fontWeight: 400,
              }}
            >
              {selectedService.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedServiceId('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#646464',
              lineHeight: 1,
              padding: '4px',
            }}
            aria-label="Clear pre-selected service"
          >
            ×
          </button>
        </div>
      )}

      {/* Error message */}
      {state.error && (
        <div
          style={{
            backgroundColor: '#3b3429',
            borderRadius: '5px',
            padding: '16px 20px',
            borderLeft: '4px solid #c9a96e',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '14px',
              lineHeight: 1.5,
              color: '#ffffff',
            }}
          >
            {state.error}
          </p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="booking-name" style={labelStyle}>
          Full Name *
        </label>
        <input
          id="booking-name"
          name="customer_name"
          type="text"
          required
          placeholder="Your full name"
          style={inputStyle}
          autoComplete="name"
          minLength={2}
          maxLength={80}
        />
      </div>

      {/* Phone — Strict 10 Digits */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label htmlFor="booking-phone" style={labelStyle}>
            Mobile Number (10 digits) *
          </label>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              color: phone.length === 10 ? '#2e7d32' : '#888888',
              fontWeight: phone.length === 10 ? 600 : 400,
            }}
          >
            {phone.length}/10 digits
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#646464',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '14px',
              pointerEvents: 'none',
              fontWeight: 500,
            }}
          >
            +91
          </span>
          <input
            id="booking-phone"
            name="customer_phone"
            type="tel"
            required
            value={phone}
            onChange={handlePhoneChange}
            onBlur={() => setPhoneTouched(true)}
            placeholder="9876543210"
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            title="Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
            style={{
              ...inputStyle,
              paddingLeft: '48px',
              borderColor: showPhoneError ? '#d32f2f' : phone.length === 10 ? '#2e7d32' : '#b4aeac',
            }}
            autoComplete="tel"
          />
        </div>
        {showPhoneError ? (
          <p
            style={{
              color: '#d32f2f',
              fontSize: '11px',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              marginTop: '6px',
            }}
          >
            {phone.length < 10
              ? `Must be exactly 10 digits (${phone.length} entered so far)`
              : 'Must start with 6, 7, 8, or 9'}
          </p>
        ) : (
          <p
            style={{
              color: '#888888',
              fontSize: '11px',
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              marginTop: '6px',
            }}
          >
            Strictly 10-digit mobile number starting with 6, 7, 8, or 9
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="booking-email" style={labelStyle}>
          Email Address
        </label>
        <input
          id="booking-email"
          name="customer_email"
          type="email"
          placeholder="Optional — for confirmation"
          style={inputStyle}
          autoComplete="email"
        />
      </div>

      {/* Service select */}
      <div>
        <label htmlFor="booking-service" style={labelStyle}>
          Service
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="booking-service"
            name="service_id"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            style={{
              ...inputStyle,
              paddingRight: '40px',
              cursor: 'pointer',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L6 7L11 1\' stroke=\'%23646464\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
            }}
          >
            <option value="">Select a service (optional)</option>
            {Object.entries(groupedServices).map(([category, items]) => (
              <optgroup key={category} label={category}>
                {items.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.price_inr ? ` — ₹${s.price_inr}` : ''}
                    {s.duration_minutes ? ` (${s.duration_minutes} min)` : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Date and Time — side by side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        {/* Date Input */}
        <div>
          <label htmlFor="booking-date" style={labelStyle}>
            Preferred Date *
          </label>
          <input
            id="booking-date"
            name="preferred_date"
            type="date"
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={todayStr}
            style={inputStyle}
          />
        </div>

        {/* Time Input — dynamically filtered for today */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label htmlFor="booking-time" style={labelStyle}>
              Preferred Time *
            </label>
            {isToday && (
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                  color: '#888888',
                }}
              >
                Upcoming today
              </span>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <select
              id="booking-time"
              name="preferred_time"
              required
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={noSlotsRemainingToday}
              style={{
                ...inputStyle,
                paddingRight: '40px',
                cursor: noSlotsRemainingToday ? 'not-allowed' : 'pointer',
                backgroundColor: noSlotsRemainingToday ? '#f2f1ed' : '#ffffff',
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L6 7L11 1\' stroke=\'%23646464\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
              }}
            >
              {noSlotsRemainingToday ? (
                <option value="">No slots left today</option>
              ) : (
                <>
                  <option value="">Select time</option>
                  {availableTimeSlots.map((slot) => {
                    const [h, m] = slot.split(':').map(Number);
                    const period = h < 12 ? 'AM' : 'PM';
                    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
                    return (
                      <option key={slot} value={slot}>
                        {displayH}:{m.toString().padStart(2, '0')} {period}
                      </option>
                    );
                  })}
                </>
              )}
            </select>
          </div>
          {noSlotsRemainingToday && (
            <p
              style={{
                color: '#d32f2f',
                fontSize: '11px',
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                marginTop: '6px',
              }}
            >
              All slots for today have passed. Please select a future date above.
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="booking-location" style={labelStyle}>
          Studio Location *
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="booking-location"
            name="location_select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            required
            style={{
              ...inputStyle,
              paddingRight: '40px',
              cursor: 'pointer',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L6 7L11 1\' stroke=\'%23646464\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
            }}
          >
            <option value="tellapur">Tellapur — Osman Nagar (8 AM–10 PM)</option>
            <option value="gopanpally">Gopanpally — The Original (7 AM–11 PM)</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="booking-notes" style={labelStyle}>
          Additional Notes
        </label>
        <textarea
          id="booking-notes"
          name="notes"
          rows={3}
          placeholder="Any specific requests or notes for our team…"
          maxLength={500}
          style={{
            ...inputStyle,
            resize: 'vertical',
            minHeight: '80px',
          }}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || (phone.length > 0 && !isPhoneValid) || noSlotsRemainingToday}
        style={{
          fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          color: '#000000',
          backgroundColor: isPending || (phone.length > 0 && !isPhoneValid) || noSlotsRemainingToday ? '#b4aeac' : '#c9a96e',
          padding: '14px 32px',
          borderRadius: '5px',
          border: 'none',
          cursor: isPending || (phone.length > 0 && !isPhoneValid) || noSlotsRemainingToday ? 'not-allowed' : 'pointer',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          transition: 'all 0.2s ease',
          alignSelf: 'flex-start',
          boxShadow: isPending || (phone.length > 0 && !isPhoneValid) || noSlotsRemainingToday ? 'none' : '0 4px 16px rgba(201, 169, 110, 0.25)',
        }}
      >
        {isPending ? 'Sending Request…' : 'Request Appointment'}
      </button>

      <p
        style={{
          fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
          fontSize: '12px',
          color: '#888888',
          marginTop: '-8px',
        }}
      >
        * Required fields. We will confirm your appointment by phone.
      </p>
    </form>
  );
}
