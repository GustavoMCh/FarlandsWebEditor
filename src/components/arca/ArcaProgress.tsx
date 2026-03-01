'use client';

import { useEffect, useRef } from 'react';
import { useSaveData } from '../utils/useSaveData';

export default function ArcaProgress() {
  const { currentSlot } = useSaveData();
  const arcaProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentSlot || !arcaProgressRef.current) return;

    const progressPercent = (currentSlot.arcaCurrentProgress * 100).toFixed(1);
    const level = currentSlot.arcaCurrentLevel;

    arcaProgressRef.current.innerHTML = `
      <p><strong>Nivel ARCA:</strong> ${level} (${progressPercent}%)</p>
      <div class="progress" style="height: 20px;">
        <div class="progress-bar bg-success" role="progressbar" style="width: ${progressPercent}%" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `;
  }, [currentSlot]);

  // Maneja el caso de que no haya slot activo
  if (!currentSlot) {
    return (
      <div className="card bg-dark border-primary my-3">
        <div className="card-body">
          <h3 className="text-primary">📊 Progreso de ARCA</h3>
          <p>Selecciona una partida para ver el progreso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-dark border-primary my-3">
      <div className="card-body">
        <h3 className="text-primary">📊 Progreso de ARCA</h3>
        <div ref={arcaProgressRef} id="arcaProgress" className="mb-3"></div>
      </div>
    </div>
  );
}