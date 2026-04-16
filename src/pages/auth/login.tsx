import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);

    if (result.success && result.user) {
      result.user.role === 'admin' ? navigate('/admin') : navigate('/client');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: result.error || 'Identifiants invalides',
        confirmButtonColor: '#059669'
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xl transition-all">

        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Immo<span className="text-emerald-600">Scout</span>
            </h1>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Connectez-vous pour continuer</p>
          <Link to="/" className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors mt-1 inline-block">← Retour a l'accueil</Link>
        </div>

        <div className="flex justify-center mb-6 overflow-hidden">
          <GoogleLogin
            onSuccess={(res) => loginWithGoogle(res.credential!, 'login')}
            onError={() => Swal.fire('Erreur', 'Auth Google echouee', 'error')}
            theme="outline"
            shape="pill"
            width="100%"
          />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-3 text-gray-400 font-bold">ou par email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email" name="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                placeholder="nom@exemple.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"} name="password" value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} required
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 text-sm text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 text-sm">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Se connecter"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-[13px]">
            Pas encore membre ?{' '}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
