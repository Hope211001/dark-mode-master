import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { authService } from '@/services/auth.service';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSent(true);
      Swal.fire({
        icon: 'success',
        title: 'Email envoyé',
        text: res.message,
        confirmButtonColor: '#059669',
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error?.response?.data?.error || 'Impossible d\'envoyer le mail',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="mt-4 text-lg font-bold text-gray-900">Mot de passe oublié</h2>
          <p className="text-[13px] text-gray-500 mt-1">
            Saisissez votre email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="rounded-xl border border-clay-200 bg-clay-50 p-4">
              <p className="text-sm text-clay-800">
                Si un compte existe avec cet email, vous recevrez le lien dans quelques instants. Pensez à vérifier vos spams.
              </p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-[13px] text-clay-600 hover:text-clay-700 font-bold">
              <ArrowLeft size={14} /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500/20 transition-all"
                  placeholder="nom@exemple.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-clay-600 to-clay-600 hover:from-clay-700 hover:to-clay-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-clay-600/20 active:scale-95 disabled:opacity-50 text-sm"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Envoyer le lien"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700">
                <ArrowLeft size={14} /> Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
