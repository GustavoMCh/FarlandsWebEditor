'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPanel() {
    const { profile } = useAuth();
    const [pendingSaves, setPendingSaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile?.role !== 'admin') return;

        const q = query(
            collection(db, 'shared_saves'),
            where('approved', '==', false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPendingSaves(docs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [profile]);

    const handleApprove = async (id: string) => {
        const saveRef = doc(db, 'shared_saves', id);
        await updateDoc(saveRef, { approved: true });
    };

    const handleReject = async (id: string) => {
        if (confirm('¿Seguro que quieres borrar este save?')) {
            const saveRef = doc(db, 'shared_saves', id);
            await deleteDoc(saveRef);
        }
    };

    if (profile?.role !== 'admin') return null;

    return (
        <div className="container mt-5 p-4 bg-dark rounded border border-danger">
            <h2 className="text-danger mb-4">🛡️ Panel de Moderación</h2>

            {pendingSaves.length === 0 ? (
                <p className="text-muted">No hay partidas pendientes de revisión.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Screenshot</th>
                                <th>Detalles</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingSaves.map(save => (
                                <tr key={save.id}>
                                    <td style={{ width: '200px' }}>
                                        <img
                                            src={save.screenshotUrl}
                                            alt="Preview"
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '120px' }}
                                        />
                                    </td>
                                    <td>
                                        <h5 className="mb-1">{save.title}</h5>
                                        <p className="small text-muted mb-0">Subido por: {save.userName}</p>
                                        {save.userMessage && <p className="small text-info mb-0">Mensaje: "{save.userMessage}"</p>}
                                        <p className="small">{save.description}</p>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleApprove(save.id)}
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleReject(save.id)}
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
