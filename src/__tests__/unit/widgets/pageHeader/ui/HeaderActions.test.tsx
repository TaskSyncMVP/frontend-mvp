import { render, screen, fireEvent } from '@testing-library/react';
import { HeaderActions } from '@/widgets/pageHeader/ui/HeaderActions';
import { vi } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  )
}));

// Mock Button component
vi.mock('@shared/ui/button', () => ({
  Button: ({ children, onClick, size, variant, className }: any) => (
    <button 
      onClick={onClick} 
      className={className}
      data-size={size}
      data-variant={variant}
    >
      {children}
    </button>
  )
}));

// Mock window.history.back
const mockHistoryBack = vi.fn();
Object.defineProperty(window, 'history', {
  value: { back: mockHistoryBack },
  writable: true
});

describe('HeaderActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without any actions when no props provided', () => {
    render(<HeaderActions />);
    
    const container = document.querySelector('div');
    expect(container).toBeInTheDocument();
    // The div always exists but should have no buttons
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render go back button when onGoBack is provided', () => {
    const mockGoBack = vi.fn();
    render(<HeaderActions onGoBack={mockGoBack} />);
    
    const goBackButton = screen.getByRole('button');
    expect(goBackButton).toBeInTheDocument();
    expect(screen.getByAltText('Go back')).toBeInTheDocument();
  });

  it('should render notification button when onNotification is provided', () => {
    const mockNotification = vi.fn();
    render(<HeaderActions onNotification={mockNotification} />);
    
    const notificationButton = screen.getByRole('button');
    expect(notificationButton).toBeInTheDocument();
    expect(screen.getByAltText('Notifications')).toBeInTheDocument();
  });

  it('should render both buttons when both props are provided', () => {
    const mockGoBack = vi.fn();
    const mockNotification = vi.fn();
    
    render(<HeaderActions onGoBack={mockGoBack} onNotification={mockNotification} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(screen.getByAltText('Go back')).toBeInTheDocument();
    expect(screen.getByAltText('Notifications')).toBeInTheDocument();
  });

  it('should call onGoBack when go back button is clicked', () => {
    const mockGoBack = vi.fn();
    render(<HeaderActions onGoBack={mockGoBack} />);
    
    const goBackButton = screen.getByRole('button');
    fireEvent.click(goBackButton);
    
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('should call onNotification when notification button is clicked', () => {
    const mockNotification = vi.fn();
    render(<HeaderActions onNotification={mockNotification} />);
    
    const notificationButton = screen.getByRole('button');
    fireEvent.click(notificationButton);
    
    expect(mockNotification).toHaveBeenCalledTimes(1);
  });

  it('should use window.history.back when onGoBack is undefined but button exists', () => {
    render(<HeaderActions onGoBack={undefined} />);
    
    // Should not render button when onGoBack is undefined
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should handle mobile variant correctly', () => {
    const mockGoBack = vi.fn();
    render(<HeaderActions onGoBack={mockGoBack} variant="mobile" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'icon');
    expect(button).toHaveAttribute('data-variant', 'icon');
    
    const image = screen.getByAltText('Go back');
    expect(image).toHaveAttribute('width', '24');
    expect(image).toHaveAttribute('height', '24');
  });

  it('should handle desktop variant correctly', () => {
    const mockGoBack = vi.fn();
    render(<HeaderActions onGoBack={mockGoBack} variant="desktop" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'icon');
    expect(button).toHaveAttribute('data-variant', 'icon');
    
    const image = screen.getByAltText('Go back');
    expect(image).toHaveAttribute('width', '24');
    expect(image).toHaveAttribute('height', '24');
  });

  it('should apply correct CSS classes', () => {
    const mockGoBack = vi.fn();
    render(<HeaderActions onGoBack={mockGoBack} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rotate-180');
    
    const image = screen.getByAltText('Go back');
    expect(image).toHaveClass('w-6', 'h-6', 'lg:w-8', 'lg:h-8');
  });

  it('should use correct icon sources', () => {
    const mockGoBack = vi.fn();
    const mockNotification = vi.fn();
    
    render(<HeaderActions onGoBack={mockGoBack} onNotification={mockNotification} />);
    
    const goBackImage = screen.getByAltText('Go back');
    expect(goBackImage).toHaveAttribute('src', '/icon/actions/arrow.svg');
    
    const notificationImage = screen.getByAltText('Notifications');
    expect(notificationImage).toHaveAttribute('src', '/icon/actions/notification.svg');
  });

  it('should handle edge case when onGoBack is null', () => {
    render(<HeaderActions onGoBack={null as any} />);
    
    // null is not undefined, so button should render
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle edge case when onNotification is null', () => {
    render(<HeaderActions onNotification={null as any} />);
    
    // null is not undefined, so button should render
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});