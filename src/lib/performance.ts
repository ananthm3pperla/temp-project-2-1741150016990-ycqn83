import { ReportHandler } from 'web-vitals';

// Performance monitoring
export const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Performance marks and measures
export const markAndMeasure = (markName: string, measureName: string) => {
  performance.mark(markName);
  performance.measure(measureName, markName);
};

// Long task monitoring
export const observeLongTasks = (callback: (duration: number) => void) => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      callback(entry.duration);
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
  return observer;
};

// Resource timing monitoring
export const observeResourceTiming = (callback: (entry: PerformanceEntry) => void) => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(callback);
  });

  observer.observe({ entryTypes: ['resource'] });
  return observer;
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    };
  }
  return null;
};