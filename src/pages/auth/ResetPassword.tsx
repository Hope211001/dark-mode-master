import React, { useState, FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { authService } from '@/services/auth.service';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !id) {
      Swal.fire({ icon: 'error', title: 'Lien invalide', text: 'Token manquant dans le lien.', confirmButtonColor: '#dc2626' });
      return;
    }
    if (password !== confirm) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Les mots de passe ne correspondent pas', confirmButtonColor: '#dc2626' });
      return;
    }
    if (password.length < 6) {
      Swal.fire({ icon: 'error', title: 'Mot de passe trop court', text: 'Minimum 6 caractères', confirmButtonColor: '#dc2626' });
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(token, id, password);
      await Swal.fire({
        icon: 'success',
        title: 'Mot de passe réinitialisé',
        text: res.message,
        confirmButtonColor: '#059669',
      });
      navigate('/login');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error?.response?.data?.error || 'Impossible de réinitialiser',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Lien invalide</h1>
          <p className="text-sm text-gray-500 mb-4">
            Ce lien est incomplet ou expiré. Demandez un nouveau lien depuis la page de connexion.
          </p>
          <Link to="/forgot-password" className="text-clay-600 hover:text-clay-700 font-bold text-sm">
            Recommencer la procédure
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-64 h-64 bg-clay-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-64 h-64 bg-clay-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xl">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block group">
            <div className="w-12 h-12 bg-gradient-to-br from-clay-600 to-clay-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-clay-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Immo<span className="text-clay-600">Scout</span>
            </h1>
          </Link>
          <h2 className="mt-4 text-lg font-bold text-gray-900">Nouveau mot de passe</h2>
          <p className="text-[13px] text-gray-500 mt-1">Choisissez un mot de passe d'au moins 6 caractères.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 text-sm text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/20 transition-all"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Confirmer</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-clay-600 to-clay-600 hover:from-clay-700 hover:to-clay-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-clay-600/20 active:scale-95 disabled:opacity-50 text-sm"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Réinitialiser"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
