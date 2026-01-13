import { render, screen } from '@testing-library/react';
import { MenuButton } from '@/screens/menu/ui/MenuButton';
import { vi } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height }: any) => (
    <img src={src} alt={alt} width={width} height={height} />
  )
}));

// Mock LinkButton component
vi.mock('@shared/ui', () => ({
  LinkButton: ({ href, className, children }: any) => (
    <a href={href} className={className}>{children}</a>
  )
}));

describe('MenuButton', () => {
  const defaultProps = {
    icon: '/icon/test.svg',
    alt: 'Test Icon',
    children: 'Test Button',
    href: '/test'
  };

  it('should render with correct props', () => {
    render(<MenuButton {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveTextContent('Test Button');
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/icon/test.svg');
    expect(image).toHaveAttribute('alt', 'Test Icon');
  });

  it('should render image with correct dimensions', () => {
    render(<MenuButton {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('width', '24');
    expect(image).toHaveAttribute('height', '24');
  });

  it('should apply correct CSS classes', () => {
    render(<MenuButton {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'flex', 'gap-2', 'lg:py-4', 'lg:text-base', 'lg:px-8',
      'bg-secondary', 'text-secondary-foreground', 'items-center',
      'text-sm', 'font-semibold', 'shadow-md', 'hover:shadow-lg',
      'rounded-md', 'px-6', 'py-3'
    );
  });

  it('should render children content', () => {
    render(
      <MenuButton {...defaultProps}>
        <span>Custom Content</span>
      </MenuButton>
    );
    
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('should handle different icon sources', () => {
    const { rerender } = render(<MenuButton {...defaultProps} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('src', '/icon/test.svg');
    
    rerender(<MenuButton {...defaultProps} icon="/icon/different.svg" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/icon/different.svg');
  });

  it('should handle different alt text', () => {
    const { rerender } = render(<MenuButton {...defaultProps} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Icon');
    
    rerender(<MenuButton {...defaultProps} alt="Different Alt" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Different Alt');
  });

  it('should handle different href values', () => {
    const { rerender } = render(<MenuButton {...defaultProps} />);
    
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
    
    rerender(<MenuButton {...defaultProps} href="/different" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/different');
  });

  it('should render complex children', () => {
    render(
      <MenuButton {...defaultProps}>
        <div>
          <span>Title</span>
          <p>Description</p>
        </div>
      </MenuButton>
    );
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<MenuButton {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Test Icon');
  });

  it('should handle empty children gracefully', () => {
    render(<MenuButton {...defaultProps} children={null} />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });
});