import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
        confirmButtonColor: '#D45F2A',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Diffuses de fond — discret, clay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-clay-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-clay-500/6 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
        {/* Retour landing */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-clay-600 transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          Retour à l'accueil
        </Link>

        {/* Header */}
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clay-50 border border-clay-200">
            <span className="w-1.5 h-1.5 rounded-full bg-clay-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-clay-700">
              Espace Opérateur
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Connexion
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Accédez à votre territoire et à vos leads.
          </p>
        </div>

        {/* Google */}
        <div className="flex justify-center mb-5 overflow-hidden">
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
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              ou par email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-background text-sm text-foreground border border-border rounded-lg outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-all"
                placeholder="nom@exemple.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full pl-10 pr-12 py-2.5 bg-background text-sm text-foreground border border-border rounded-lg outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="text-right pt-1">
              <Link to="/forgot-password" className="text-[12px] text-clay-600 hover:text-clay-700 font-medium transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-clay-500 hover:bg-clay-600 text-white font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_14px_-6px_rgba(212,95,42,0.45)] hover:shadow-[0_8px_20px_-8px_rgba(212,95,42,0.55)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Se connecter
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-[13px]">
            Pas encore membre ?{' '}
            <Link to="/register" className="text-clay-600 hover:text-clay-700 font-semibold transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
