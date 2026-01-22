import { render, screen } from '@testing-library/react';
import { NavItem } from '@/widgets/navbar/ui/NavItem';
import { vi } from 'vitest';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, style, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} style={style} className={className} />
  )
}));

vi.mock('next/link', () => ({
  default: ({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  )
}));

// Mock iconMap
vi.mock('@/widgets/navbar/props/navItem-props', () => ({
  iconMap: {
    home: '/icon/actions/home.svg',
    calendar: '/icon/actions/calendar.svg',
    document: '/icon/actions/document.svg',
    'profile-2user': '/icon/actions/profile-2user.svg'
  }
}));

describe('NavItem', () => {
  it('should render nav item with correct href', () => {
    render(<NavItem iconType="home" href="/home" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('should render image with correct props', () => {
    render(<NavItem iconType="home" href="/home" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/icon/actions/home.svg');
    expect(image).toHaveAttribute('alt', 'home');
    expect(image).toHaveAttribute('width', '24');
    expect(image).toHaveAttribute('height', '24');
  });

  it('should apply correct CSS classes to link', () => {
    render(<NavItem iconType="home" href="/home" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 
      'text-primary', 'bg-primary-30', 'rounded-lg'
    );
  });

  it('should apply correct CSS classes to image', () => {
    render(<NavItem iconType="home" href="/home" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass('filter-primary');
  });

  it('should apply correct style to image', () => {
    render(<NavItem iconType="home" href="/home" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveStyle({ filter: 'var(--primary-filter' });
  });

  it('should work with different icon types', () => {
    const iconTypes = ['home', 'calendar', 'document', 'profile-2user'] as const;
    
    iconTypes.forEach(iconType => {
      const { unmount } = render(<NavItem iconType={iconType} href={`/${iconType}`} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/${iconType}`);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', iconType);
      expect(image).toHaveAttribute('src', `/icon/actions/${iconType}.svg`);
      
      unmount();
    });
  });

  it('should handle different href patterns', () => {
    const testCases = [
      { iconType: 'home' as const, href: '/home' },
      { iconType: 'calendar' as const, href: '/time-blocking' },
      { iconType: 'document' as const, href: '/tasks' },
      { iconType: 'profile-2user' as const, href: '/menu' }
    ];
    
    testCases.forEach(({ iconType, href }) => {
      const { unmount } = render(<NavItem iconType={iconType} href={href} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', href);
      
      unmount();
    });
  });

  it('should be accessible', () => {
    render(<NavItem iconType="home" href="/home" />);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'home');
  });
});