import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  needsTwoFactor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo
const mockUser: User = {
  member_id: '00000000-0000-0000-0000-000000000001',
  member_name: 'Richard D. Fairbank',
  member_email: 'rich.fairbank@capitalone.com',
  member_role: 'Chief Executive Officer',
  member_department: 'Executive',
  member_avatar: 'https://media.licdn.com/dms/image/C4D03AQFp8G7eXBgSyQ/profile-displayphoto-shrink_800_800/0/1516240909001?e=1714003200&v=beta&t=Yx_9nWk-9_HZA_dSh-XLHHwX_9lxvDUzPHFmXZlNQtY',
  member_work_type: 'office',
  member_attendance: {
    total: 250,
    streak: 15,
    lastVisit: new Date().toISOString(),
    reports_to: null
  },
  department_size: 5,
  department_in_office: 3,
  department_remote: 1,
  department_flexible: 1
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(mockUser);
  const [loading] = useState(false);
  const [needsTwoFactor] = useState(false);

  const signOut = async () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signOut,
      needsTwoFactor
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}