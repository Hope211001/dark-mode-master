import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { GoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    // États pour la visibilité des mots de passe
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
                background: '#1f2937', color: '#fff', confirmButtonColor: '#3b82f6'
            });
        }

        if (formData.password.length < 6) {
            return Swal.fire({
                icon: 'warning',
                text: 'Le mot de passe doit contenir au moins 6 caractères',
                background: '#1f2937', color: '#fff', confirmButtonColor: '#3b82f6'
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
                background: '#1f2937', color: '#fff'
            });
        }
        setLoading(false);
    };

    // --- ÉCRAN DE SUCCÈS COMPACT ---
    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative max-w-sm w-full bg-gray-800/50 backdrop-blur-xl p-8 rounded-3xl border border-blue-500/30 shadow-2xl text-center space-y-5">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="text-blue-400 w-8 h-8 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Vérifiez vos emails</h2>
                    <p className="text-sm text-gray-300">
                        Un lien de confirmation a été envoyé à : <br />
                        <span className="text-blue-400 font-semibold">{formData.email}</span>
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-[11px] text-blue-200">
                        Cliquez sur le lien dans l'email pour activer votre compte.
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        Aller à la connexion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] py-8 px-4 relative overflow-hidden">
            {/* Design Orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>

            <div className="relative max-w-[440px] w-full bg-gray-800/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl transition-all">
                
                {/* Logo Section */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block group">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/20 transform -rotate-3 group-hover:scale-105 transition-transform">
                            <MapPin className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Immo<span className="text-blue-500">Scout</span>
                        </h1>
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">Créez votre accès propriétaire</p>
                    <Link to="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1 inline-block">← Retour à l'accueil</Link>
                </div>

                {/* Google Button */}
                <div className="flex justify-center mb-6">
                    <GoogleLogin
                        onSuccess={(res) => loginWithGoogle(res.credential!, 'register')}
                        onError={() => Swal.fire('Erreur', 'Auth Google échouée', 'error')}
                        theme="filled_black"
                        shape="pill"
                        width="100%"
                    />
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#1e293b] px-3 text-gray-500 font-bold">ou via formulaire</span></div>
                </div>

                <form className="space-y-3.5" onSubmit={handleSubmit}>
                    {/* Nom Complet */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Nom complet</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                            <input name="name" type="text" onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-gray-900/40 text-sm text-white border border-gray-700 rounded-xl outline-none focus:border-blue-500 transition-all" placeholder="John Doe" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                            <input name="email" type="email" required onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-900/40 text-sm text-white border border-gray-700 rounded-xl outline-none focus:border-blue-500 transition-all" placeholder="john@example.com" />
                        </div>
                    </div>

                    {/* Mots de passe - Grid responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Mot de passe</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    name="password" 
                                    type={showPass ? "text" : "password"} 
                                    required 
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-900/40 text-sm text-white border border-gray-700 rounded-xl outline-none focus:border-blue-500 transition-all" 
                                    placeholder="••••••" 
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Confirmation</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    name="confirmPassword" 
                                    type={showConfirmPass ? "text" : "password"} 
                                    required 
                                    onChange={handleChange} 
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-900/40 text-sm text-white border border-gray-700 rounded-xl outline-none focus:border-blue-500 transition-all" 
                                    placeholder="••••••" 
                                />
                                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                    {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Créer mon compte"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-[13px] text-gray-400">
                        Déjà un compte ? <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors ml-1">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;