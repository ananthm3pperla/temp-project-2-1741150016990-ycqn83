import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';

describe('Login Page', () => {
  it('renders login page with company branding', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome, Richard D. Fairbank/i)).toBeInTheDocument();
    expect(screen.getByText(/Chief Executive Officer, Capital One/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by Hi-Bridge/i)).toBeInTheDocument();
  });

  it('redirects to dashboard after delay', async () => {
    vi.useFakeTimers();
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    vi.advanceTimersByTime(1500);
    expect(mockNavigate).toHaveBeenCalledWith('/');
    vi.useRealTimers();
  });
});