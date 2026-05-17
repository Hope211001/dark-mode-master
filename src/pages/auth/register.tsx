import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { GoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    authService.removeToken();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas',
        confirmButtonColor: '#D45F2A',
      });
    }
    if (formData.password.length < 6) {
      return Swal.fire({
        icon: 'warning',
        text: 'Le mot de passe doit contenir au moins 6 caractères',
        confirmButtonColor: '#D45F2A',
      });
    }
    setLoading(true);
    const result = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name || undefined,
    });
    if (result.success) {
      setIsSubmitted(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Échec',
        text: result.error || "Erreur d'inscription",
        confirmButtonColor: '#D45F2A',
      });
    }
    setLoading(false);
  };

  // Écran post-inscription : email envoyé
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-clay-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-sm text-center space-y-5">
          <div className="mx-auto w-14 h-14 bg-clay-50 border border-clay-200 rounded-full flex items-center justify-center">
            <Mail className="text-clay-600 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Vérifiez vos emails</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Un lien de confirmation a été envoyé à{' '}
              <span className="text-clay-600 font-semibold">{formData.email}</span>
            </p>
          </div>
          <div className="bg-clay-50 border border-clay-200 p-3 rounded-lg text-[12px] text-clay-700 text-left flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Cliquez sur le lien dans l'email pour activer votre compte. Pensez à vérifier vos spams.</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-clay-500 hover:bg-clay-600 text-white font-semibold py-3 rounded-full transition-all shadow-[0_4px_14px_-6px_rgba(212,95,42,0.45)] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            Aller à la connexion
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Formulaire d'inscription
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-clay-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-clay-500/6 rounded-full blur-3xl" />
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
              Nouveau compte
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Créer votre accès
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Premier arrivé, premier servi. Sécurisez votre territoire.
          </p>
        </div>

        {/* Google */}
        <div className="flex justify-center mb-5 overflow-hidden">
          <GoogleLogin
            onSuccess={(res) => loginWithGoogle(res.credential!, 'register')}
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
              ou via formulaire
            </span>
          </div>
        </div>

        <form className="space-y-3.5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 tracking-wider">
              Nom complet
            </label>
            <div className="relative group">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-clay-500 transition-colors"
                size={16}
              />
              <input
                name="name"
                type="text"
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-background text-sm text-foreground border border-border rounded-lg outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 tracking-wider">
              Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-clay-500 transition-colors"
                size={16}
              />
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-background text-sm text-foreground border border-border rounded-lg outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 tracking-wider">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-background text-sm text-foreground border border-border rounded-lg outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-all"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1 tracking-wider">
                Confirmation
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  name="confirmPassword"
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-background text-sm text-foreground border border-border rounded-lg outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/30 transition-all"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-clay-500 hover:bg-clay-600 text-white font-semibold py-3 rounded-full transition-all shadow-[0_4px_14px_-6px_rgba(212,95,42,0.45)] hover:shadow-[0_8px_20px_-8px_rgba(212,95,42,0.55)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Créer mon compte
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[13px] text-muted-foreground">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-semibold text-clay-600 hover:text-clay-700 transition-colors ml-1">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
