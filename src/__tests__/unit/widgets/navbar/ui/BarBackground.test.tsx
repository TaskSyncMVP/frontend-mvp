import { render, screen } from '@testing-library/react';
import { BarBackground } from '@/widgets/navbar/ui/BarBackground';

describe('BarBackground', () => {
  it('should render SVG element', () => {
    render(<BarBackground />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct SVG attributes', () => {
    render(<BarBackground />);
    
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 375 56');
    expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  it('should apply correct CSS classes', () => {
    render(<BarBackground />);
    
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('absolute', 'inset-x-0', 'bottom-0', 'w-full', 'h-full');
  });

  it('should have correct drop shadow style', () => {
    render(<BarBackground />);
    
    const svg = document.querySelector('svg');
    expect(svg).toHaveStyle({
      filter: 'drop-shadow(0px -2px 10px rgba(0, 0, 0, 0.1))'
    });
  });

  it('should contain path element with correct attributes', () => {
    render(<BarBackground />);
    
    const path = document.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('fill', 'var(--primary-30)');
  });

  it('should have correct path data', () => {
    render(<BarBackground />);
    
    const path = document.querySelector('path');
    const expectedPath = 'M0 22C0 9.84974 9.84974 0 22 0H93.5H141C141 0 145.5 0 154 0C164.148 0 162 27 187.5 27C214.5 27 210.735 -5.64924e-06 220.5 0C229 4.91738e-06 233.5 0 233.5 0H282.5H353C365.15 0 375 9.84974 375 22V56H0V22Z';
    expect(path?.getAttribute('d')?.replace(/\s+/g, ' ').trim()).toBe(expectedPath.replace(/\s+/g, ' ').trim());
  });

  it('should be accessible', () => {
    render(<BarBackground />);
    
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // SVG should be decorative (no alt text needed for background)
    expect(svg).not.toHaveAttribute('alt');
    expect(svg).not.toHaveAttribute('aria-label');
  });

  it('should render without errors', () => {
    expect(() => render(<BarBackground />)).not.toThrow();
  });
});