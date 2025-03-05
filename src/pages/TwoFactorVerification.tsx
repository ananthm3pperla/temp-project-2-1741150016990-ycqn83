import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { companySettings } from '../data/company';
import { Building2, Shield, Loader2 } from 'lucide-react';

export default function TwoFactorVerification() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyTwoFactor } = useAuth();

  useEffect(() => {
    // Code will be sent automatically when this component mounts
    // The Edge Function handles sending the email
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyTwoFactor(code);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
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

          <div className="flex justify-center mt-6">
            <Shield className="h-12 w-12 text-primary" />
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Device
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the verification code sent to your Capital One email
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="sr-only">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Verify Device'
              )}
            </button>
          </div>

          <div className="text-sm text-center text-gray-500">
            <p>This device will be remembered for future logins</p>
          </div>
        </form>
      </div>
    </div>
  );
}