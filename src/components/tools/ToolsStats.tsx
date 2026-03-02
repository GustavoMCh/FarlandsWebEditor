'use client';

import { useState } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { SlotData } from '@/types/types';

const toolConfig: Record<string, { ids: number[]; icon: string; key: keyof SlotData; slot: number }> = {
  'Hacha': { ids: [1, 240, 241, 242, 243], icon: '🪓', key: 'hatchetLevel', slot: 0 },
  'Azada': { ids: [2, 248, 249, 250, 251], icon: '⛏️', key: 'hoeLevel', slot: 1 },
  'Pico': { ids: [3, 244, 245, 246, 247], icon: '⛏️', key: 'pickaxeLevel', slot: 2 },
  'Hoz': { ids: [4, 252, 253, 254, 255], icon: '🌾', key: 'sickleLevel', slot: 3 },
  'Regadera': { ids: [22, 256, 257, 258, 259], icon: '💧', key: 'wateringCanLevel', slot: 4 },
  'Caña': { ids: [5, 378, 379], icon: '🎣', key: 'cañaLevel' as keyof SlotData, slot: 5 },
  'Red': { ids: [6, 380, 381], icon: '🦋', key: 'redLevel' as keyof SlotData, slot: 6 },
};

function getToolLevel(toolName: string, currentSlot: SlotData): { level: number; slotIdx: number } {
  const { ids, key, slot: fallbackSlot } = toolConfig[toolName];
  // Search full inventory first
  const inv = currentSlot.inventorySaveItems || [];
  for (let i = 0; i < inv.length; i++) {
    const idx = ids.indexOf(inv[i]?.itemID ?? -1);
    if (idx !== -1) return { level: idx, slotIdx: i };
  }
  const levelVal = Number((currentSlot as any)[key] ?? 0);
  return { level: Math.min(levelVal, ids.length - 1), slotIdx: fallbackSlot };
}

export default function ToolsStats({ onOpenToolGuide }: { onOpenToolGuide: (toolName: string) => void }) {
  const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();

  if (!savedData || !currentSlot) return null;

  const updateSlot = (patch: Partial<SlotData>) => {
    const newSlotData = [...savedData.gameData.slotData];
    newSlotData[currentSlotIndex] = { ...newSlotData[currentSlotIndex], ...patch };
    setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: newSlotData } });
  };

  const handleLevelSelect = (toolName: string, levels: number[], targetLevel: number, slotIdx: number, key: keyof SlotData) => {
    const nextItemId = levels[targetLevel];
    const newInventory = [...(currentSlot.inventorySaveItems || [])];
    // Update the item in inventory
    if (newInventory[slotIdx]) {
      newInventory[slotIdx] = { ...newInventory[slotIdx], itemID: nextItemId, isEmpty: nextItemId === 0 };
    } else {
      newInventory[slotIdx] = { itemID: nextItemId, amount: 1, isEmpty: false };
    }
    updateSlot({ [key]: targetLevel, inventorySaveItems: newInventory } as any);
  };

  return (
    <div className="card bg-dark border-success my-3">
      <div className="card-header bg-success text-white d-flex align-items-center gap-2">
        <span style={{ fontSize: '22px' }}>🛠️</span>
        <h4 className="mb-0">Herramientas Niveladas</h4>
        <small className="ms-auto text-white opacity-75">Haz clic en ℹ️ de cada herramienta para ver su guía</small>
      </div>
      <div className="card-body">
        <div className="d-flex flex-wrap gap-4">
          {Object.entries(toolConfig).map(([toolName, { ids, icon, key, slot: fallbackSlot }]) => {
            const { level: currentLevel, slotIdx } = getToolLevel(toolName, currentSlot);

            return (
              <div key={toolName} style={{ minWidth: '120px' }}>
                <div className="text-center mb-1">
                  <span className="text-muted small">{icon} <strong className="text-white">{toolName}</strong></span>
                  <br />
                  <button
                    className="btn btn-outline-info btn-sm py-0 mt-1"
                    style={{ fontSize: '10px' }}
                    onClick={(e) => { e.stopPropagation(); onOpenToolGuide(toolName); }}
                    title={`Ver guía: ${toolName}`}
                  >📖 Guía</button>
                </div>
                <div className="d-flex gap-1 justify-content-center flex-wrap">
                  {ids.map((itemId, levelIdx) => {
                    const isSelected = levelIdx === currentLevel;
                    return (
                      <div
                        key={levelIdx}
                        onClick={() => handleLevelSelect(toolName, ids, levelIdx, slotIdx, key)}
                        title={`${toolName} — Nivel ${levelIdx}`}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #198754' : '2px solid #495057',
                          boxShadow: isSelected ? '0 0 8px 2px rgba(25,135,84,0.5)' : undefined,
                          padding: '4px',
                          background: isSelected ? 'rgba(25,135,84,0.2)' : 'rgba(255,255,255,0.04)',
                          transition: 'all 0.15s',
                          textAlign: 'center' as const,
                        }}
                      >
                        <img
                          src={`/static/items/Item_${itemId}.png`}
                          alt={`${toolName} Nv${levelIdx}`}
                          width={40}
                          height={40}
                          style={{
                            imageRendering: 'pixelated',
                            filter: isSelected ? 'none' : 'brightness(0.5)',
                          }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/static/items/unknown.png'; }}
                        />
                        <div style={{ fontSize: '9px', color: isSelected ? '#51cf66' : '#6c757d', marginTop: '2px' }}>
                          Nv {levelIdx}{isSelected && ' ✔'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <small className="text-muted mt-3 d-block">Haz clic en un nivel para cambiarlo.</small>
      </div>
    </div>
  );
}