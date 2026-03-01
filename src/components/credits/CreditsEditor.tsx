'use client';

import { useState, useEffect } from 'react';
import { useSaveData } from '../utils/useSaveData';

export default function CreditsEditor() {
  const { savedData, currentSlotIndex,currentSlot, setSavedData } = useSaveData();
  const [credits, setCredits] = useState<string>('');

  const currentCredits = currentSlot?.credits || 0;

  useEffect(() => {
    setCredits(currentCredits.toString());
  }, [currentCredits]);

  if (!savedData ) return null;





  const handleUpdate = () => {
    const newCredits = parseInt(credits) || 0;
    const newSlotData = [...savedData.slotData];
    newSlotData[currentSlotIndex].acumulatedCredits  =  typeof newSlotData[currentSlotIndex].acumulatedCredits  === 'undefined' ? newCredits :   
    newSlotData[currentSlotIndex].acumulatedCredits > newCredits ?  
    newSlotData[currentSlotIndex].acumulatedCredits : newCredits; 

    newSlotData[currentSlotIndex] = {
      ...newSlotData[currentSlotIndex],
      credits: newCredits,
      acumulatedCredits: newCredits + (newSlotData[currentSlotIndex].acumulatedCredits - newSlotData[currentSlotIndex].credits)
    };

    setSavedData({
      ...savedData,
      slotData: newSlotData,
    });
  };

  return (
    <div className="card bg-dark border-primary my-3">
      <div className="card-body">
        <div className="input-group mb-3">
          <span className="input-group-text bg-success"><h3 className="text-white">💰 Créditos:</h3></span>
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="form-control"
            min="0"
          />
          <button className="btn btn-success" onClick={handleUpdate}>Actualizar</button>
        </div>
      </div>
    </div>
  );
}