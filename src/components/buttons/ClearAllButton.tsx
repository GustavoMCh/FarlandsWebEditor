'use client';

import { useSaveData } from '@/components/utils/useSaveData';
import { useEffect } from 'react';

export default function ClearAllButton() {
  const { savedData, currentSlotIndex,currentSlot, setSavedData } = useSaveData();

  const handleClear = () => {
    if (!savedData) {
      alert("❌ Primero carga un archivo.");
      return;
    }

    if (!savedData?.slotData || currentSlotIndex >= savedData.slotData.length) {
      alert("❌ Partida no válida.");
      return;
    }

    if (!currentSlot) return <div>Selecciona una partida</div>;
    
    let clearedCount = 0;

    // Inventario principal (slots 9-26)
    for (let i = 9; i < currentSlot.inventorySaveItems.length; i++) {
      if (currentSlot.inventorySaveItems[i].itemID !== 0) {
        currentSlot.inventorySaveItems[i] = { itemID: 0, amount: 0, isEmpty: true };
        clearedCount++;
      }
    }

    // Inventario de la nave
    for (let i = 0; i < currentSlot.shipInventorySaveItems.length; i++) {
      if (currentSlot.shipInventorySaveItems[i].itemID !== 0) {
        currentSlot.shipInventorySaveItems[i] = { itemID: 0, amount: 0, isEmpty: true };
        clearedCount++;
      }
    }

    // Cofres
    for (let i = 0; i < currentSlot.chestSlots.length; i++) {
      const chest = currentSlot.chestSlots[i];
      for (let j = 0; j < chest.itemsID.length; j++) {
        if (chest.itemsID[j] !== 0) {
          chest.itemsID[j] = 0;
          chest.itemsAmount[j] = 0;
          clearedCount++;
        }
      }
    }

    if (clearedCount === 0) {
      alert("✅ No había ítems que vaciar (todo ya estaba vacío o en los 9 primeros).");
      return;
    }

    // ✅ Guarda el cambio en el estado global
    setSavedData({ ...savedData });

    alert(`✅ Vacíados ${clearedCount} ítems en inventario (desde slot 9), nave y cofres.`);
  };

  return (
    <button
      className="btn btn-danger btn-lg"
      onClick={handleClear}
    >
      🧹 Vaciar Inventario principal, nave y Cofres
    </button>
  );
}