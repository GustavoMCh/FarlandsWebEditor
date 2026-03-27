'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import ImportSaveModal from '../modals/ImportSaveModal';
import styles from './CommunitySaves.module.css';

export default function CommunitySaves() {
    const [saves, setSaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [importingSave, setImportingSave] = useState<any | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'shared_saves'),
            orderBy('createdAt', 'desc'),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSaves(docs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) return <div className="text-center p-5">Explorando galaxias...</div>;

    if (!user) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>🚀 Partidas de la Comunidad</h3>
                <div className="text-center mt-4">
                    <p className="text-muted">Inicia sesión en la cuenta de Farlands Explorer (arriba) para ver y descargar las partidas compartidas por la comunidad.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>🚀 Partidas de la Comunidad</h3>

            {saves.length === 0 ? (
                <p className="text-center text-muted">Aún no hay partidas públicas. ¡Sé el primero en compartir!</p>
            ) : (
                <div className={styles.grid}>
                    {saves.map(save => (
                        <div key={save.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                {save.approved ? (
                                    <img src={save.screenshotUrl} alt={save.title} className={styles.screenshot} />
                                ) : (
                                    <div className={`${styles.screenshot} d-flex align-items-center justify-content-center bg-secondary text-white text-center p-3`}>
                                        <div className="d-flex flex-column align-items-center">
                                            <span style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</span>
                                            <span>Imagen Pendiente<br/>de Aprobación</span>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.overlay}>
                                    <button 
                                        className={styles.downloadBtn}
                                        onClick={() => setImportingSave(save)}
                                    >
                                        📥 Descargar Save
                                    </button>
                                </div>
                            </div>
                            <div className={styles.cardInfo}>
                                <h4>{save.title}</h4>
                                <p className={styles.author}>Por {save.userName}</p>
                                {save.userMessage && <p className={styles.userMsg}>"{save.userMessage}"</p>}
                                <p className={styles.desc}>{save.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {importingSave && (
                <ImportSaveModal 
                    saveInfo={importingSave} 
                    onClose={() => setImportingSave(null)} 
                />
            )}
        </div>
    );
}
