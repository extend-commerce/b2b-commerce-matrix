import { useState, useRef, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAnalysis } from '../hooks/useAIAnalysis';

interface AIInputBarProps {
  onFeaturesIdentified: (ids: string[]) => void;
}

export function AIInputBar({ onFeaturesIdentified }: AIInputBarProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { analyze, loading, resultCount, error } = useAIAnalysis();

  const handleAnalyze = async () => {
    if (!value.trim() || loading) return;
    setShowResult(false);
    const ids = await analyze(value.trim());
    if (ids.length > 0) {
      onFeaturesIdentified(ids);
      setShowResult(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (showResult) setShowResult(false);
  };

  const isItalic = !focused && value.length === 0;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '56px',
    background: '#111827',
    border: focused
      ? '1px solid rgba(37,99,235,0.50)'
      : '1px solid rgba(255,255,255,0.10)',
    borderRadius: '12px',
    padding: '0 16px',
    boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxSizing: 'border-box',
  };

  const shimmerStyle: React.CSSProperties = loading
    ? {
        backgroundImage:
          'linear-gradient(90deg, #111827 0%, #1e293b 50%, #111827 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }
    : {};

  return (
    <div style={{ width: '100%' }}>
      <div style={{ ...containerStyle, ...shimmerStyle }}>
        {/* Left icon */}
        <span
          style={{
            color: '#2563eb',
            fontSize: '16px',
            marginRight: '12px',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          ✦
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Describe your business — e.g. 'We're a manufacturer selling direct to contractors...'"
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#F1F5F9',
            fontSize: '14px',
            fontStyle: isItalic ? 'italic' : 'normal',
            minWidth: 0,
          }}
        />

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '24px',
            background: 'rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}
        />

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !value.trim()}
          style={{
            height: '36px',
            background: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            padding: '0 16px',
            cursor: loading || !value.trim() ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            marginLeft: '12px',
            border: 'none',
            opacity: loading || !value.trim() ? 0.7 : 1,
            transition: 'opacity 0.15s ease',
            flexShrink: 0,
          }}
        >
          {loading ? 'Thinking...' : 'Analyze →'}
        </button>
      </div>

      {/* Result / Error message */}
      <AnimatePresence>
        {showResult && resultCount !== null && !error && (
          <motion.p
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              color: '#94A3B8',
              fontSize: '12px',
              marginTop: '8px',
              marginLeft: '4px',
            }}
          >
            ✦ {resultCount} features identified — adjust your selections below
          </motion.p>
        )}
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              color: '#ef4444',
              fontSize: '12px',
              marginTop: '8px',
              marginLeft: '4px',
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
