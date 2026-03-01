'use client';

import React from 'react';

import { ItemSlot } from '@/types/types';
import InventorySlot from './InventorySlot';


interface InventoryGridProps {
  items: ItemSlot[];
  inventoryType: 'player' | 'ship' | 'chest';
  title?: string;
  chestIndex?: number;
}

export const InventoryGrid = ({ items, inventoryType, title, chestIndex }: InventoryGridProps) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      {title && (
        <h3 style={{
          fontFamily: 'LanaPixel, Arial, sans-serif',
          fontSize: '18px',
          color: '#ecf0f1',
          marginBottom: '10px'
        }}>
          {title}
        </h3>
      )}
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
          position: 'relative', // ✅ Necesario para que el menú contextual se posicione correctamente
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