import { render, screen } from '@testing-library/react';
import { DesktopNavbar, DesktopNavItem } from '@/widgets/navbar/ui/DesktopNavbar';
import { vi } from 'vitest';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className, style }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} style={style} />
  )
}));

vi.mock('next/link', () => ({
  default: ({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  )
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn()
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

const mockUsePathname = vi.mocked(await import('next/navigation')).usePathname;

describe('DesktopNavItem', () => {
  it('should render nav item with correct props', () => {
    render(<DesktopNavItem iconType="home" href="/home" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/home');
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/icon/actions/home.svg');
    expect(image).toHaveAttribute('width', '40');
    expect(image).toHaveAttribute('height', '40');
  });

  it('should apply active styles when isActive is true', () => {
    render(<DesktopNavItem iconType="home" href="/home" isActive={true} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('shadow-largeDrop');
  });

  it('should not apply active styles when isActive is false', () => {
    render(<DesktopNavItem iconType="home" href="/home" isActive={false} />);
    
    const link = screen.getByRole('link');
    expect(link).not.toHaveClass('shadow-largeDrop');
  });

  it('should apply correct CSS classes', () => {
    render(<DesktopNavItem iconType="home" href="/home" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('flex', 'justify-center', 'items-center', 'gap-3', 'px-3', 'py-2', 'rounded-lg');
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass('transition-transform', 'hover:scale-110', 'text-primary-100');
  });

  it('should apply correct filter style to image', () => {
    render(<DesktopNavItem iconType="home" href="/home" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveStyle({
      filter: 'brightness(0) saturate(100%) invert(25%) sepia(84%) saturate(650%) hue-rotate(220deg) brightness(95%) contrast(95%)'
    });
  });
});

describe('DesktopNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all navigation items', () => {
    mockUsePathname.mockReturnValue('/home');
    render(<DesktopNavbar />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
    
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/home');
    expect(screen.getByRole('link', { name: /calendar/i })).toHaveAttribute('href', '/time-blocking');
    expect(screen.getByRole('link', { name: /document/i })).toHaveAttribute('href', '/tasks');
    expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute('href', '/menu');
  });

  it('should highlight active page based on pathname', () => {
    mockUsePathname.mockReturnValue('/home');
    render(<DesktopNavbar />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('shadow-largeDrop');
    
    const otherLinks = screen.getAllByRole('link').filter(link => 
      !link.getAttribute('href')?.includes('/home')
    );
    otherLinks.forEach(link => {
      expect(link).not.toHaveClass('shadow-largeDrop');
    });
  });

  it('should highlight tasks page when pathname is /tasks', () => {
    mockUsePathname.mockReturnValue('/tasks');
    render(<DesktopNavbar />);
    
    const tasksLink = screen.getByRole('link', { name: /document/i });
    expect(tasksLink).toHaveClass('shadow-largeDrop');
  });

  it('should highlight time-blocking page when pathname is /time-blocking', () => {
    mockUsePathname.mockReturnValue('/time-blocking');
    render(<DesktopNavbar />);
    
    const calendarLink = screen.getByRole('link', { name: /calendar/i });
    expect(calendarLink).toHaveClass('shadow-largeDrop');
  });

  it('should highlight menu page when pathname is /menu', () => {
    mockUsePathname.mockReturnValue('/menu');
    render(<DesktopNavbar />);
    
    const menuLink = screen.getByRole('link', { name: /profile/i });
    expect(menuLink).toHaveClass('shadow-largeDrop');
  });

  it('should apply correct container styles', () => {
    mockUsePathname.mockReturnValue('/home');
    render(<DesktopNavbar />);
    
    const container = document.querySelector('.fixed.top-5');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(
      'fixed', 'top-5', 'left-1/2', 'transform', '-translate-x-1/2', 'z-10',
      'bg-primary-30', 'border', 'border-primary-100/20', 'shadow-sm', 'rounded-full', 'max-w-sm'
    );
  });

  it('should render navigation with correct structure', () => {
    mockUsePathname.mockReturnValue('/home');
    render(<DesktopNavbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('flex', 'items-center', 'gap-6');
  });

  it('should handle unknown pathname gracefully', () => {
    mockUsePathname.mockReturnValue('/unknown-page');
    render(<DesktopNavbar />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).not.toHaveClass('shadow-largeDrop');
    });
  });
});