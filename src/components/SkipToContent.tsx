import React from 'react';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      onFocus={(e) => e.currentTarget.classList.add('focus:not-sr-only')}
      onBlur={(e) => e.currentTarget.classList.remove('focus:not-sr-only')}
    >
      Skip to main content
    </a>
  );
}