'use client';

import { useState, useEffect } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { InventoryGrid } from '../inventory/InventoryGrid';

const SHIP_LEVELS = [0, 1, 2, 3, 4];
const ANIMATION_FRAMES = 16;

// Spritesheet: 12 cols × 11 rows × 180×180px per tile
const DISPLAY = 80;
const TILE = 180;
const COLS = 12;
const ROWS = 11;
const BG_W = Math.round(COLS * TILE * (DISPLAY / TILE)); // 960
const BG_H = Math.round(ROWS * TILE * (DISPLAY / TILE)); // 880

function spriteCss(src: string, selected: boolean) {
  return {
    width: `${DISPLAY}px`,
    height: `${DISPLAY}px`,
    backgroundImage: `url(${src})`,
    backgroundSize: `${BG_W}px ${BG_H}px`,
    backgroundPosition: '0 0',
    backgroundRepeat: 'no-repeat' as const,
    imageRendering: 'pixelated' as const,
    borderRadius: '6px',
    filter: selected ? 'none' : 'brightness(0.45)',
    transition: 'filter 0.15s',
    flexShrink: 0,
  };
}

export default function ShipSection() {
  const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % ANIMATION_FRAMES);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!savedData || !currentSlot) return null;

  const activeCells = currentSlot.spaceShipActiveCells ?? 0;
  const availableCells = currentSlot.spaceShipAvailableCells ?? 0;
  const currentLevel = Math.min(Math.max(activeCells, 0), 4);

  const updateSlot = (patch: Record<string, any>) => {
    const newSlotData = [...savedData.gameData.slotData];
    newSlotData[currentSlotIndex] = { ...newSlotData[currentSlotIndex], ...patch };
    setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: newSlotData } });
  };

  const handleLevelSelect = (level: number) => {
    updateSlot({ spaceShipActiveCells: level, spaceShipAvailableCells: Math.max(availableCells, level) });
  };

  return (
    <div className="card bg-dark border-info my-3">
      <div className="card-header bg-info text-dark d-flex align-items-center gap-2">
        <img
          src={`/static/ship/animate/5 nave 48x48_${frameIndex}.png`}
          alt="Ship Animation"
          width={32}
          height={32}
          style={{ imageRendering: 'pixelated' }}
        />
        <h4 className="mb-0">Nave Espacial</h4>
        <span className="ms-auto badge bg-dark text-info">
          Celdas: {activeCells} / {availableCells}
        </span>
      </div>
      <div className="card-body">

        {/* Ship level selector */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-2">Nivel de la cabina</label>
          <div className="d-flex gap-3 flex-wrap">
            {SHIP_LEVELS.map(level => {
              const isSelected = level === currentLevel;
              return (
                <div
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  title={`Nivel ${level}`}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: isSelected ? '3px solid #0dcaf0' : '3px solid #495057',
                    boxShadow: isSelected ? '0 0 10px 2px rgba(13,202,240,0.4)' : undefined,
                    padding: '6px',
                    background: isSelected ? 'rgba(13,202,240,0.12)' : 'rgba(255,255,255,0.04)',
                    transition: 'all 0.15s',
                    textAlign: 'center' as const,
                  }}
                >
                  <div style={{ position: 'relative', width: `${DISPLAY}px`, height: `${DISPLAY}px` }}>
                    {/* Reactor — base layer */}
                    <div style={{ ...spriteCss(`/static/ship/reactor_${level}.png`, isSelected), position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
                    {/* Cabin — on top */}
                    <div style={{ ...spriteCss(`/static/ship/cabin_${level}.png`, isSelected), position: 'absolute', top: 0, left: 0, zIndex: 2 }} />
                  </div>
                  <div style={{ fontSize: '11px', color: isSelected ? '#4dd9ea' : '#6c757d', marginTop: '4px' }}>
                    Nivel {level}{isSelected && ' ✔'}
                  </div>
                </div>
              );
            })}
          </div>
          <small className="text-muted mt-2 d-block">Haz clic en un nivel para cambiarlo.</small>
        </div>

        {/* Ship inventory */}
        <InventoryGrid
          items={currentSlot.shipInventorySaveItems || []}
          inventoryType="ship"
          title="Inventario de la Nave"
        />
      </div>
    </div>
  );
}