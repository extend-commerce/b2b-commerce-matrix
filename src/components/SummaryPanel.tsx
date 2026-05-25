import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURES, CATEGORIES } from '../data/features';

interface SummaryPanelProps {
  selectedFeatures: Set<string>;
  notes: string;
  onNotesChange: (value: string) => void;
  onGenerate: () => void;
}

const PROVIDERS = [
  { key: 'Shopify', label: 'Shopify Native',    color: '#16a34a' },
  { key: 'Extend',  label: 'Extend Commerce',   color: '#2563eb' },
  { key: 'Codup',   label: 'Codup Custom',       color: '#ea580c' },
] as const;

function AnimatedCount({ count }: { count: number }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={count}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          display: 'inline-block',
          color: '#fff',
          fontSize: 20,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          minWidth: '1.5ch',
          textAlign: 'right',
        }}
      >
        {count}
      </motion.span>
    </AnimatePresence>
  );
}

export default function SummaryPanel({
  selectedFeatures,
  notes,
  onNotesChange,
  onGenerate,
}: SummaryPanelProps) {
  const [glowing, setGlowing] = useState(false);
  const prevSizeRef = useRef(selectedFeatures.size);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Pulse glow when transitioning from 0 → 1
  useEffect(() => {
    const prev = prevSizeRef.current;
    const curr = selectedFeatures.size;
    if (prev === 0 && curr >= 1) {
      setGlowing(true);
      const timer = setTimeout(() => setGlowing(false), 600);
      return () => clearTimeout(timer);
    }
    prevSizeRef.current = curr;
  }, [selectedFeatures.size]);

  // Provider counts
  const providerCounts = PROVIDERS.map(({ key }) => {
    let count = 0;
    selectedFeatures.forEach((id) => {
      const f = FEATURES.find((feat) => feat.id === id);
      if (f && f.provider === key) count++;
    });
    return count;
  });

  // Category coverage
  const categoryCoverage = CATEGORIES.map((cat) => {
    const total = FEATURES.filter((f) => f.category === cat).length;
    const selected = FEATURES.filter(
      (f) => f.category === cat && selectedFeatures.has(f.id)
    ).length;
    return { cat, total, selected };
  });

  const hasSelection = selectedFeatures.size > 0;

  return (
    <div
      style={{
        width: 264,
        background: '#0A1628',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Section 1: Provider count badges OR zero state */}
      {hasSelection ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROVIDERS.map(({ key, label, color }, i) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {/* Dot */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: color,
                  flexShrink: 0,
                  display: 'inline-block',
                }}
              />
              {/* Animated count */}
              <AnimatedCount count={providerCounts[i]} />
              {/* Label */}
              <span
                style={{
                  color: '#94A3B8',
                  fontSize: 13,
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* Zero state */
        <div
          style={{
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: 20,
            textAlign: 'center',
            color: '#334155',
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Select features from the matrix
          <br />
          to build your stack plan.
        </div>
      )}

      {/* Section 2: Category coverage bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categoryCoverage.map(({ cat, total, selected }) => {
          const pct = total > 0 ? (selected / total) * 100 : 0;
          // Shorten long category names for display
          const shortName = cat.length > 20 ? cat.slice(0, 18) + '…' : cat;
          return (
            <div key={cat}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    color: '#475569',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {shortName}
                </span>
                <span
                  style={{
                    color: '#475569',
                    fontSize: 10,
                  }}
                >
                  {selected} / {total}
                </span>
              </div>
              {/* Bar track */}
              <div
                style={{
                  width: '100%',
                  height: 4,
                  background: '#1E293B',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                {/* Bar fill */}
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 2,
                    transition: 'width 300ms ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 4: Notes textarea */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label
          style={{
            color: '#475569',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 6,
            display: 'block',
          }}
        >
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add context for your team or agency partner..."
          style={{
            width: '100%',
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            color: '#F1F5F9',
            fontSize: 13,
            minHeight: 72,
            resize: 'vertical',
            padding: 10,
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 150ms ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(37,99,235,0.40)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
          }}
        />
      </div>

      {/* Section 5: CTA button */}
      <button
        ref={buttonRef}
        onClick={hasSelection ? onGenerate : undefined}
        disabled={!hasSelection}
        style={{
          width: '100%',
          height: 44,
          borderRadius: 10,
          border: 'none',
          background: hasSelection ? '#2563eb' : '#1E293B',
          color: hasSelection ? '#fff' : '#475569',
          fontSize: 14,
          fontWeight: hasSelection ? 600 : 400,
          fontFamily: 'inherit',
          cursor: hasSelection ? 'pointer' : 'not-allowed',
          pointerEvents: hasSelection ? 'auto' : 'none',
          transition: 'background 150ms, transform 150ms, box-shadow 150ms',
          boxShadow: glowing ? '0 0 20px rgba(37,99,235,0.4)' : 'none',
          letterSpacing: hasSelection ? '0.01em' : 'normal',
        }}
        onMouseEnter={(e) => {
          if (hasSelection) {
            e.currentTarget.style.background = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (hasSelection) {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
        onMouseDown={(e) => {
          if (hasSelection) {
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        Generate My Plan →
      </button>
    </div>
  );
}
