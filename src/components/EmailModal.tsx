import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../data/features';

interface EmailModalProps {
  selectedFeatures: Set<string>;
  notes: string;
  onSuccess: (name: string) => void;
}

export default function EmailModal({ selectedFeatures, notes, onSuccess }: EmailModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // Focus name field on mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Block ESC from closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    const shopifyCount = [...selectedFeatures].filter(
      (id) => FEATURES.find((f) => f.id === id)?.provider === 'Shopify'
    ).length;
    const extendCount = [...selectedFeatures].filter(
      (id) => FEATURES.find((f) => f.id === id)?.provider === 'Extend'
    ).length;
    const codupCount = [...selectedFeatures].filter(
      (id) => FEATURES.find((f) => f.id === id)?.provider === 'Codup'
    ).length;
    const selectedFeatureNames = [...selectedFeatures]
      .map((id) => FEATURES.find((f) => f.id === id)?.feature)
      .filter(Boolean)
      .join(', ');

    const formData = new FormData();
    formData.append('form-name', 'planner-submissions');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('selected_features', selectedFeatureNames);
    formData.append('feature_count_shopify', String(shopifyCount));
    formData.append('feature_count_extend', String(extendCount));
    formData.append('feature_count_codup', String(codupCount));
    formData.append('notes', notes);

    const startTime = Date.now();

    try {
      await fetch('/', { method: 'POST', body: formData });
    } catch (err) {
      console.error('Form submission failed:', err);
      // Proceed anyway — don't show error to user
    }

    // Ensure at least 400ms total delay so the spinner feels real
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, 400 - elapsed);
    await new Promise((resolve) => setTimeout(resolve, remaining));

    setLoading(false);
    onSuccess(name);
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    background: '#1E293B',
    border: focused ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.10)',
    borderRadius: 12,
    height: 44,
    width: '100%',
    color: '#F8FAFC',
    fontSize: 14,
    padding: '0 16px',
    outline: 'none',
    fontFamily: 'inherit',
    boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.15)' : 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxSizing: 'border-box',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.22,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0F172A',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: 40,
          width: '100%',
          maxWidth: 440,
          margin: 16,
        }}
      >
        {/* Top label */}
        <div
          style={{
            color: '#475569',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            marginBottom: 12,
          }}
        >
          ✦&nbsp;&nbsp;ALMOST THERE
        </div>

        {/* Heading */}
        <h2
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 600,
            margin: '0 0 8px',
          }}
        >
          Almost there
        </h2>

        {/* Body text */}
        <p
          style={{
            color: '#94A3B8',
            fontSize: 14,
            margin: '0 0 28px',
            lineHeight: 1.5,
          }}
        >
          Enter your details to view your B2B Commerce Plan and get a copy in your inbox.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Name input */}
          <input
            ref={nameRef}
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            disabled={loading}
            style={inputStyle(nameFocused)}
          />

          {/* Email input */}
          <input
            type="email"
            placeholder="Work email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            disabled={loading}
            style={{ ...inputStyle(emailFocused), marginTop: 12 }}
          />

          {/* Validation error */}
          {error && (
            <p
              style={{
                color: '#ef4444',
                fontSize: 13,
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: 44,
              borderRadius: 12,
              border: 'none',
              background: '#2563eb',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: loading ? 0.85 : 1,
              transition: 'background 0.15s ease, transform 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    flexShrink: 0,
                  }}
                />
                Sending...
              </>
            ) : (
              'View My Plan →'
            )}
          </button>
        </form>

        {/* Privacy note */}
        <p
          style={{
            color: '#475569',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          We won't spam you. Ever.
        </p>
      </motion.div>
    </motion.div>
  );
}
