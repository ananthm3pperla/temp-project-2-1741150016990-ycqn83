import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { companySettings } from '../data/company';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate('/login');
    } catch (err) {
      setError('Error creating account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Client Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={companySettings.branding.logo}
              alt={companySettings.name}
              className="h-20 w-auto"
            />
          </div>

          {/* Hi-Bridge Logo */}
          <div className="flex justify-center items-center gap-2">
            {companySettings.branding.hiBridgeLogo?.type === 'icon' ? (
              <Building2 className="h-5 w-5 text-gray-400" />
            ) : companySettings.branding.hiBridgeLogo?.src ? (
              <img
                src={companySettings.branding.hiBridgeLogo.src}
                alt="Hi-Bridge"
                className="h-5 w-auto"
              />
            ) : null}
            <span className="text-sm text-gray-400">Powered by Hi-Bridge</span>
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the {companySettings.name} Team Portal
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  '&:focus': {
                    borderColor: companySettings.branding.primaryColor,
                    ringColor: companySettings.branding.primaryColor
                  }
                }}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  '&:focus': {
                    borderColor: companySettings.branding.primaryColor,
                    ringColor: companySettings.branding.primaryColor
                  }
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              style={{ backgroundColor: companySettings.branding.primaryColor }}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Sign up
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium"
              style={{ color: companySettings.branding.primaryColor }}
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}