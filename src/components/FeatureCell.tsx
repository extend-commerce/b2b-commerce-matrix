import { motion, AnimatePresence } from 'framer-motion';
import type { Feature } from '../types';

interface FeatureCellProps {
  feature: Feature;
  selected: boolean;
  onToggle: (id: string) => void;
}

const PROVIDER_COLORS = {
  Shopify: {
    border: '#16a34a',
    tint: 'rgba(22,163,74,0.10)',
    tint25: 'rgba(22,163,74,0.04)',
    tint60: 'rgba(22,163,74,0.06)',
  },
  Extend: {
    border: '#2563eb',
    tint: 'rgba(37,99,235,0.10)',
    tint25: 'rgba(37,99,235,0.04)',
    tint60: 'rgba(37,99,235,0.06)',
  },
  Codup: {
    border: '#ea580c',
    tint: 'rgba(234,88,12,0.10)',
    tint25: 'rgba(234,88,12,0.04)',
    tint60: 'rgba(234,88,12,0.06)',
  },
} as const;

export function FeatureCell({ feature, selected, onToggle }: FeatureCellProps) {
  const colors = PROVIDER_COLORS[feature.provider];

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(feature.id)}
      style={{
        padding: '10px 12px 10px 14px',
        fontSize: '13px',
        cursor: 'pointer',
        borderLeft: `3px solid ${selected ? colors.border : `${colors.border}40`}`,
        backgroundColor: selected ? colors.tint : 'transparent',
        color: selected ? '#F1F5F9' : '#64748B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease',
        lineHeight: '1.4',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.backgroundColor = colors.tint60;
          el.style.borderLeftColor = `${colors.border}99`;
          el.style.color = '#94A3B8';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.backgroundColor = 'transparent';
          el.style.borderLeftColor = `${colors.border}40`;
          el.style.color = '#64748B';
        }
      }}
    >
      <span style={{ flex: 1, marginRight: '6px' }}>{feature.feature}</span>
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              color: colors.border,
              fontSize: '12px',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FeatureCell;
