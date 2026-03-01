'use client';

import { useState } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { InventoryGrid } from '../inventory/InventoryGrid';

export default function ShipSection() {
  const { savedData, currentSlot } = useSaveData();
  const [isEditing, setIsEditing] = useState(false);

  if (!savedData || !currentSlot) return null;

  
  const activeCells = currentSlot?.spaceShipActiveCells || 0;
  const availableCells = currentSlot?.spaceShipAvailableCells || 0;

  return (
    <div className="card bg-dark border-primary my-3">
      <div className="card-body">
        <h3 className="text-primary cursor-pointer" onClick={() => setIsEditing(!isEditing)}>
          🚀 Nivel de la Nave: {activeCells}/{availableCells}
        </h3>
        <div className="mt-2">
        <InventoryGrid
          items={currentSlot?.shipInventorySaveItems || []}
          inventoryType="ship"
          title="Inventario de la Nave"
        />
        </div>
      </div>
    </div>
  );
}