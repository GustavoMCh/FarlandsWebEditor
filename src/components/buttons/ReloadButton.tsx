'use client';

import { useSaveData } from '@/components/utils/useSaveData';
import { useEffect } from 'react';

export default function ReloadButton() {
  const { savedData, loadedFromFile, setSavedData } = useSaveData();

  // Solo mostrar si hay datos cargados
  if (!savedData) return null;

  const handleClick = () => {
    if (confirm("¿Estás seguro? Esto descartará la versión guardada en memoria y cargará un archivo gamedata.dat desde tu sistema.")) {
      // Limpiar estado
      localStorage.removeItem('farlandsSaveData');
      localStorage.removeItem('farlandsCurrentSlot');
      
      // Resetear estado global
      setSavedData(null);
      
      // Mostrar selector de archivo
      const fileSelector = document.getElementById('fileSelector');
      const gameSelector = document.getElementById('gameSelector');
      const mainApp = document.getElementById('mainApp');

      if (fileSelector) fileSelector.classList.remove('d-none');
      if (gameSelector) gameSelector.classList.add('d-none');
      if (mainApp) mainApp.classList.add('d-none');

      // Mensaje de estado
      const saveStatusEl = document.getElementById('saveStatus');
      if (saveStatusEl) {
        saveStatusEl.textContent = "✅ Selecciona tu archivo gamedata.dat para cargar.";
        saveStatusEl.style.color = "#00b894";
      }
    }
  };

  return (
    <div className="text-muted mt-2 small">
      <button
        id="reloadFromFileBtn"
        className="btn btn-outline-secondary btn-sm"
        style={{ padding: '2px 8px', fontSize: '0.8rem' }}
        onClick={handleClick}
      >
        🔄 Recargar desde archivo
      </button>
    </div>
  );
}