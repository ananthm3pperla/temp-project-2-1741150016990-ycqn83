import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, Calendar, Trophy, MessageSquare, Users, BarChart3 } from 'lucide-react';
import { MenuItem } from '../types';
import { companySettings } from '../data/company';
import clsx from 'clsx';

const navigation: MenuItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'My Schedule', href: '/schedule', icon: Calendar },
  { label: 'Rewards', href: '/rewards', icon: Trophy },
  { label: 'Feedback', href: '/feedback', icon: MessageSquare },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out group"
      style={{ width: isExpanded ? '18rem' : '5rem' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-default bg-card px-4 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          {isExpanded ? (
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center hover:opacity-80 transition-opacity"
                aria-label={`${companySettings.name} Home`}
              >
                <img
                  src={companySettings.branding.logo}
                  alt={companySettings.name}
                  className="h-8 w-auto"
                />
                <div className="h-6 w-px mx-4 bg-default/20" />
                {companySettings.branding.hiBridgeLogo?.type === 'icon' ? (
                  <Building2 className="h-5 w-5 text-muted" aria-hidden="true" />
                ) : companySettings.branding.hiBridgeLogo?.src ? (
                  <img
                    src={companySettings.branding.hiBridgeLogo.src}
                    alt="Hi-Bridge"
                    className="h-5 w-auto"
                  />
                ) : null}
              </Link>
            </div>
          ) : (
            <Link 
              to="/" 
              className="mx-auto hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              <Building2 className="h-6 w-6 text-muted" aria-hidden="true" />
            </Link>
          )}
        </div>
        <nav className="flex flex-1 flex-col" aria-label="Main Navigation">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className={clsx(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold whitespace-nowrap transition-colors',
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-default hover:bg-card-hover hover:text-default',
                          !isExpanded && 'justify-center'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon
                          className={clsx(
                            'h-6 w-6 shrink-0',
                            isActive
                              ? 'text-white'
                              : 'text-muted group-hover:text-default'
                          )}
                          aria-hidden="true"
                        />
                        <span 
                          className={clsx(
                            'transition-opacity duration-200',
                            isExpanded ? 'opacity-100' : 'opacity-0 hidden'
                          )}
                        >
                          {item.label}
                        </span>
                        {!isExpanded && (
                          <span className="sr-only">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}