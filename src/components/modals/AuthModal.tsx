'use client';

import { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './AuthModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';

interface AuthModalProps {
    onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
        setError(null);
        setLoading(true);
        const provider = providerName === 'google'
            ? new GoogleAuthProvider()
            : new FacebookAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            onClose();
        } catch (err: any) {
            console.warn("Social login error:", err.code);
            setError(err.message || `Error al conectar con ${providerName}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: displayName
                });
            }
            onClose();
        } catch (err: any) {
            console.warn("Auth error:", err.code);
            let errorMessage = 'Ocurrió un error inesperado';

            switch (err.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'El email ya está registrado. ¿Quizás querías iniciar sesión?';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'El registro con email/contraseña no está habilitado en Firebase. Actívalo en Auth > Settings.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del email no es válido.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es demasiado débil (mínimo 6 caracteres).';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Email o contraseña incorrectos.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde.';
                    break;
                default:
                    errorMessage = err.message || errorMessage;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>

                <h2 className={styles.title}>
                    {isLogin ? 'Bienvenido' : 'Únete a la elite'}
                </h2>
                <p className={styles.subtitle}>
                    {isLogin
                        ? 'Accede para compartir tus progresos y descargar saves de la comunidad'
                        : 'Crea tu cuenta para empezar a compartir tus mundos de Farlands'}
                </p>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="displayName">Nombre de Piloto</label>
                            <input
                                id="displayName"
                                type="text"
                                className={styles.input}
                                placeholder="Ej. Comandante Shepard"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            placeholder="piloto@farlands.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : (isLogin ? 'Identificarse' : 'Registrarse')}
                    </button>
                </form>

                <div className={styles.separator}>
                    <span>O también con</span>
                </div>

                <div className={styles.socialButtons}>
                    <button
                        className={styles.googleButton}
                        onClick={() => handleSocialLogin('google')}
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faGoogle as any} /> Identificarse con Google
                    </button>
                </div>

                <p className={styles.switchText}>
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya eres miembro?'}
                    <span
                        className={styles.switchLink}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                    </span>
                </p>
            </div>
        </div>
    );
}
