import { useState, useEffect } from 'react';
import { fetchAutomations } from '../api/mockApi';
import type { AutomationAction } from '../types/workflow';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAutomations().then((data) => {
      if (!cancelled) {
        setAutomations(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { automations, loading };
}
