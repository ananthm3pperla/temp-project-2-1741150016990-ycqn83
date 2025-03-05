import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from '../../components/ErrorState';

describe('ErrorState', () => {
  it('renders error message', () => {
    render(<ErrorState message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders retry button when onRetry provided', () => {
    const handleRetry = vi.fn();
    render(<ErrorState message="Test error" onRetry={handleRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry not provided', () => {
    render(<ErrorState message="Test error" />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('renders error icon', () => {
    render(<ErrorState message="Test error" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('h-5 w-5');
  });
});