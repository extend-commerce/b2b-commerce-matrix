import { motion, type Easing } from 'framer-motion';
import { FEATURES, APP_STORE_LINKS } from '../data/features';
import AppCard from './AppCard';

interface SolutionSummaryProps {
  selectedFeatures: Set<string>;
  notes: string;
  userName: string;
  onBack: () => void;
}

const APP_ORDER = [
  'Extend B2B Buying',
  'Extend POS for B2B',
  'Extend B2B Address Book',
  'Extend Product Configurator',
  'Extend B2B Onboarding',
  'Extend Dealer Locator',
  'Extend Inventory Forecast AI',
];

const EASE_OUT: Easing = 'easeOut';

const sectionVariant = (index: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: EASE_OUT, delay: index * 0.12 },
});

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 20,
};

function DotRow({
  feature,
  color,
  isFirst,
}: {
  feature: string;
  color: string;
  isFirst: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0',
        borderTop: isFirst ? 'none' : '1px solid var(--border)',
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          marginRight: 10,
        }}
      />
      <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{feature}</span>
    </div>
  );
}

export default function SolutionSummary({
  selectedFeatures,
  notes,
  userName,
  onBack,
}: SolutionSummaryProps) {
  // Derive feature objects for each selected ID
  const selectedFeatureObjs = FEATURES.filter(f => selectedFeatures.has(f.id));

  const shopifyFeatures = selectedFeatureObjs.filter(f => f.provider === 'Shopify');
  const extendFeatures = selectedFeatureObjs.filter(f => f.provider === 'Extend');
  const codupFeatures = selectedFeatureObjs.filter(f => f.provider === 'Codup');

  // Group Extend features by app
  const extendByApp = new Map<string, string[]>();
  for (const f of extendFeatures) {
    const app = f.app ?? 'Unknown';
    if (!extendByApp.has(app)) extendByApp.set(app, []);
    extendByApp.get(app)!.push(f.feature);
  }

  // Count providers that have ≥1 selected feature
  const providerCount = [
    shopifyFeatures.length > 0,
    extendFeatures.length > 0,
    codupFeatures.length > 0,
  ].filter(Boolean).length;

  const totalCount = selectedFeatureObjs.length;

  const firstName = userName.trim().split(' ')[0];

  const subtitle =
    userName.trim().length > 0
      ? `Here's your plan, ${firstName}. ${totalCount} feature${totalCount !== 1 ? 's' : ''} across ${providerCount} provider${providerCount !== 1 ? 's' : ''}.`
      : `${totalCount} feature${totalCount !== 1 ? 's' : ''} selected across ${providerCount} provider${providerCount !== 1 ? 's' : ''}`;

  // Build section indices for stagger (only rendered sections count)
  let sectionIdx = 0;
  const shopifyIdx = shopifyFeatures.length > 0 ? sectionIdx++ : -1;
  const extendIdx = extendFeatures.length > 0 ? sectionIdx++ : -1;
  const codupIdx = codupFeatures.length > 0 ? sectionIdx++ : -1;
  const notesIdx = notes.trim().length > 0 ? sectionIdx++ : -1;
  const ctaIdx = sectionIdx;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}
    >
      {/* Back link */}
      <div
        onClick={onBack}
        style={{
          color: '#64748B',
          fontSize: 14,
          cursor: 'pointer',
          marginBottom: 32,
          display: 'inline-block',
          textDecoration: 'none',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#0F172A')}
        onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
      >
        ← Edit selections
      </div>

      {/* Header */}
      <h1
        style={{
          color: 'var(--text-primary)',
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          margin: '0 0 8px',
        }}
      >
        Your B2B Commerce Plan
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: '0 0 40px' }}>{subtitle}</p>

      {/* Sections container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Section A — Shopify Native */}
        {shopifyFeatures.length > 0 && (
          <motion.div {...sectionVariant(shopifyIdx)}>
            <div style={cardStyle}>
              {/* Section header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span style={{ color: '#16a34a' }}>✦</span> SHOPIFY NATIVE
                </span>
                <span
                  style={{
                    background: 'rgba(22,163,74,0.12)',
                    color: '#16a34a',
                    borderRadius: 100,
                    padding: '2px 10px',
                    fontSize: 12,
                  }}
                >
                  {shopifyFeatures.length} feature{shopifyFeatures.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Sub-copy */}
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '8px 0 16px' }}>
                These features are built into Shopify Plus. No additional apps required — just configuration.
              </p>

              {/* Feature list */}
              <div>
                {shopifyFeatures.map((f, i) => (
                  <DotRow key={f.id} feature={f.feature} color="#16a34a" isFirst={i === 0} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Section B — Extend Commerce Apps */}
        {extendFeatures.length > 0 && (
          <motion.div {...sectionVariant(extendIdx)}>
            {/* Section header (outside card, above app cards) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.12em', color: '#475569', textTransform: 'uppercase' }}>
                <span style={{ color: '#2563eb' }}>✦</span> EXTEND COMMERCE APPS
              </span>
              <span
                style={{
                  background: 'rgba(37,99,235,0.12)',
                  color: '#2563eb',
                  borderRadius: 100,
                  padding: '2px 10px',
                  fontSize: 12,
                }}
              >
                {extendFeatures.length} feature{extendFeatures.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 16px' }}>
              These features are delivered by Extend Commerce apps — installable from the Shopify App Store with no custom development needed.
            </p>

            {/* App cards */}
            {APP_ORDER.filter(app => extendByApp.has(app)).map(app => (
              <AppCard
                key={app}
                appName={app}
                features={extendByApp.get(app)!}
                appStoreUrl={APP_STORE_LINKS[app] ?? 'https://extendcommerce.com'}
                battleCardUrl="https://extendcommerce.com/battle-cards"
              />
            ))}
          </motion.div>
        )}

        {/* Section C — Codup Custom Development */}
        {codupFeatures.length > 0 && (
          <motion.div {...sectionVariant(codupIdx)}>
            <div style={cardStyle}>
              {/* Section header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span style={{ color: '#ea580c' }}>✦</span> CODUP CUSTOM DEVELOPMENT
                </span>
                <span
                  style={{
                    background: 'rgba(234,88,12,0.12)',
                    color: '#ea580c',
                    borderRadius: 100,
                    padding: '2px 10px',
                    fontSize: 12,
                  }}
                >
                  {codupFeatures.length} feature{codupFeatures.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Sub-copy */}
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '8px 0 16px' }}>
                These features require custom implementation. Codup's team scopes, builds, and maintains this work as part of a larger engagement — typically alongside a Shopify Plus setup.
              </p>

              {/* Feature list */}
              <div>
                {codupFeatures.map((f, i) => (
                  <DotRow key={f.id} feature={f.feature} color="#ea580c" isFirst={i === 0} />
                ))}
              </div>

              {/* Callout box */}
              <div
                style={{
                  background: 'rgba(234,88,12,0.06)',
                  borderLeft: '3px solid #ea580c',
                  borderRadius: '0 8px 8px 0',
                  padding: '12px 16px',
                  marginTop: 16,
                }}
              >
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                  Custom development is scoped per project. These are typically part of a larger Shopify Plus engagement.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notes box */}
        {notes.trim().length > 0 && (
          <motion.div {...sectionVariant(notesIdx)}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderLeft: '3px solid rgba(15,23,42,0.20)',
                borderRadius: 8,
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  letterSpacing: '0.08em',
                }}
              >
                YOUR NOTES
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0, whiteSpace: 'pre-wrap' }}>
                {notes}
              </p>
            </div>
          </motion.div>
        )}

        {/* CTA section */}
        <motion.div {...sectionVariant(ctaIdx)}>
          <div style={{ maxWidth: 480, margin: '48px auto 0', textAlign: 'center' }}>
            <h2
              style={{
                color: 'var(--text-primary)',
                fontSize: 20,
                fontWeight: 600,
                margin: '0 0 20px',
                textAlign: 'center',
              }}
            >
              Ready to build your stack?
            </h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => window.open('https://extendcommerce.com/book-demo', '_blank')}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  height: 44,
                  borderRadius: 10,
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Book a Demo →
              </button>
              <button
                onClick={() => window.open('https://extendcommerce.com/battle-cards', '_blank')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-muted)',
                  height: 44,
                  borderRadius: 10,
                  flex: 1,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                View Battle Cards →
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 16, textAlign: 'center' }}>
              Powered by Extend Commerce × Codup
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
