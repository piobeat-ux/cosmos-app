import { useState } from 'react';
import { Radio, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

// Простейшая авторизация — пароль захардкожен
// В реальном приложении используйте Supabase Auth
const ADMIN_PASSWORD = 'cosmos2026';

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('cosmos_fm_admin', 'true');
      onLogin();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mx-auto mb-4">
            <Radio className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Cosmos FM</h1>
          <p className="text-[#71717a]">Административная панель</p>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#13131f] border border-[#27273a] focus:border-[#6366f1] focus:outline-none transition-colors"
                  placeholder="Введите пароль"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="text-[#ef4444] text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3"
            >
              Войти
            </button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20">
            <p className="text-sm text-[#f59e0b]">
              Пароль по умолчанию: <strong>cosmos2026</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          className="w-full text-center mt-4 text-sm text-[#71717a] hover:text-white transition-colors"
        >
          Вернуться на сайт
        </button>
      </div>
    </div>
  );
}
