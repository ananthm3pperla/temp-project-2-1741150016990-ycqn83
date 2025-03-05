import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Dashboard from '../../pages/Dashboard';
import Schedule from '../../pages/Schedule';
import Profile from '../../pages/Profile';
import Team from '../../pages/Team';

describe('Performance Metrics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const measureRenderTime = (Component: React.ComponentType) => {
    const start = performance.now();
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Component />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
    return performance.now() - start;
  };

  const measureReRenderTime = (Component: React.ComponentType) => {
    const { rerender } = render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Component />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const start = performance.now();
    rerender(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Component />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
    return performance.now() - start;
  };

  it('dashboard renders within performance budget', () => {
    const renderTime = measureRenderTime(Dashboard);
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('schedule renders within performance budget', () => {
    const renderTime = measureRenderTime(Schedule);
    expect(renderTime).toBeLessThan(100);
  });

  it('profile renders within performance budget', () => {
    const renderTime = measureRenderTime(Profile);
    expect(renderTime).toBeLessThan(100);
  });

  it('team renders within performance budget', () => {
    const renderTime = measureRenderTime(Team);
    expect(renderTime).toBeLessThan(100);
  });

  it('components re-render efficiently', () => {
    const components = [Dashboard, Schedule, Profile, Team];
    components.forEach(Component => {
      const reRenderTime = measureReRenderTime(Component);
      expect(reRenderTime).toBeLessThan(50); // 50ms budget for re-renders
    });
  });

  it('measures memory usage', () => {
    const initialMemory = performance.memory?.usedJSHeapSize;
    const components = [Dashboard, Schedule, Profile, Team];
    
    components.forEach(Component => {
      render(
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <Component />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      );
    });

    const finalMemory = performance.memory?.usedJSHeapSize;
    const memoryIncrease = finalMemory - initialMemory;
    
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB budget
  });
});