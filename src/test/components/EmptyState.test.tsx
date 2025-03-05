import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../../components/EmptyState';

describe('EmptyState', () => {
  it('renders title and message', () => {
    render(<EmptyState title="Test Title" message="Test message" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState 
        title="Test Title" 
        message="Test message" 
        action={{ label: 'Test Action', onClick: handleAction }}
      />
    );
    
    const actionButton = screen.getByText('Test Action');
    expect(actionButton).toBeInTheDocument();
    
    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when not provided', () => {
    render(<EmptyState title="Test Title" message="Test message" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<EmptyState title="Test Title" message="Test message" />);
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('h-12 w-12');
  });
});