import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        logger.info('Processing auth callback');
        const code = searchParams.get('code');
        
        if (!code) {
          logger.error('No code parameter found in callback URL');
          navigate('/login');
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          logger.error('Error exchanging code for session', error);
          navigate('/login');
          return;
        }

        logger.info('Successfully processed auth callback');
        navigate('/');
      } catch (error) {
        logger.error('Unexpected error in auth callback', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-lg text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}