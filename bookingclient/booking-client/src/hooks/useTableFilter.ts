/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useTableFilter.ts
import { useCallback, useRef, useState } from "react";

export const useTableFilter = <F extends Record<string, any>>(
  defaultFilters: F
) => {
  const [filters, setFilters] = useState<F>(defaultFilters);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setFilter = useCallback(
    <K extends keyof F>(
      key: K,
      value: F[K],
      debounceMs: number = 300,
      shouldDebounce: boolean = true
    ) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const updateFilters = () => {
        setFilters((prev) => ({
          ...prev,
          [key]: value,
        }));
      };

      if (shouldDebounce) {
        timeoutRef.current = setTimeout(updateFilters, debounceMs);
      } else {
        updateFilters();
      }
    },
    []
  );

  const resetFilters = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setFilters(defaultFilters);
  }, [defaultFilters]);

  useCallback(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    filters,
    setFilter,
    resetFilters,
  };
};
