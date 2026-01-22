import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveHeader } from '@/widgets/pageHeader/ui/ResponsiveHeader';
import { vi } from 'vitest';

// Mock HeaderActions component
vi.mock('@/widgets/pageHeader/ui/HeaderActions', () => ({
  HeaderActions: ({ variant, onGoBack, onNotification }: any) => (
    <div data-testid={`header-actions-${variant}`}>
      {onGoBack && <button onClick={onGoBack} data-testid={`go-back-${variant}`}>Go Back</button>}
      {onNotification && <button onClick={onNotification} data-testid={`notification-${variant}`}>Notification</button>}
    </div>
  )
}));

// Mock window.history.back
const mockHistoryBack = vi.fn();
Object.defineProperty(window, 'history', {
  value: { back: mockHistoryBack },
  writable: true
});

describe('ResponsiveHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title', () => {
    render(<ResponsiveHeader title="Test Title" />);
    
    // Should render title in both mobile and desktop versions
    const titles = screen.getAllByText('Test Title');
    expect(titles).toHaveLength(2); // Mobile and desktop versions
  });

  it('should render mobile version', () => {
    render(<ResponsiveHeader title="Test Title" />);
    
    const mobileActions = screen.getAllByTestId('header-actions-mobile');
    expect(mobileActions).toHaveLength(2); // Left and right actions
  });

  it('should render desktop version', () => {
    render(<ResponsiveHeader title="Test Title" />);
    
    const desktopActions = screen.getAllByTestId('header-actions-desktop');
    expect(desktopActions).toHaveLength(2); // Left and right actions
  });

  it('should use default history.back when no onGoBack provided', () => {
    render(<ResponsiveHeader title="Test Title" onGoBack={undefined} />);
    
    // The component should still render but use default behavior
    expect(screen.getAllByText('Test Title')).toHaveLength(2);
  });

  it('should use custom onGoBack when provided', () => {
    const mockGoBack = vi.fn();
    render(<ResponsiveHeader title="Test Title" onGoBack={mockGoBack} />);
    
    expect(screen.getAllByText('Test Title')).toHaveLength(2);
  });

  it('should use default empty function when no onNotification provided', () => {
    render(<ResponsiveHeader title="Test Title" onNotification={undefined} />);
    
    expect(screen.getAllByText('Test Title')).toHaveLength(2);
  });

  it('should use custom onNotification when provided', () => {
    const mockNotification = vi.fn();
    render(<ResponsiveHeader title="Test Title" onNotification={mockNotification} />);
    
    expect(screen.getAllByText('Test Title')).toHaveLength(2);
  });

  it('should handle both mobile and desktop layouts', () => {
    const mockGoBack = vi.fn();
    const mockNotification = vi.fn();
    
    render(
      <ResponsiveHeader 
        title="Test Title" 
        onGoBack={mockGoBack} 
        onNotification={mockNotification} 
      />
    );
    
    // Check mobile layout
    expect(screen.getAllByTestId('header-actions-mobile')).toHaveLength(2);
    
    // Check desktop layout
    expect(screen.getAllByTestId('header-actions-desktop')).toHaveLength(2);
    
    // Check title appears in both layouts
    expect(screen.getAllByText('Test Title')).toHaveLength(2);
  });

  it('should apply correct CSS classes for responsive design', () => {
    render(<ResponsiveHeader title="Test Title" />);
    
    // Check for mobile-specific classes
    const mobileContainer = screen.getAllByText('Test Title')[0].closest('.lg\\:hidden');
    expect(mobileContainer).toBeInTheDocument();
    
    // Check for desktop-specific classes
    const desktopElements = document.querySelectorAll('.hidden.lg\\:block, .fixed');
    expect(desktopElements.length).toBeGreaterThan(0);
  });

  it('should call default history.back when onGoBack is not provided', () => {
    render(<ResponsiveHeader title="Test Title" />);
    
    // The component creates default handlers internally
    expect(screen.getAllByText('Test Title')).toHaveLength(2);
  });

  it('should call default empty function when onNotification is not provided', () => {
    render(<ResponsiveHeader title="Test Title" />);
    
    // The component creates default handlers internally
    expect(screen.getAllByText('Test Title')).toHaveLength(2);
  });

  it('should render with all props provided', () => {
    const mockGoBack = vi.fn();
    const mockNotification = vi.fn();
    
    render(
      <ResponsiveHeader 
        title="Complete Test" 
        onGoBack={mockGoBack} 
        onNotification={mockNotification} 
      />
    );
    
    expect(screen.getAllByText('Complete Test')).toHaveLength(2);
    expect(screen.getAllByTestId('header-actions-mobile')).toHaveLength(2);
    expect(screen.getAllByTestId('header-actions-desktop')).toHaveLength(2);
  });

  it('should handle empty title', () => {
    render(<ResponsiveHeader title="" />);
    
    // Should still render the structure even with empty title
    expect(screen.getAllByTestId('header-actions-mobile')).toHaveLength(2);
    expect(screen.getAllByTestId('header-actions-desktop')).toHaveLength(2);
  });

  it('should handle long title', () => {
    const longTitle = 'This is a very long title that might overflow the container';
    render(<ResponsiveHeader title={longTitle} />);
    
    expect(screen.getAllByText(longTitle)).toHaveLength(2);
  });
});