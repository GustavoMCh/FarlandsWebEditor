'use client';

import { useState } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import styles from './ShareSaveModal.module.css';

interface ImportSaveModalProps {
    saveInfo: any;
    onClose: () => void;
}

export default function ImportSaveModal({ saveInfo, onClose }: ImportSaveModalProps) {
    const { savedData, setSavedData } = useSaveData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImport = async (targetSlot: number) => {
        if (!savedData) return;
        
        if (!confirm(`¿Estás seguro de que deseas sobrescribir el Slot ${targetSlot + 1} de tu partida actual?`)) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(saveInfo.saveUrl);
            const downloadedSave = await res.json();
            
            // Encuentra el slot fuente: el marcado como currentSlot
            const sourceSlotIndex = downloadedSave.gameData?.currentSlot ?? 0;
            const importedSlotData = downloadedSave.gameData?.slotData?.[sourceSlotIndex];

            if (!importedSlotData) {
                throw new Error("No se encontraron datos de partida en este archivo.");
            }

            // Clona e inyecta
            const newSlotDataList = [...savedData.gameData.slotData];
            newSlotDataList[targetSlot] = importedSlotData;

            const newSaveData = {
                ...savedData,
                gameData: {
                    ...savedData.gameData,
                    slotData: newSlotDataList
                }
            };

            // Descargar el fichero combinado
            const jsonStr = JSON.stringify(newSaveData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gamedata_comunidad_${new Date().toISOString().slice(0, 10)}.dat`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Actualizar el editor
            setSavedData(newSaveData);
            
            alert(`✅ La partida de la comunidad se ha fusionado en el Slot ${targetSlot + 1} de tu archivo y se ha descargado.`);
            onClose();
        } catch (err: any) {
             setError(err.message || 'Error al importar partida');
        } finally {
             setLoading(false);
        }
    };

    const handleDownloadRaw = async () => {
        const a = document.createElement('a');
        a.href = saveInfo.saveUrl;
        a.download = `${saveInfo.title.replace(/[^a-z0-9]/gi, '_')}.dat`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>Importar Partida</h2>
                <p className={styles.description}>¿Dónde deseas instalar el mundo <b>{saveInfo.title}</b>?</p>

                {error && <div className="alert alert-danger">{error}</div>}

                {savedData ? (
                    <div className="mb-4">
                        <p className="mb-2 text-white-50 small">Selecciona la ranura de tu <b>gamedata.dat</b> donde quieres guardar este mundo comunitario:</p>
                        <div className="d-flex flex-column gap-2 text-dark">
                            {[0, 1, 2].map(slotIndex => {
                                const localSlot = savedData.gameData.slotData[slotIndex];
                                const name = localSlot?.hasData ? `${localSlot.farmName} (Piloto: ${localSlot.playerName})` : 'Ranura Vacía';
                                return (
                                    <button 
                                        key={slotIndex} 
                                        className="btn btn-primary text-start fw-bold"
                                        onClick={() => handleImport(slotIndex)}
                                        disabled={loading}
                                    >
                                        📥 Slot {slotIndex + 1}: <span className="text-warning fw-normal">{name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-warning mb-4">
                        ⚠️ <b>No tienes un fichero cargado:</b><br/> 
                        Si quieres integrarlo con tus otras partidas, primero sube tu archivo <code>gamedata.dat</code> en el formulario de arriba y luego vuelve aquí para elegir en qué Slot lo quieres.
                    </div>
                )}
                
                <hr style={{borderColor: '#444'}}/>
                <button 
                    className="btn btn-outline-danger w-100"
                    onClick={handleDownloadRaw}
                    disabled={loading}
                >
                    ⬇️ Descarga Directa (Reemplazo total / Archivo nuevo)
                </button>
                
                <button 
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
} 
