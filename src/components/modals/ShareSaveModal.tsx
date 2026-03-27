'use client';

import { useState, useRef } from 'react';
import { storage, db, auth } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import styles from './ShareSaveModal.module.css';

interface ShareSaveModalProps {
    saveData: any;
    currentSlotIndex: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ShareSaveModal({ saveData, currentSlotIndex, onClose, onSuccess }: ShareSaveModalProps) {
    const { user, profile } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen es demasiado grande (máx 5MB)');
                return;
            }
            setScreenshot(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !screenshot) return;

        setUploading(true);
        setProgress(0);

        try {
            const timestamp = Date.now();

            // 1. Subir captura
            const screenshotRef = ref(storage, `screenshots/${user.uid}/${timestamp}_${screenshot.name}`);
            const screenshotUpload = uploadBytesResumable(screenshotRef, screenshot);

            // 2. Subir save (solo con el slot seleccionado para proteger la privacidad)
            const isolatedSaveData = JSON.parse(JSON.stringify(saveData));
            if (isolatedSaveData?.gameData?.slotData) {
                isolatedSaveData.gameData.slotData = isolatedSaveData.gameData.slotData.map((slot: any, index: number) => {
                    if (index === currentSlotIndex) {
                        return slot;
                    }
                    return { hasData: false };
                });
                // Asegurarnos de que el currentSlot apunte al que dejamos activo
                isolatedSaveData.gameData.currentSlot = currentSlotIndex;
            }

            const saveBlob = new Blob([JSON.stringify(isolatedSaveData)], { type: 'application/json' });
            const saveRef = ref(storage, `saves/${user.uid}/${timestamp}_gamedata.dat`);
            const saveUpload = uploadBytesResumable(saveRef, saveBlob);

            // Monitorear progreso (simplificado)
            screenshotUpload.on('state_changed', (snapshot) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            });

            // Esperar a que terminen ambos
            await Promise.all([screenshotUpload, saveUpload]);

            const screenshotUrl = await getDownloadURL(screenshotRef);
            const saveUrl = await getDownloadURL(saveRef);

            // 3. Crear metadatos en Firestore
            await addDoc(collection(db, 'shared_saves'), {
                userId: user.uid,
                userName: user.displayName || user.email?.split('@')[0],
                title,
                description,
                screenshotUrl,
                saveUrl,
                userMessage: profile?.publicMessage || '',
                createdAt: serverTimestamp(),
                approved: false, // Por defecto, oculto hasta aprobación
                likes: 0,
                downloads: 0
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al compartir la partida');
            setUploading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>Compartir Partida</h2>
                <p className={styles.description}>
                    Comparte tu mundo con otros pilotos. Tu captura pasará por una revisión de seguridad antes de ser pública.
                </p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form className={styles.form} onSubmit={handleShare}>
                    <div className="mb-3">
                        <label className="form-label text-xs">Título de tu Mundo</label>
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Ej. Mi Galaxia de Diamantes"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-xs">Descripción (opcional)</label>
                        <textarea
                            className="form-control bg-dark text-white border-secondary"
                            placeholder="Cuéntanos qué tiene de especial este save..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div
                        className={styles.imageUploadArea}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="d-none"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                        ) : (
                            <div>
                                <div className={styles.uploadIcon}>📸</div>
                                <strong>Haz clic para subir una captura de pantalla</strong>
                                <p className="small text-muted mb-0">Recomendado 1920x1080 (PNG/JPG)</p>
                            </div>
                        )}
                    </div>

                    {uploading && (
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelButton} onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.shareButton}
                            disabled={uploading || !screenshot || !title}
                        >
                            {uploading ? 'Subiendo...' : '🚀 Compartir con la Comunidad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
