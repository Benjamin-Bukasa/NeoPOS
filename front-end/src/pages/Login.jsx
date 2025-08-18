
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/pamoja/api/auth/login', { email, password });
      if (res.data && res.data.token) {
        // Use Zustand store to sync token and user
        login(res.data.token, res.data.user || null);
        if (remember) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        if (onLogin) onLogin();
        navigate('/dashboard', { replace: true });
      } else {
        setError('Identifiants invalides');
      }
    } catch {
      setError('Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  // Pré-remplir l'email si "se souvenir de moi"
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-rose-700 mb-4">Connexion</h2>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-600"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          <label htmlFor="remember" className="text-sm text-gray-700 select-none">Se souvenir de moi</label>
        </div>
        {error && <div className="text-center text-red-500 font-semibold animate-pulse">{error}</div>}
        <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default Login;