import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../components/ThemeToggle';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('ThemeToggle', () => {
  it('renders theme options', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const select = screen.getByLabelText('Select color theme');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
  });

  it('changes theme when selected', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const select = screen.getByLabelText('Select color theme');
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(select).toHaveValue('dark');
  });

  it('maintains focus when theme changes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const select = screen.getByLabelText('Select color theme');
    select.focus();
    fireEvent.change(select, { target: { value: 'high-contrast' } });
    expect(select).toHaveFocus();
  });
});