import { useAppState } from './hooks/useAppState';
import { AIInputBar } from './components/AIInputBar';
import FeatureMatrix from './components/FeatureMatrix';
import SummaryPanel from './components/SummaryPanel';
import SolutionSummary from './components/SolutionSummary';
import EmailModal from './components/EmailModal';
import './index.css';

const PROVIDERS_LEGEND = [
  { dot: '#16a34a', label: 'Shopify Native', sub: 'Included in Shopify Plus' },
  { dot: '#2563eb', label: 'Extend Commerce', sub: 'App Store, no custom dev' },
  { dot: '#ea580c', label: 'Codup Custom', sub: 'Custom implementation' },
];

export default function App() {
  const {
    selectedFeatures,
    notes,
    currentScreen,
    showEmailModal,
    userName,
    toggleFeature,
    setAISelections,
    clearAll,
    setNotes,
    setCurrentScreen,
    setShowEmailModal,
    setUserName,
  } = useAppState();

  const handleAIFeatures = (ids: string[]) => {
    setAISelections(ids);
  };

  const handleEmailSuccess = (name: string) => {
    setUserName(name);
    setShowEmailModal(false);
    setCurrentScreen('summary');
  };

  return (
    <div
      style={{
        background: 'var(--bg-base)',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Radial gradient overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 56,
          background: 'rgba(8,12,20,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1600,
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: branding */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div>
              <span style={{ color: '#2563eb' }}>✦</span>{' '}
              <span style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                Extend Commerce
              </span>
            </div>
            <div
              style={{
                color: '#475569',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              B2B Capability Planner
            </div>
          </div>

          {/* Right: Book a Demo */}
          <a
            href="https://extendcommerce.com/book-demo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#94A3B8',
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'border-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(37,99,235,0.6)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            Book a Demo
          </a>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1 }}>
        {currentScreen === 'planner' ? (
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* AI Input Bar */}
            <div
              style={{
                maxWidth: 1600,
                margin: '0 auto',
                padding: '24px 24px 16px',
              }}
            >
              <AIInputBar onFeaturesIdentified={handleAIFeatures} />
            </div>

            {/* Matrix + Sidebar */}
            <div
              style={{
                maxWidth: 1600,
                margin: '0 auto',
                padding: '0 24px 24px',
                display: 'flex',
                gap: 0,
                alignItems: 'flex-start',
              }}
            >
              {/* Left: Matrix area */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Legend bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    marginBottom: 12,
                  }}
                >
                  {PROVIDERS_LEGEND.map(({ dot, label, sub }) => (
                    <div
                      key={label}
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: dot,
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          color: '#94A3B8',
                          lineHeight: 1,
                        }}
                      >
                        <strong style={{ color: '#94A3B8', fontWeight: 500 }}>
                          {label}
                        </strong>{' '}
                        — {sub}
                      </span>
                    </div>
                  ))}

                  {/* Clear all — right-aligned */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    {selectedFeatures.size > 0 && (
                      <button
                        onClick={clearAll}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#475569',
                          fontSize: 12,
                          cursor: 'pointer',
                          padding: '2px 0',
                          fontFamily: 'inherit',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#94A3B8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#475569';
                        }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                {/* Feature matrix */}
                <FeatureMatrix
                  selectedFeatures={selectedFeatures}
                  onToggle={toggleFeature}
                />
              </div>

              {/* Right: Sticky sidebar */}
              <div
                style={{
                  width: 264,
                  flexShrink: 0,
                  position: 'sticky',
                  top: 72,
                  maxHeight: 'calc(100vh - 88px)',
                  overflowY: 'auto',
                }}
              >
                <SummaryPanel
                  selectedFeatures={selectedFeatures}
                  notes={notes}
                  onNotesChange={setNotes}
                  onGenerate={() => setShowEmailModal(true)}
                />
              </div>
            </div>
          </div>
        ) : (
          <SolutionSummary
            selectedFeatures={selectedFeatures}
            notes={notes}
            userName={userName}
            onBack={() => setCurrentScreen('planner')}
          />
        )}
      </main>

      {/* Email gate modal */}
      {showEmailModal && (
        <EmailModal
          selectedFeatures={selectedFeatures}
          notes={notes}
          onSuccess={handleEmailSuccess}
        />
      )}
    </div>
  );
}
