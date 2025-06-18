import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, Building2, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          setShowConfirmation(true);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setError('Пожалуйста, подтвердите ваш email перед входом в систему.');
          } else {
            setError(error.message);
          }
        }
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-green-600 p-3 rounded-xl inline-block mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Проверьте email</h1>
            <p className="text-slate-600">Мы отправили письмо с подтверждением</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Письмо отправлено!
                </h3>
                <p className="text-slate-600 text-sm">
                  Мы отправили письмо с подтверждением на адрес:
                </p>
                <p className="font-medium text-blue-600 mt-1">{email}</p>
              </div>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Что делать дальше:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-left">
                    <li>Откройте ваш почтовый ящик</li>
                    <li>Найдите письмо от СтройМонитор</li>
                    <li>Нажмите на кнопку "Подтвердить email"</li>
                    <li>Вернитесь сюда для входа в систему</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 font-medium mb-1">⚠️ Важно!</p>
                  <p className="text-yellow-700 text-xs">
                    Без подтверждения email вы не сможете войти в систему. 
                    Обязательно проверьте папку "Спам".
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  Не получили письмо? Попробуйте зарегистрироваться снова или обратитесь в поддержку.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setIsSignUp(false);
                  setEmail('');
                  setPassword('');
                  setFullName('');
                }}
                className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Вернуться к входу
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl inline-block mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">СтройМонитор</h1>
          <p className="text-slate-600">Система контроля затрат строительных проектов</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isSignUp ? 'Создать аккаунт' : 'Войти в систему'}
            </h2>
            <p className="text-slate-600">
              {isSignUp 
                ? 'Заполните данные для создания нового аккаунта' 
                : 'Введите ваши данные для входа'
              }
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                  Полное имя
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Иван Иванов"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="ivan@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-slate-500 mt-1">Минимум 6 символов</p>
              )}
            </div>

            {isSignUp && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-800 font-medium mb-1">Обязательное подтверждение email</p>
                    <p className="text-blue-700">
                      После регистрации мы отправим письмо с подтверждением на ваш email-адрес. 
                      <strong> Без подтверждения вход в систему будет невозможен.</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? <UserPlus className="h-5 w-5 mr-2" /> : <LogIn className="h-5 w-5 mr-2" />}
                  {isSignUp ? 'Создать аккаунт' : 'Войти'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isSignUp 
                ? 'Уже есть аккаунт? Войти' 
                : 'Нет аккаунта? Создать'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};