interface AppCardProps {
  appName: string;
  features: string[];
  appStoreUrl: string;
  battleCardUrl: string;
}

export default function AppCard({ appName, features, appStoreUrl, battleCardUrl }: AppCardProps) {
  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{appName}</span>
        <span
          style={{
            background: 'rgba(37,99,235,0.12)',
            color: '#2563eb',
            borderRadius: 100,
            padding: '2px 10px',
            fontSize: 12,
          }}
        >
          {features.length} feature{features.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Feature list */}
      <div style={{ marginTop: 12 }}>
        {features.map((feature, i) => (
          <div
            key={feature}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '7px 0 7px 12px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#2563eb',
                flexShrink: 0,
                marginRight: 10,
              }}
            />
            <span style={{ color: '#CBD5E1', fontSize: 13 }}>{feature}</span>
          </div>
        ))}
      </div>

      {/* Bottom row — action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button
          onClick={() => window.open(appStoreUrl, '_blank')}
          style={{
            border: '1px solid rgba(37,99,235,0.40)',
            color: '#2563eb',
            background: 'transparent',
            borderRadius: 6,
            fontSize: 12,
            padding: '6px 12px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Shopify App Store ↗
        </button>
        <button
          onClick={() => window.open(battleCardUrl, '_blank')}
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#94A3B8',
            background: 'transparent',
            borderRadius: 6,
            fontSize: 12,
            padding: '6px 12px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          See Battle Card ↗
        </button>
      </div>
    </div>
  );
}
