import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { FEATURES } from '../data/features';
import type { Screen } from '../types';

interface AppStateReturn {
  selectedFeatures: Set<string>;
  notes: string;
  currentScreen: Screen;
  showEmailModal: boolean;
  userName: string;
  toggleFeature: (id: string) => void;
  setAISelections: (ids: string[]) => void;
  clearAll: () => void;
  setNotes: (notes: string) => void;
  setCurrentScreen: (screen: Screen) => void;
  setShowEmailModal: (show: boolean) => void;
  setUserName: (name: string) => void;
}

export function useAppState(): AppStateReturn {
  // Persisted in localStorage
  const [storedFeatureIds, setStoredFeatureIds] = useLocalStorage<string[]>(
    'b2b-planner-features',
    []
  );
  const [notes, setNotesRaw] = useLocalStorage<string>('b2b-planner-notes', '');

  // In-memory only
  const [currentScreen, setCurrentScreen] = useState<Screen>('planner');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userName, setUserName] = useState('');

  // Derive Set from stored array
  const selectedFeatures = new Set<string>(storedFeatureIds);

  const toggleFeature = useCallback(
    (id: string) => {
      setStoredFeatureIds((prev) => {
        const set = new Set(prev);
        if (set.has(id)) {
          set.delete(id);
        } else {
          set.add(id);
        }
        return Array.from(set);
      });
    },
    [setStoredFeatureIds]
  );

  const setAISelections = useCallback(
    (ids: string[]) => {
      // First clear all
      setStoredFeatureIds([]);

      // Sort IDs by their index in the FEATURES array (top-to-bottom, left-to-right)
      const featureIndexMap = new Map(FEATURES.map((f, i) => [f.id, i]));
      const sorted = [...ids].sort((a, b) => {
        const ia = featureIndexMap.get(a) ?? Infinity;
        const ib = featureIndexMap.get(b) ?? Infinity;
        return ia - ib;
      });

      // Stagger selections 30ms apart using a running accumulator
      sorted.forEach((id, index) => {
        setTimeout(() => {
          setStoredFeatureIds((prev) => {
            const set = new Set(prev);
            set.add(id);
            return Array.from(set);
          });
        }, (index + 1) * 30);
      });
    },
    [setStoredFeatureIds]
  );

  const clearAll = useCallback(() => {
    setStoredFeatureIds([]);
    setNotesRaw('');
  }, [setStoredFeatureIds, setNotesRaw]);

  const setNotes = useCallback(
    (value: string) => {
      setNotesRaw(value);
    },
    [setNotesRaw]
  );

  return {
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
  };
}
