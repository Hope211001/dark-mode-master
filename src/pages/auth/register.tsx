import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, Lock, User, Shield } from 'lucide-react';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setLoading(false);
            return;
        }

        const result = await register({
            email: formData.email,
            password: formData.password,
            name: formData.name || undefined,
        });

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Erreur d\'inscription');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            {/* Effets de fond décoratifs améliorés */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-md w-full space-y-8 bg-gray-800/60 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">

                {/* En-tête du formulaire */}
                <div className="text-center">
                    <div className="flex items-center space-x-3 mb-4 justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 transform hover:scale-105 transition-transform">
                            <MapPin className="text-white" size={26} />
                        </div>
                        <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            ImmoScout
                        </h1>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Rejoignez-nous dès aujourd'hui
                    </p>
                </div>

                {/* Message d'erreur amélioré */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg backdrop-blur-sm animate-shake">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <Shield className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    {/* Champ Nom */}
                    <div className="group">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Nom complet (optionnel)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                                placeholder="Jean Dupont"
                            />
                        </div>
                    </div>

                    {/* Champ Email */}
                    <div className="group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Adresse email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                                placeholder="exemple@email.com"
                            />
                        </div>
                    </div>

                    {/* Champ Mot de passe */}
                    <div className="group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
                    </div>

                    {/* Champ Confirmation Mot de passe */}
                    <div className="group">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Bouton de soumission amélioré */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    <span>Inscription en cours...</span>
                                </>
                            ) : (
                                <>
                                    <span>S'inscrire</span>
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Séparateur */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-800/60 text-gray-400">ou</span>
                    </div>
                </div>

                {/* Liens de navigation */}
                <div className="text-center space-y-3">
                    <p className="text-sm text-gray-400">
                        Déjà un compte ?{' '}
                        <Link 
                            to="/login" 
                            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-200 inline-flex items-center space-x-1"
                        >
                            <span>Se connecter</span>
                            <ArrowRight size={16} />
                        </Link>
                    </p>
                    
                    <div className="pt-3 border-t border-gray-700/50">
                        <Link 
                            to="/" 
                            className="text-gray-500 hover:text-indigo-400 text-sm flex items-center justify-center space-x-2 transition-colors group"
                        >
                            <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                            <span>Retour à l'accueil</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;