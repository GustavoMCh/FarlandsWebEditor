'use client';

import { useSaveData } from '@/components/utils/useSaveData';
import { useEffect } from 'react';

export default function ClearAllButton() {
  const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();

  const handleClear = () => {
    if (!savedData) {
      alert("❌ Primero carga un archivo.");
      return;
    }

    if (!savedData?.gameData?.slotData || currentSlotIndex >= savedData.gameData.slotData.length) {
      alert("❌ Partida no válida.");
      return;
    }

    if (!currentSlot) {
      alert("❌ Selecciona una partida.");
      return;
    }

    const isTool = (id: number) => {
      // Herramientas básicas: Hacha(1), Azada(2), Pico(3), Hoz(4), Caña(5), Red(6), Regadera(22)
      // Herramientas mejoradas (Celestio, Plata, Cronio, Mitrilo): IDs 240 al 267
      const toolIds = [1, 2, 3, 4, 5, 6, 22];
      return toolIds.includes(id) || (id >= 240 && id <= 267);
    };
    let clearedCount = 0;

    // 1. Inventario del jugador (Todos los slots, protegiendo herramientas)
    currentSlot.inventorySaveItems = currentSlot.inventorySaveItems.map(item => {
      if (item.itemID !== 0 && !isTool(item.itemID)) {
        clearedCount++;
        return { itemID: 0, amount: 0, isEmpty: true };
      }
      return item;
    });

    // 2. Inventario de la nave (Protegiendo herramientas)
    currentSlot.shipInventorySaveItems = currentSlot.shipInventorySaveItems.map(item => {
      if (item.itemID !== 0 && !isTool(item.itemID)) {
        clearedCount++;
        return { itemID: 0, amount: 0, isEmpty: true };
      }
      return item;
    });

    // 3. Cofres (Protegiendo herramientas)
    currentSlot.chestSlots.forEach(chest => {
      for (let j = 0; j < chest.itemsID.length; j++) {
        const itemID = chest.itemsID[j];
        if (itemID !== 0 && !isTool(itemID)) {
          chest.itemsID[j] = 0;
          chest.itemsAmount[j] = 0;
          clearedCount++;
        }
      }
    });

    if (clearedCount === 0) {
      alert("✅ No había ítems que vaciar (las herramientas y slots vacíos se han respetado).");
      return;
    }

    // ✅ Guarda el cambio en el estado global
    setSavedData({ ...savedData });

    alert(`✅ Se han vaciado ${clearedCount} ítems. Las herramientas nivelables han sido protegidas en todas sus posiciones.`);
  };

  return (
    <button
      className="btn btn-danger btn-lg w-100"
      onClick={handleClear}
    >
      🧹 Vaciar Todo (Inventario, Nave y Cofres)
    </button>
  );
}