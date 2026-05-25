import { useAppState } from './hooks/useAppState';
import { AIInputBar } from './components/AIInputBar';
import FeatureMatrix from './components/FeatureMatrix';
import SummaryBar from './components/SummaryBar';
import SolutionSummary from './components/SolutionSummary';
import EmailModal from './components/EmailModal';
import './index.css';

function LegendItem({ color, label, sub }: { color: string; label: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 12, color: '#94A3B8' }}>— {sub}</span>
    </div>
  );
}

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
      {/* Header — dark navy anchors the design */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 56,
          background: '#0F172A',
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
          <div className="app-content">
            {/* AI Input */}
            <div className="planner-input-wrap">
              <AIInputBar onFeaturesIdentified={handleAIFeatures} />
            </div>

            {/* Legend bar */}
            <div className="legend-bar">
              <LegendItem color="#16a34a" label="Shopify Native" sub="Included in Shopify Plus" />
              <LegendItem color="#2563eb" label="Extend Commerce" sub="App Store, no custom dev" />
              <LegendItem color="#ea580c" label="Codup Custom" sub="Custom implementation" />
            </div>

            {/* Sticky summary bar */}
            <div className="summary-bar-wrap">
              <SummaryBar
                selectedFeatures={selectedFeatures}
                notes={notes}
                onNotesChange={setNotes}
                onGenerate={() => setShowEmailModal(true)}
                onClear={clearAll}
              />
            </div>

            {/* Full-width matrix */}
            <div className="matrix-wrap-full">
              <FeatureMatrix
                selectedFeatures={selectedFeatures}
                onToggle={toggleFeature}
              />
            </div>

            {/* Mobile floating CTA */}
            {selectedFeatures.size > 0 && (
              <div className="mobile-fab" style={{
                position: 'fixed', bottom: 24, left: '50%',
                transform: 'translateX(-50%)', zIndex: 20,
              }}>
                <button
                  onClick={() => setShowEmailModal(true)}
                  style={{
                    background: '#2563eb', color: 'white', border: 'none',
                    borderRadius: 100, padding: '12px 24px', fontSize: 14,
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 4px 24px rgba(37,99,235,0.4)', whiteSpace: 'nowrap',
                  }}
                >
                  Generate My Plan · {selectedFeatures.size} selected
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
            <SolutionSummary
              selectedFeatures={selectedFeatures}
              notes={notes}
              userName={userName}
              onBack={() => setCurrentScreen('planner')}
            />
          </div>
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
