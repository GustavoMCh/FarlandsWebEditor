'use client';

import { useState, useEffect } from 'react';
import { useItems } from '@/lib/useItems'; // Hook personalizado

export default function ProgressBar() {
  const { loading, loaded } = useItems(); // Progreso real desde el hook
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading && loaded) {
      // Avanzar al 25%
      setProgress(25);
    }
  }, [loading, loaded]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '24px',
        zIndex: 10000,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#00b894',
        fontWeight: 'bold'
      }}
    >
      <span>
        {progress === 0 ? 'Cargando recursos...' :
         progress < 25 ? 'Cargando lista de ítems...' :
         progress < 35 ? 'Cargando guías de herramientas...' :
         progress < 65 ? 'Cargando guías de temporada...' :
         progress < 85 ? 'Cargando sprites de interfaz...' :
         progress < 95 ? 'Preparando la interfaz...' :
         '¡Listo! Edita tu partida...'}
      </span>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '4px',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #00b894, #00cec9)',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px rgba(0, 184, 148, 0.5)'
        }}
      ></div>
    </div>
  );
}