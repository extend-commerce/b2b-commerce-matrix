import { FEATURES, CATEGORIES } from '../data/features';
import { FeatureColumn } from './FeatureColumn';

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
  // Group features by category, preserving CATEGORIES order
  const featuresByCategory = CATEGORIES.map(category => ({
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
        {featuresByCategory.map(({ category, features }) => (
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
