'use client';

import { useState } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';

import { width } from '@fortawesome/free-solid-svg-icons/fa0';
import { InventoryGrid } from '../inventory/InventoryGrid';

export default function PlayerSection() {
  const { savedData, currentSlotIndex,currentSlot, setSavedData } = useSaveData();
  const [isEditing, setIsEditing] = useState(false);

  if (!savedData) return null;

if (!currentSlot) return <div>Selecciona una partida</div>;
  const playerName = currentSlot.playerName;



  const handleSaveName = () => {
    if (!savedData) return;
    const newSlot = { ...currentSlot, playerName: playerName };
    setSavedData({
      ...savedData,
      gameData: {
        ...savedData.gameData,
        slotData: [
          ...savedData.gameData.slotData.slice(0, currentSlotIndex),
          newSlot,
          ...savedData.gameData.slotData.slice(currentSlotIndex + 1),
        ],
      },
    });
    setIsEditing(false);
  };


  const image = currentSlot.selectedChar ?
    "/static/UI/personaje_1.png" :
    "/static/UI/personaje_0.png" ;

  return (
    <div className="card bg-dark border-primary w-100"  >
      <div className="card-body">
        <h3 className="text-primary cursor-pointer" onClick={() => setIsEditing(!isEditing)}>

            <img src={image}></img> &nbsp;
           Jugador: {isEditing ? (
            <input
              type="text"
              value={playerName}
              onChange={(e) => setSavedData({ ...savedData, gameData: { ...savedData.gameData, slotData: [...savedData.gameData.slotData] } })}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="form-control d-inline w-auto"
              style={{ fontSize: 'inherit' }}
            />
          ) : (
            <span>{playerName}</span>
          )}
          <span className="fa fa-pencil" style={{ fontSize: 'small', marginLeft: 'auto', cursor: 'pointer' }}></span>
        </h3>
        <div className="mt-2">
<InventoryGrid
  items={currentSlot?.inventorySaveItems || []}
  inventoryType="player"
  title="Inventario del Jugador"
/>
        </div>
      </div>
    </div>
  );
}