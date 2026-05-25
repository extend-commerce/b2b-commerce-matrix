import { motion } from 'framer-motion';
import { FEATURES } from '../data/features';

interface SummaryBarProps {
  selectedFeatures: Set<string>;
  notes: string;
  onNotesChange: (v: string) => void;
  onGenerate: () => void;
  onClear: () => void;
}

export default function SummaryBar({ selectedFeatures, notes, onNotesChange, onGenerate, onClear }: SummaryBarProps) {
  const shopifyCount = [...selectedFeatures].filter(id => FEATURES.find(f => f.id === id)?.provider === 'Shopify').length;
  const extendCount  = [...selectedFeatures].filter(id => FEATURES.find(f => f.id === id)?.provider === 'Extend').length;
  const codupCount   = [...selectedFeatures].filter(id => FEATURES.find(f => f.id === id)?.provider === 'Codup').length;
  const total = selectedFeatures.size;
  const hasSelections = total > 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      {/* Provider count chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <ProviderChip color="#16a34a" bg="rgba(22,163,74,0.08)" border="rgba(22,163,74,0.20)" count={shopifyCount} label="Shopify" />
        <ProviderChip color="#2563eb" bg="rgba(37,99,235,0.08)" border="rgba(37,99,235,0.20)" count={extendCount}  label="Extend"  />
        <ProviderChip color="#ea580c" bg="rgba(234,88,12,0.08)" border="rgba(234,88,12,0.20)" count={codupCount}   label="Codup"   />
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: 'rgba(15,23,42,0.10)', flexShrink: 0 }} />

      {/* Total */}
      {hasSelections ? (
        <span style={{ fontSize: 13, color: '#334155', fontWeight: 500, flexShrink: 0 }}>
          <strong style={{ color: '#0F172A', fontWeight: 700 }}>{total}</strong> features selected
        </span>
      ) : (
        <span style={{ fontSize: 13, color: '#94A3B8', flexShrink: 0 }}>
          Select features to build your plan
        </span>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Notes toggle — compact inline input on desktop */}
      {hasSelections && (
        <input
          type="text"
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="Add a note for your team..."
          style={{
            background: '#F8FAFC',
            border: '1px solid rgba(15,23,42,0.12)',
            borderRadius: 8,
            height: 36,
            padding: '0 12px',
            fontSize: 13,
            color: '#0F172A',
            fontFamily: 'inherit',
            outline: 'none',
            width: 220,
            flexShrink: 0,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      )}

      {/* Clear */}
      {hasSelections && (
        <button onClick={onClear} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: '#94A3B8', fontFamily: 'inherit', flexShrink: 0,
          padding: '4px 0',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#64748B'}
          onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
        >
          Clear all
        </button>
      )}

      {/* CTA */}
      <motion.button
        onClick={hasSelections ? onGenerate : undefined}
        disabled={!hasSelections}
        whileHover={hasSelections ? { scale: 1.02 } : {}}
        whileTap={hasSelections ? { scale: 0.98 } : {}}
        style={{
          height: 36,
          padding: '0 20px',
          borderRadius: 8,
          border: 'none',
          background: hasSelections ? '#2563eb' : '#E2E8F0',
          color: hasSelections ? '#FFFFFF' : '#94A3B8',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: hasSelections ? 'pointer' : 'not-allowed',
          flexShrink: 0,
          transition: 'background 200ms, color 200ms',
          whiteSpace: 'nowrap',
        }}
      >
        Generate My Plan →
      </motion.button>
    </div>
  );
}

function ProviderChip({ color, bg, border, count, label }: {
  color: string; bg: string; border: string; count: number; label: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: bg, border: `1px solid ${border}`,
      borderRadius: 100, padding: '4px 10px 4px 8px',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{label}</span>
    </div>
  );
}
