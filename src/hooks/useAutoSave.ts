import { useEffect, useRef, useCallback } from 'react';
import { toast } from '@/utils/toast';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void>;
  interval?: number; // in milliseconds
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export function useAutoSave({
  data,
  onSave,
  interval = 30000, // 30 seconds default
  enabled = true,
  onError
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<any>();
  const isSavingRef = useRef(false);
  const hasUnsavedChangesRef = useRef(false);

  const saveData = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;
    
    try {
      isSavingRef.current = true;
      await onSave(data);
      lastSavedRef.current = JSON.stringify(data);
      hasUnsavedChangesRef.current = false;
    } catch (error) {
      console.error('Auto-save failed:', error);
      if (onError) {
        onError(error as Error);
      } else {
        toast.error('Failed to auto-save changes');
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, enabled, onError]);

  const scheduleSave = useCallback(() => {
    if (!enabled) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if data has actually changed
    const currentDataString = JSON.stringify(data);
    if (currentDataString === lastSavedRef.current) {
      hasUnsavedChangesRef.current = false;
      return;
    }

    hasUnsavedChangesRef.current = true;

    // Schedule new save
    timeoutRef.current = setTimeout(() => {
      saveData();
    }, interval);
  }, [data, saveData, interval, enabled]);

  // Schedule save when data changes
  useEffect(() => {
    scheduleSave();
  }, [scheduleSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveData();
  }, [saveData]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = hasUnsavedChangesRef.current;

  // Check if currently saving
  const isSaving = isSavingRef.current;

  return {
    saveNow,
    hasUnsavedChanges,
    isSaving
  };
}
