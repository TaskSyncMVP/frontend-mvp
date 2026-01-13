import { render, screen, fireEvent } from '@testing-library/react';
import { PageActionsProvider, usePageActions } from '@/shared/lib/page-actions-context';
import { vi } from 'vitest';
import React from 'react';

// Test component that uses the context
function TestComponent() {
  const { actions, setPrimaryAction } = usePageActions();

  const handleSetAction = () => {
    setPrimaryAction(vi.fn());
  };

  const handleClearActions = () => {
    setPrimaryAction(undefined);
  };

  return (
    <div>
      <button onClick={handleSetAction} data-testid="set-action">
        Set Action
      </button>
      <button onClick={handleClearActions} data-testid="clear-actions">
        Clear Actions
      </button>
      <div data-testid="has-primary-action">
        {actions.primaryAction ? 'true' : 'false'}
      </div>
    </div>
  );
}

// Component that throws error when context is not available
function ComponentWithoutProvider() {
  usePageActions();
  return <div>Should not render</div>;
}

describe('PageActionsProvider', () => {
  it('should provide context to children', () => {
    render(
      <PageActionsProvider>
        <TestComponent />
      </PageActionsProvider>
    );

    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('false');
    expect(screen.getByTestId('set-action')).toBeInTheDocument();
    expect(screen.getByTestId('clear-actions')).toBeInTheDocument();
  });

  it('should allow setting primary action', () => {
    render(
      <PageActionsProvider>
        <TestComponent />
      </PageActionsProvider>
    );

    const setActionButton = screen.getByTestId('set-action');
    fireEvent.click(setActionButton);

    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('true');
  });

  it('should allow clearing primary action', () => {
    render(
      <PageActionsProvider>
        <TestComponent />
      </PageActionsProvider>
    );

    // First set an action
    const setActionButton = screen.getByTestId('set-action');
    fireEvent.click(setActionButton);
    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('true');

    // Then clear actions
    const clearActionsButton = screen.getByTestId('clear-actions');
    fireEvent.click(clearActionsButton);
    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('false');
  });

  it('should start with empty actions', () => {
    render(
      <PageActionsProvider>
        <TestComponent />
      </PageActionsProvider>
    );

    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('false');
  });

  it('should handle multiple children', () => {
    function AnotherTestComponent() {
      const { actions } = usePageActions();
      return <div data-testid="another-has-primary-action">{actions.primaryAction ? 'true' : 'false'}</div>;
    }

    render(
      <PageActionsProvider>
        <TestComponent />
        <AnotherTestComponent />
      </PageActionsProvider>
    );

    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('false');
    expect(screen.getByTestId('another-has-primary-action')).toHaveTextContent('false');

    // Set action in first component
    const setActionButton = screen.getByTestId('set-action');
    fireEvent.click(setActionButton);

    // Both components should see the same state
    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('true');
    expect(screen.getByTestId('another-has-primary-action')).toHaveTextContent('true');
  });
});

describe('usePageActions', () => {
  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('usePageActions must be used within a PageActionsProvider');

    consoleSpy.mockRestore();
  });

  it('should return context value when used within provider', () => {
    let contextValue: any;

    function TestHook() {
      contextValue = usePageActions();
      return null;
    }

    render(
      <PageActionsProvider>
        <TestHook />
      </PageActionsProvider>
    );

    expect(contextValue).toBeDefined();
    expect(contextValue.actions).toEqual({});
    expect(typeof contextValue.setPrimaryAction).toBe('function');
  });

  it('should maintain state across re-renders', () => {
    function StatefulComponent() {
      const { actions, setPrimaryAction } = usePageActions();
      const [renderCount, setRenderCount] = React.useState(0);

      const handleRerender = () => {
        setRenderCount(prev => prev + 1);
      };

      const handleSetAction = () => {
        setPrimaryAction(vi.fn());
      };

      return (
        <div>
          <div data-testid="render-count">{renderCount}</div>
          <div data-testid="has-primary-action">{actions.primaryAction ? 'true' : 'false'}</div>
          <button onClick={handleRerender} data-testid="rerender">Rerender</button>
          <button onClick={handleSetAction} data-testid="set-action">Set Action</button>
        </div>
      );
    }

    render(
      <PageActionsProvider>
        <StatefulComponent />
      </PageActionsProvider>
    );

    // Set an action
    fireEvent.click(screen.getByTestId('set-action'));
    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('true');

    // Force re-render
    fireEvent.click(screen.getByTestId('rerender'));
    expect(screen.getByTestId('render-count')).toHaveTextContent('1');

    // Actions should still be there
    expect(screen.getByTestId('has-primary-action')).toHaveTextContent('true');
  });
});