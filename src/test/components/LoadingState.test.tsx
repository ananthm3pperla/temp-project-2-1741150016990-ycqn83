import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingState from '../../components/LoadingState';

describe('LoadingState', () => {
  it('renders default loading message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom loading message', () => {
    render(<LoadingState message="Custom loading message" />);
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('renders loading spinner', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toHaveClass('animate-spin');
  });

  it('maintains minimum height', () => {
    const { container } = render(<LoadingState />);
    expect(container.firstChild).toHaveClass('min-h-[200px]');
  });
});