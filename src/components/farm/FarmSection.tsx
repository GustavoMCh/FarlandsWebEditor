'use client';

import { useState } from 'react';
import { useSaveData } from '../utils/useSaveData';
import WateredCrops from './WateredCrops';
import ChestSection from '../inventory/ChestSection';
import { SlotData } from '@/types/types';

const FARM_LEVELS = [1, 2, 3, 4];

export default function FarmSection() {
  const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  if (!savedData || !currentSlot) return null;

  const farmName = currentSlot.farmName || '';
  const currentLevel = Math.min(Math.max(currentSlot.currentHouseLevel || 1, 1), 4);

  // ── Helpers to update save data ──
  const updateSlot = (patch: Partial<SlotData>) => {
    const newSlotData = [...savedData.gameData.slotData];
    newSlotData[currentSlotIndex] = { ...newSlotData[currentSlotIndex], ...patch };
    setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: newSlotData } });
  };

  const handleLevelSelect = (level: number) => updateSlot({ currentHouseLevel: level });

  const startEditing = () => {
    setEditName(farmName);
    setIsEditing(true);
  };

  const saveName = () => {
    updateSlot({ farmName: editName.trim() || farmName });
    setIsEditing(false);
  };

  return (
    <div className="card bg-dark border-primary my-3">
      <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
        <span style={{ fontSize: '22px' }}>🌾</span>
        <h4 className="mb-0">Granja</h4>
      </div>
      <div className="card-body">

        {/* Farm name editor */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-1">Nombre de la granja</label>
          {isEditing ? (
            <div className="d-flex gap-2 align-items-center">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setIsEditing(false); }}
                className="form-control bg-dark text-white border-primary"
                style={{ maxWidth: '300px', fontSize: '1.1rem' }}
                autoFocus
              />
              <button className="btn btn-success btn-sm" onClick={saveName}>✅ Guardar</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setIsEditing(false)}>✕</button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <h3 className="mb-0 text-white">{farmName || <span className="text-muted fst-italic">Sin nombre</span>}</h3>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={startEditing}
                title="Editar nombre"
              >✏️ Editar</button>
            </div>
          )}
        </div>

        {/* Level selector */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-2">Nivel de la casa / granja</label>
          <div className="d-flex gap-3 flex-wrap">
            {FARM_LEVELS.map(level => {
              const isSelected = level === currentLevel;
              return (
                <div
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  title={`Nivel ${level}`}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: isSelected ? '3px solid #0d6efd' : '3px solid #495057',
                    boxShadow: isSelected ? '0 0 10px 2px rgba(13,110,253,0.5)' : undefined,
                    padding: '6px',
                    background: isSelected ? 'rgba(13,110,253,0.15)' : 'rgba(255,255,255,0.05)',
                    transition: 'all 0.15s',
                    textAlign: 'center' as const,
                    minWidth: '90px',
                  }}
                >
                  <img
                    src={`/static/Farm/${level}.png`}
                    alt={`Nivel ${level}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      imageRendering: 'pixelated',
                      filter: isSelected ? 'none' : 'brightness(0.6)',
                      transition: 'filter 0.15s',
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div style={{
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 400,
                    color: isSelected ? '#4dabf7' : '#adb5bd',
                    marginTop: '4px',
                  }}>
                    Nivel {level}
                    {isSelected && <span className="ms-1">✔</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <small className="text-muted mt-2 d-block">Haz clic en un nivel para cambiarlo.</small>
        </div>

        {/* Crops */}
        <div className="mt-3">
          <WateredCrops />
        </div>

        {/* Chests */}
        <ChestSection />

      </div>
    </div>
  );
}