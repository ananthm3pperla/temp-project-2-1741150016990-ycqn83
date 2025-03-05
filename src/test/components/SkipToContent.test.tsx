import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SkipToContent from '../../components/SkipToContent';

describe('SkipToContent', () => {
  it('is hidden by default', () => {
    render(<SkipToContent />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveClass('sr-only');
  });

  it('becomes visible on focus', () => {
    render(<SkipToContent />);
    const link = screen.getByText('Skip to main content');
    fireEvent.focus(link);
    expect(link).toHaveClass('focus:not-sr-only');
  });

  it('hides again on blur', () => {
    render(<SkipToContent />);
    const link = screen.getByText('Skip to main content');
    fireEvent.focus(link);
    fireEvent.blur(link);
    expect(link).not.toHaveClass('focus:not-sr-only');
  });

  it('links to main content', () => {
    render(<SkipToContent />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveAttribute('href', '#main-content');
  });
});