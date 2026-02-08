// src/pages/auth/VerifyEmail.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/AuthContext'; // Importe ton hook

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth(); // ✅ Maintenant ça ne fera plus d'erreur !
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const verify = async () => {
            const token = searchParams.get('token');
            const id = searchParams.get('id');

            if (!token || !id) {
                setStatus('error');
                return;
            }

            try {
                // On appelle le backend qui renvoie { message, token, user }
                const response = await authService.verifyEmail(token, id);
                
                if (response.token && response.user) {
                    // ✅ On connecte l'utilisateur instantanément
                    loginWithToken(response.token, response.user);
                    setStatus('success');

                    // Redirection automatique vers le dashboard
                    setTimeout(() => {
                        response.user.role === 'admin' ? navigate('/admin') : navigate('/client');
                    }, 2000);
                }
            } catch (err) {
                setStatus('error');
            }
        };
        verify();
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            {status === 'loading' && <p>Vérification en cours...</p>}
            {status === 'success' && (
                <div className="text-center p-8 border border-green-500 rounded-2xl">
                    <h2 className="text-2xl font-bold text-green-500">Compte activé avec succès !</h2>
                    <p className="mt-2">Bienvenue. Redirection vers votre tableau de bord...</p>
                </div>
            )}
            {status === 'error' && (
                <div className="text-center p-8 border border-red-500 rounded-2xl">
                    <h2 className="text-2xl font-bold text-red-500">Erreur</h2>
                    <p>Le lien est invalide ou a déjà été utilisé.</p>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;