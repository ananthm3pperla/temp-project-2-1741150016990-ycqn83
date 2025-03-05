import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { companySettings } from '../data/company';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-2 sm:gap-x-4 border-b border-default bg-card px-3 sm:px-4 shadow-sm lg:gap-x-6 lg:px-8">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch items-center justify-end">
        <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
          <button 
            className="text-muted hover:text-default relative p-1 sm:p-0"
            aria-label="View notifications"
          >
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-error text-[9px] sm:text-[10px] text-white flex items-center justify-center">
              3
            </span>
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </button>

          <div className="hidden sm:block h-6 w-px bg-default/20" />
          
          <div className="relative" ref={dropdownRef}>
            <button
              ref={buttonRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleKeyDown}
              className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <img
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-card object-cover"
                src="https://media.licdn.com/dms/image/C4D03AQFp8G7eXBgSyQ/profile-displayphoto-shrink_800_800/0/1516240909001?e=1714003200&v=beta&t=Yx_9nWk-9_HZA_dSh-XLHHwX_9lxvDUzPHFmXZlNQtY"
                alt="Richard D. Fairbank"
              />
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted" aria-hidden="true" />
            </button>

            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-1.5 sm:mt-2 w-44 sm:w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-default ring-opacity-5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                onKeyDown={handleKeyDown}
              >
                <Link
                  to="/profile"
                  className="block px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-default hover:bg-card-hover"
                  onClick={() => setIsDropdownOpen(false)}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-card object-cover"
                      src="https://media.licdn.com/dms/image/C4D03AQFp8G7eXBgSyQ/profile-displayphoto-shrink_800_800/0/1516240909001?e=1714003200&v=beta&t=Yx_9nWk-9_HZA_dSh-XLHHwX_9lxvDUzPHFmXZlNQtY"
                      alt="Richard D. Fairbank"
                    />
                    <div>
                      <div className="font-medium text-xs sm:text-sm">Richard D. Fairbank</div>
                      <div className="text-[10px] sm:text-xs text-muted">View Profile</div>
                    </div>
                  </div>
                </Link>
                
                <div className="border-t border-default my-1"></div>
                
                <button
                  className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-default hover:bg-card-hover"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    // Add notifications handling here
                  }}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Notifications
                    <span className="ml-auto bg-error/10 text-error text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full">
                      3
                    </span>
                  </div>
                </button>
                
                <Link
                  to="/settings"
                  className="block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-default hover:bg-card-hover"
                  onClick={() => setIsDropdownOpen(false)}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Settings
                  </div>
                </Link>
                
                <div className="border-t border-default my-1"></div>
                
                <button
                  className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-default hover:bg-card-hover"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    signOut();
                  }}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Sign out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}