import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackButton from '../../components/FeedbackButton';

describe('FeedbackButton', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders button correctly', () => {
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Provide Feedback')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Provide Feedback');
  });

  it('opens modal on click', async () => {
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    await userEvent.click(screen.getByText('Provide Feedback'));
    expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('closes modal when clicking outside', async () => {
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    await userEvent.click(screen.getByText('Provide Feedback'));
    const dialog = screen.getByRole('dialog');
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('closes modal with escape key', async () => {
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    await userEvent.click(screen.getByText('Provide Feedback'));
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('requires satisfaction score before submission', async () => {
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    await userEvent.click(screen.getByText('Provide Feedback'));
    await userEvent.click(screen.getByText('Submit Feedback'));
    
    expect(screen.getByText('Please select a satisfaction score')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits feedback successfully', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    
    await userEvent.click(screen.getByText('Provide Feedback'));
    await userEvent.click(screen.getByText('Satisfied'));
    await userEvent.type(screen.getByPlaceholderText('Share your thoughts...'), 'Great experience!');
    await userEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(5, 'Great experience!');
    });
  });

  it('handles submission errors', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('Submission failed'));
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    
    await userEvent.click(screen.getByText('Provide Feedback'));
    await userEvent.click(screen.getByText('Satisfied'));
    await userEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(screen.getByText('Failed to submit feedback. Please try again.')).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    mockOnSubmit.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    
    await userEvent.click(screen.getByText('Provide Feedback'));
    await userEvent.click(screen.getByText('Satisfied'));
    const submitButton = screen.getByText('Submit Feedback');
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeInTheDocument();
    });
  });

  it('maintains focus management', async () => {
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    
    const openButton = screen.getByText('Provide Feedback');
    await userEvent.click(openButton);
    
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByText('Satisfied')).toHaveFocus();

    await userEvent.click(closeButton);
    expect(openButton).toHaveFocus();
  });

  it('preserves form state between reopens', async () => {
    render(<FeedbackButton onSubmit={mockOnSubmit} />);
    
    // First open
    await userEvent.click(screen.getByText('Provide Feedback'));
    await userEvent.click(screen.getByText('Satisfied'));
    await userEvent.type(screen.getByPlaceholderText('Share your thoughts...'), 'Test feedback');
    await userEvent.click(screen.getByLabelText('Close'));

    // Reopen
    await userEvent.click(screen.getByText('Provide Feedback'));
    expect(screen.getByPlaceholderText('Share your thoughts...')).toHaveValue('');
    expect(screen.getByText('Satisfied')).not.toHaveClass('border-success');
  });
});