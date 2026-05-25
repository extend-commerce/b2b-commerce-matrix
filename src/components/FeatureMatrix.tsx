import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURES, CATEGORIES } from '../data/features';
import { FeatureColumn } from './FeatureColumn';
import { FeatureCell } from './FeatureCell';

interface FeatureMatrixProps {
  selectedFeatures: Set<string>;
  onToggle: (id: string) => void;
}

const scrollbarStyles = `
  .feature-matrix-scroll::-webkit-scrollbar {
    height: 4px;
  }
  .feature-matrix-scroll::-webkit-scrollbar-track {
    background: #0F172A;
  }
  .feature-matrix-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.12);
    border-radius: 2px;
  }
`;

export function FeatureMatrix({ selectedFeatures, onToggle }: FeatureMatrixProps) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Group features by category, preserving CATEGORIES order
  const featuresByCategory = Object.fromEntries(
    CATEGORIES.map(category => [
      category,
      FEATURES.filter(f => f.category === category),
    ])
  );

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CATEGORIES.map((category) => {
          const catFeatures = featuresByCategory[category] ?? [];
          const selectedCount = catFeatures.filter(f => selectedFeatures.has(f.id)).length;
          const isOpen = openCategory === category;
          return (
            <div key={category} style={{
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, overflow: 'hidden',
            }}>
              {/* Header row */}
              <div
                onClick={() => setOpenCategory(isOpen ? null : category)}
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '12px 16px', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 13, color: '#F1F5F9', fontWeight: 500 }}>
                  {category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selectedCount > 0 && (
                    <span style={{
                      background: 'rgba(255,255,255,0.08)', color: '#94A3B8',
                      borderRadius: 100, padding: '2px 8px', fontSize: 11,
                    }}>
                      {selectedCount} selected
                    </span>
                  )}
                  <span style={{
                    color: '#475569', fontSize: 12,
                    display: 'inline-block',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}>▼</span>
                </div>
              </div>
              {/* Collapsible content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {catFeatures.map(feature => (
                      <FeatureCell
                        key={feature.id}
                        feature={feature}
                        selected={selectedFeatures.has(feature.id)}
                        onToggle={onToggle}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop: horizontal scrolling columns
  const featuresByCategory2 = CATEGORIES.map(category => ({
    category,
    features: FEATURES.filter(f => f.category === category),
  }));

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        className="feature-matrix-scroll"
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '16px',
        }}
      >
        {featuresByCategory2.map(({ category, features }) => (
          <FeatureColumn
            key={category}
            category={category}
            features={features}
            selectedFeatures={selectedFeatures}
            onToggle={onToggle}
          />
        ))}
      </div>
    </>
  );
}

export default FeatureMatrix;
