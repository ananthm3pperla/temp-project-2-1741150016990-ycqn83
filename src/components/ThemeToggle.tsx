import React, { useId } from 'react';
import { Sun, Moon, Monitor, Contrast } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const selectId = useId();

  return (
    <div className="relative inline-block">
      <label 
        htmlFor={selectId}
        className="sr-only"
      >
        Select color theme
      </label>
      <select
        id={selectId}
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system' | 'high-contrast')}
        className="appearance-none bg-card border border-default rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Select color theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
        <option value="high-contrast">High Contrast</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2" aria-hidden="true">
        {theme === 'light' && <Sun className="h-4 w-4 text-muted" />}
        {theme === 'dark' && <Moon className="h-4 w-4 text-muted" />}
        {theme === 'system' && <Monitor className="h-4 w-4 text-muted" />}
        {theme === 'high-contrast' && <Contrast className="h-4 w-4 text-muted" />}
      </div>
    </div>
  );
}