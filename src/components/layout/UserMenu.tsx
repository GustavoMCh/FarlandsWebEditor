'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import AuthModal from '../modals/AuthModal';
import styles from './UserMenu.module.css';

export default function UserMenu() {
    const { user, profile, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    if (loading) return <div className={styles.loading}>Cargando...</div>;

    const handleLogout = () => {
        signOut(auth);
        setShowDropdown(false);
    };

    return (
        <div className={styles.container}>
            {user ? (
                <div className={styles.userProfile}>
                    <div
                        className={styles.avatarContainer}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className={styles.avatar}>
                            {profile?.displayName?.[0] || user.email?.[0] || 'U'}
                        </div>
                        <span className={styles.username}>
                            {profile?.displayName || user.email?.split('@')[0]}
                        </span>
                        {profile?.role === 'admin' && <span className={styles.adminBadge}>Admin</span>}
                    </div>

                    {showDropdown && (
                        <div className={styles.dropdown}>
                            <button onClick={() => setShowDropdown(false)}>Mi Perfil</button>
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    className={styles.loginButton}
                    onClick={() => setShowAuthModal(true)}
                >
                    Acceder / Registro
                </button>
            )}

            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    );
}
