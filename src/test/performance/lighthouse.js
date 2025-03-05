import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { expect } from 'vitest';

const launchChromeAndRunLighthouse = async (url) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { 
    logLevel: 'info',
    output: 'json',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
  };

  const results = await lighthouse(url, options);
  await chrome.kill();

  return results.lhr;
};

describe('Lighthouse Performance Tests', () => {
  it('meets performance benchmarks', async () => {
    const results = await launchChromeAndRunLighthouse('http://localhost:5173');
    
    expect(results.categories.performance.score).toBeGreaterThanOrEqual(0.9);
    expect(results.categories.accessibility.score).toBeGreaterThanOrEqual(0.9);
    expect(results.categories['best-practices'].score).toBeGreaterThanOrEqual(0.9);
    expect(results.categories.seo.score).toBeGreaterThanOrEqual(0.9);
  });
});