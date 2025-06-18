import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthForm } from './AuthForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🔍 ProtectedRoute render:', { 
    hasUser: !!user, 
    loading, 
    userId: user?.id?.substring(0, 8) + '...' 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Загрузка приложения...</p>
          <p className="text-xs text-slate-400 mt-2">Инициализация системы</p>
          <div className="mt-4 text-xs text-slate-400">
            <p>Если загрузка затянулась, попробуйте обновить страницу</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ No user found, showing auth form');
    return <AuthForm />;
  }

  console.log('✅ User authenticated, showing main app');
  return <>{children}</>;
};