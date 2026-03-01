'use client';

import { useEffect, useRef, useState } from 'react';
import { useSpriteSheet } from '@/lib/useSpriteSheet';
import { SlotData } from '@/types/types';

interface SlotItemProps {
  slot: SlotData;
  index: number;
  onClick: () => void;
}

export default function SlotItem({ slot, index, onClick }: SlotItemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const slotImage = useSpriteSheet({
    src: '/static/Tileset_Menu.png',
    x: 145,
    y: 0,
    width: 190,
    height: 50,
  });

  const slotImageSelect = useSpriteSheet({
    src: '/static/Tileset_Menu.png',
    x: 145,
    y: 128,
    width: 190,
    height: 50,
  });

  // Dibuja el fondo normal
  useEffect(() => {
    if (!canvasRef.current || slotImage.loading || slotImage.error) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 380;
    canvas.height = 100;
    slotImage.drawOnCanvas(canvas);
  }, [slotImage.loading, slotImage.image]);

  // Dibuja el fondo de hover cuando esté listo y activo
  useEffect(() => {
    if (
      !hoverCanvasRef.current ||
      slotImageSelect.loading ||
      slotImageSelect.error ||
      !isHovered
    ) return;

    const canvas = hoverCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 380;
    canvas.height = 100;
    slotImageSelect.drawOnCanvas(canvas);
  }, [slotImageSelect.loading, slotImageSelect.image, isHovered]);

  const image = slot.selectedChar ?
    "/static/UI/personaje_1.png" :
    "/static/UI/personaje_0.png";

  const image_seasson = "/static/UI/seasson_" + slot.currentSeason + ".png";

  return (
    <div
      style={{ width: '380px', height: '100px', fontFamily: '"LanaPixel", sans-serif' }}
      className="position-relative cursor-pointer d-block mx-auto"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo normal */}
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0"
        style={{ zIndex: -2, width: '380px', height: '100px', imageRendering: 'pixelated' }}
      />
      {/* Fondo de hover (solo visible cuando isHovered) */}
      {isHovered && (
        <canvas
          ref={hoverCanvasRef}
          className="position-absolute top-0 start-0"
          style={{ zIndex: -1, width: '380px', height: '100px', imageRendering: 'pixelated' }}
        />
      )}

      {/* Avatar Container */}
      <div
        className="position-absolute d-flex align-items-center justify-content-center"
        style={{ left: '16px', top: '16px', width: '68px', height: '68px' }}
      >
        <img className="position-absolute w-100 h-100" src="/static/UI/personaje_fondo.png" style={{ imageRendering: 'pixelated' }} />
        <img className="position-absolute" src={image} style={{ width: '80%', height: '80%', imageRendering: 'pixelated', objectFit: 'contain' }} />
      </div>

      {/* Text Container Left */}
      <div className="position-absolute d-flex flex-column justify-content-center align-items-start" style={{ left: '96px', top: '22px', bottom: '22px' }}>
        <div style={{ fontSize: '20px', color: '#1a3b3a', lineHeight: '1.2' }}>{slot.farmName || 'Nueva'}</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#092121', lineHeight: '1.2' }}>{slot.playerName || 'Partida'}</div>
      </div>

      {/* Text Container Right */}
      <div className="position-absolute d-flex flex-column justify-content-center align-items-end" style={{ right: '60px', top: '14px', bottom: '14px' }}>
        <div className="mb-1"><img src={image_seasson} style={{ width: '26px', height: '26px', imageRendering: 'pixelated' }} /></div>
        <div style={{ fontSize: '22px', color: '#092121', display: 'flex', alignItems: 'center', marginTop: '6px' }}>
          {slot.credits.toLocaleString()} <span style={{ fontFamily: 'monospace', marginLeft: '6px', fontSize: '20px', fontWeight: 'bold' }}>C</span>
        </div>
      </div>

      {/* Number Tab */}
      <div className="position-absolute d-flex align-items-center justify-content-center" style={{ right: '6px', top: '16px', width: '24px', height: '34px' }}>
        <span style={{ color: 'white', fontSize: '26px', transform: 'translateY(-2px)' }}>{index + 1}</span>
      </div>

      {/* Delete X Button Placeholder (Visually matching the game) */}
      <div
        className="position-absolute d-flex align-items-center justify-content-center"
        style={{
          right: '-1px',
          top: '56px',
          width: '28px',
          height: '28px',
          backgroundColor: '#c0392b',
          border: '2px solid #8c2419',
          borderRadius: '2px',
          color: 'white',
          fontSize: '18px',
          lineHeight: '1',
          paddingBottom: '2px'
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        title="Borrar partida (Próximamente)"
      >
        x
      </div>
    </div>
  );
}