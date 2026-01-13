import { render, screen } from '@testing-library/react';
import { PageHeader } from '@/widgets/pageHeader/ui/PageHeader';
import { vi } from 'vitest';

// Mock ResponsiveHeader component
vi.mock('@/widgets/pageHeader/ui/ResponsiveHeader', () => ({
  ResponsiveHeader: ({ title, onGoBack, onNotification }: any) => (
    <div data-testid="responsive-header">
      <h1>{title}</h1>
      {onGoBack && <button onClick={onGoBack} data-testid="go-back">Go Back</button>}
      {onNotification && <button onClick={onNotification} data-testid="notification">Notification</button>}
    </div>
  )
}));

describe('PageHeader', () => {
  it('should render with title', () => {
    render(<PageHeader title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-header')).toBeInTheDocument();
  });

  it('should pass onGoBack prop to ResponsiveHeader', () => {
    const mockGoBack = vi.fn();
    render(<PageHeader title="Test Title" onGoBack={mockGoBack} />);
    
    const goBackButton = screen.getByTestId('go-back');
    expect(goBackButton).toBeInTheDocument();
  });

  it('should pass onNotification prop to ResponsiveHeader', () => {
    const mockNotification = vi.fn();
    render(<PageHeader title="Test Title" onNotification={mockNotification} />);
    
    const notificationButton = screen.getByTestId('notification');
    expect(notificationButton).toBeInTheDocument();
  });

  it('should pass all props to ResponsiveHeader', () => {
    const mockGoBack = vi.fn();
    const mockNotification = vi.fn();
    
    render(
      <PageHeader 
        title="Test Title" 
        onGoBack={mockGoBack} 
        onNotification={mockNotification} 
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('go-back')).toBeInTheDocument();
    expect(screen.getByTestId('notification')).toBeInTheDocument();
  });
});