'use client';

import { useState } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { InventoryGrid } from '../inventory/InventoryGrid';

const CHARACTERS = [
  { id: 0, img: '/static/UI/personaje_0.png', label: 'Personaje A' },
  { id: 1, img: '/static/UI/personaje_1.png', label: 'Personaje B' },
];

export default function PlayerSection() {
  const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  if (!savedData || !currentSlot) return null;

  const playerName = currentSlot.playerName || '';
  const selectedChar = currentSlot.selectedChar ?? 0;

  const updateSlot = (patch: Record<string, any>) => {
    const newSlotData = [...savedData.gameData.slotData];
    newSlotData[currentSlotIndex] = { ...newSlotData[currentSlotIndex], ...patch };
    setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: newSlotData } });
  };

  const startEditing = () => { setEditName(playerName); setIsEditing(true); };
  const saveName = () => { updateSlot({ playerName: editName.trim() || playerName }); setIsEditing(false); };

  return (
    <div className="card bg-dark border-primary w-100 my-3">
      <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
        <img
          src={CHARACTERS[selectedChar]?.img ?? CHARACTERS[0].img}
          alt="Personaje"
          width={32}
          height={32}
          style={{ imageRendering: 'pixelated', borderRadius: '4px' }}
        />
        <h4 className="mb-0">Jugador</h4>
      </div>
      <div className="card-body">

        {/* Player name editor */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-1">Nombre del jugador</label>
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
              <h3 className="mb-0 text-white">{playerName || <span className="text-muted fst-italic">Sin nombre</span>}</h3>
              <button className="btn btn-outline-primary btn-sm" onClick={startEditing} title="Editar nombre">✏️ Editar</button>
            </div>
          )}
        </div>

        {/* Character selector */}
        <div className="mb-4">
          <label className="form-label text-muted small mb-2">Personaje</label>
          <div className="d-flex gap-3 flex-wrap">
            {CHARACTERS.map((ch) => {
              const isSelected = selectedChar === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => updateSlot({ selectedChar: ch.id })}
                  title={ch.label}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '10px',
                    border: isSelected ? '3px solid #0d6efd' : '3px solid #495057',
                    boxShadow: isSelected ? '0 0 10px 2px rgba(13,110,253,0.5)' : undefined,
                    padding: '8px 14px',
                    background: isSelected ? 'rgba(13,110,253,0.15)' : 'rgba(255,255,255,0.05)',
                    transition: 'all 0.15s',
                    textAlign: 'center' as const,
                  }}
                >
                  <img
                    src={ch.img}
                    alt={ch.label}
                    width={48}
                    height={48}
                    style={{
                      imageRendering: 'pixelated',
                      filter: isSelected ? 'none' : 'brightness(0.5)',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: isSelected ? '#4dabf7' : '#adb5bd', marginTop: '4px' }}>
                    {ch.label}{isSelected && ' ✔'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory */}
        <InventoryGrid
          items={currentSlot.inventorySaveItems || []}
          inventoryType="player"
          title="Inventario del Jugador"
        />
      </div>
    </div>
  );
}