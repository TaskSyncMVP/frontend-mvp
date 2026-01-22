'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PageActions {
  primaryAction?: () => void;
}

interface PageActionsContextValue {
  actions: PageActions;
  setPrimaryAction: (action?: () => void) => void;
}

const PageActionsContext = createContext<PageActionsContextValue | undefined>(undefined);

export const PageActionsProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<PageActions>({});

  const setPrimaryAction = useCallback((action?: () => void) => {
    setActions(prev => ({ ...prev, primaryAction: action }));
  }, []);

  return React.createElement(
    PageActionsContext.Provider,
    { value: { actions, setPrimaryAction } },
    children
  );
};

export const usePageActions = (): PageActionsContextValue => {
  const ctx = useContext(PageActionsContext);
  if (!ctx) {
    throw new Error('usePageActions must be used within a PageActionsProvider');
  }
  return ctx;
};

