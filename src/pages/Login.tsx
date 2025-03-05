import React, { useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { companySettings } from '../data/company';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to dashboard after a brief delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-8">
            <img
              src={companySettings.branding.logo}
              alt={companySettings.name}
              className="h-20 w-auto"
            />
          </div>

          <div className="flex justify-center items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400">Powered by Hi-Bridge</span>
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome, Richard D. Fairbank
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chief Executive Officer, Capital One
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="animate-pulse text-sm text-gray-500">
              Preparing your dashboard...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}