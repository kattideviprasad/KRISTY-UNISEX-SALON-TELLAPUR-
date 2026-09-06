'use client';

import { useState, useCallback } from 'react';

export type BranchValue = 'tellapur' | 'gopanpally' | 'both';

type BranchSwitcherProps = {
  /** Controlled value */
  value?: BranchValue;
  /** Called when the selected branch changes */
  onChange?: (value: BranchValue) => void;
  /** Default value when uncontrolled (defaults to 'both') */
  defaultValue?: BranchValue;
};

const OPTIONS: { value: BranchValue; label: string }[] = [
  { value: 'tellapur', label: 'Tellapur' },
  { value: 'gopanpally', label: 'Gopanpally' },
  { value: 'both', label: 'Both' },
];

/**
 * Segmented-control toggle for switching between salon branches.
 *
 * Works both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`).
 * Designed to match the KRISTY salon brand (gold accent, dark scheme).
 */
export default function BranchSwitcher({
  value,
  onChange,
  defaultValue = 'both',
}: BranchSwitcherProps) {
  const [internalValue, setInternalValue] = useState<BranchValue>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;

  const handleSelect = useCallback(
    (next: BranchValue) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return (
    <div
      role="radiogroup"
      aria-label="Branch selector"
      style={{
        display: 'inline-flex',
        backgroundColor: '#1a1714',
        borderRadius: '8px',
        padding: '4px',
        gap: '2px',
        border: '1px solid rgba(201, 169, 110, 0.15)',
      }}
    >
      {OPTIONS.map(({ value: optVal, label }) => {
        const isActive = current === optVal;
        return (
          <button
            key={optVal}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => handleSelect(optVal)}
            style={{
              fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.04em',
              color: isActive ? '#000000' : '#b4aeac',
              backgroundColor: isActive ? '#c9a96e' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              ...(isActive
                ? { boxShadow: '0 2px 8px rgba(201, 169, 110, 0.3)' }
                : {}),
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'rgba(255, 255, 255, 0.06)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = '#b4aeac';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'transparent';
              }
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
