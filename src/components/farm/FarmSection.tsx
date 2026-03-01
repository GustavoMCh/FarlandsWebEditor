'use client';

import { useState } from 'react';
import { useSaveData } from '../utils/useSaveData';
import WateredCrops from './WateredCrops';
import { SlotData } from '@/types/types';

export default function FarmSection() {
  const { savedData, currentSlotIndex,currentSlot, setSavedData } = useSaveData();
  const [isEditing, setIsEditing] = useState(false);

  if (!savedData || !currentSlot) return null;

  const farmName = currentSlot.farmName || '';
  const currentLevel = currentSlot.currentHouseLevel || 1;
  const validLevel = Math.min(Math.max(currentLevel, 1), 5);

  const handleSaveName = () => {
    if (!savedData) return;
    const newSlotData = [...savedData.slotData];
    newSlotData[currentSlotIndex] = { ...newSlotData[currentSlotIndex], farmName };
    setSavedData({ ...savedData, slotData: newSlotData });
    setIsEditing(false);
  };

  const handleLevelClick = () => {
    if (isEditing) return;
    const nextLevel = (validLevel % 4) + 1;
    const newSlotData = [...savedData.slotData];
    newSlotData[currentSlotIndex] = { ...newSlotData[currentSlotIndex], currentHouseLevel: nextLevel };
    setSavedData({ ...savedData, slotData: newSlotData });
  };

  return (
    <div className="card bg-dark border-primary my-3">
      <div className="card-body">
          <div className="mt-3">
            <WateredCrops />
          </div>
        <div className="d-flex align-items-center cursor-pointer" onClick={handleLevelClick}>
          <img
            src={`/static/Farm/${validLevel}.png`}
            width="48"
            height="48"
            title={`Nivel ${validLevel}`}
            className="me-2"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/static/items/unknown.png';
              img.title = 'Granja desconocida';
            }}
          />
          <div>
            <h3 className="text-primary mb-0">🌾 Granja: {isEditing ? (
              <input
                type="text"
                value={farmName}
                onChange={(e) => setSavedData({ ...savedData, slotData: savedData.slotData.map((s:SlotData, i:number) => i === currentSlotIndex ? { ...s, farmName: e.target.value } : s) })}
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="form-control d-inline w-auto"
                style={{ fontSize: 'inherit' }}
              />
            ) : (
              <span>{farmName}</span>
            )}</h3>
            <small className="text-muted">Nivel <strong>{validLevel}</strong></small>
          </div>
        </div>
      </div>
    </div>
  );
}