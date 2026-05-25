import type { Feature } from '../types';
import { FeatureCell } from './FeatureCell';

interface FeatureColumnProps {
  category: string;
  features: Feature[];
  selectedFeatures: Set<string>;
  onToggle: (id: string) => void;
}

const PROVIDER_COLORS = {
  Shopify: '#16a34a',
  Extend:  '#2563eb',
  Codup:   '#ea580c',
} as const;

export function FeatureColumn({ category, features, selectedFeatures, onToggle }: FeatureColumnProps) {
  const shopifyCount = features.filter(f => f.provider === 'Shopify').length;
  const extendCount  = features.filter(f => f.provider === 'Extend').length;
  const codupCount   = features.filter(f => f.provider === 'Codup').length;
  const total = features.length;

  return (
    <div
      style={{
        flex: 1,
        minWidth: '180px',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(15,23,42,0.08)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 12px 8px 12px',
          borderBottom: '1px solid rgba(15,23,42,0.06)',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            color: '#94A3B8',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          {category}
        </div>
        {/* Proportion bar */}
        <div
          style={{
            display: 'flex',
            height: '3px',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          {shopifyCount > 0 && (
            <div
              style={{
                flex: shopifyCount / total,
                backgroundColor: PROVIDER_COLORS.Shopify,
              }}
            />
          )}
          {extendCount > 0 && (
            <div
              style={{
                flex: extendCount / total,
                backgroundColor: PROVIDER_COLORS.Extend,
              }}
            />
          )}
          {codupCount > 0 && (
            <div
              style={{
                flex: codupCount / total,
                backgroundColor: PROVIDER_COLORS.Codup,
              }}
            />
          )}
        </div>
      </div>

      {/* Feature cells */}
      <div>
        {features.map(feature => (
          <FeatureCell
            key={feature.id}
            feature={feature}
            selected={selectedFeatures.has(feature.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default FeatureColumn;
