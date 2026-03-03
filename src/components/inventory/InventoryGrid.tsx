'use client';

import React from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { ItemSlot, SlotData } from '@/types/types';
import InventorySlot from './InventorySlot';

interface InventoryGridProps {
  items: ItemSlot[];
  inventoryType: 'player' | 'ship' | 'chest';
  title?: string;
  chestIndex?: number;
}

export const InventoryGrid = ({ items, inventoryType, title, chestIndex }: InventoryGridProps) => {
  const { savedData, setSavedData, currentSlotIndex, currentSlot } = useSaveData();

  const handleClear = () => {
    if (!savedData || !currentSlot) return;

    const isTool = (id: number) => {
      const toolIds = [1, 2, 3, 4, 5, 6, 22];
      return toolIds.includes(id) || (id >= 240 && id <= 267);
    };

    const confirmClear = window.confirm(`¿Seguro que quieres vaciar "${title || inventoryType}"?\n\nLas herramientas nivelables no serán eliminadas.`);
    if (!confirmClear) return;

    const newSlotData = [...savedData.gameData.slotData];
    const newSlot = { ...currentSlot };

    let count = 0;

    if (inventoryType === 'player') {
      newSlot.inventorySaveItems = newSlot.inventorySaveItems.map(item => {
        if (item.itemID !== 0 && !isTool(item.itemID)) {
          count++;
          return { itemID: 0, amount: 0, isEmpty: true };
        }
        return item;
      });
    } else if (inventoryType === 'ship') {
      newSlot.shipInventorySaveItems = newSlot.shipInventorySaveItems.map(item => {
        if (item.itemID !== 0 && !isTool(item.itemID)) {
          count++;
          return { itemID: 0, amount: 0, isEmpty: true };
        }
        return item;
      });
    } else if (inventoryType === 'chest' && chestIndex !== undefined) {
      const chest = newSlot.chestSlots[chestIndex];
      if (chest) {
        for (let i = 0; i < chest.itemsID.length; i++) {
          const id = chest.itemsID[i];
          if (id !== 0 && !isTool(id)) {
            chest.itemsID[i] = 0;
            chest.itemsAmount[i] = 0;
            count++;
          }
        }
      }
    }

    newSlotData[currentSlotIndex] = newSlot;
    setSavedData({
      ...savedData,
      gameData: { ...savedData.gameData, slotData: newSlotData }
    });

    alert(count > 0 ? `Se han vaciado ${count} espacios.` : "No había nada para vaciar.");
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        {title && (
          <h3 style={{
            fontFamily: 'LanaPixel, Arial, sans-serif',
            fontSize: '18px',
            color: '#ecf0f1',
            margin: 0
          }}>
            {title}
          </h3>
        )}
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleClear}
          style={{ fontSize: '10px', height: '24px', padding: '0 8px', borderRadius: '4px' }}
        >
          🧹 Vaciar este bloque
        </button>
      </div>
      <div
        className='rounded'
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          justifyContent: 'center',
          gap: '4px',
          padding: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '16px',
          position: 'relative',
        }}
      >
        {items.map((slot, index) => {
          const itemID = slot?.itemID || 0;
          const amount = slot?.amount || 0;
          const isEmpty = slot?.isEmpty ?? true;

          return (
            <InventorySlot
              key={`${inventoryType}-${index}`}
              itemID={itemID}
              amount={amount}
              isEmpty={isEmpty}
              slotIndex={index}
              inventoryType={inventoryType}
              chestIndex={chestIndex}
            />
          );
        })}
      </div>
    </div>
  );
};
