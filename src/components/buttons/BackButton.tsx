'use client';

import { useSaveData } from '@/components/utils/useSaveData';

export default function BackButton() {
  const { clearSaveData } = useSaveData();

  const handleBack = () => {
    if (confirm("¿Estás seguro? Se perderán todos los cambios no exportados y volverás al selector de partidas.")) {
      clearSaveData(); // ✅ Limpia todo: savedData, localStorage, índices
    }
  };

  return (
    <div className="text-center mb-3">
      <button
        className="btn btn-outline-secondary"
        onClick={handleBack}
      >
        ← Volver al Selector de Partidas
      </button>
    </div>
  );
}