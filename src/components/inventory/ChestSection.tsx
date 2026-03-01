'use client';

import { useSaveData } from '@/components/utils/useSaveData';
import { InventoryGrid } from '@/components/inventory/InventoryGrid';
import { ItemSlot, ChestSlot } from '@/types/types';

export default function ChestSection() {
    const { savedData, currentSlot } = useSaveData();

    if (!savedData || !currentSlot || !currentSlot.chestSlots || currentSlot.chestSlots.length === 0) {
        return (
            <div className="card bg-dark border-primary my-3">
                <div className="card-body">
                    <h3 className="text-primary">📦 Cofres de la Granja</h3>
                    <p className="text-muted">No se encontraron cofres en esta partida.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-dark border-primary my-3">
            <div className="card-body">
                <h3 className="text-primary mb-4">📦 Cofres de la Granja</h3>

                {currentSlot.chestSlots.map((chest: ChestSlot, chestIndex: number) => {
                    // Convert parallel arrays (itemsID, itemsAmount) into an array of ItemSlot to feed into InventoryGrid
                    const chestItems: ItemSlot[] = Array.from({ length: 27 }).map((_, slotIndex) => {
                        const itemID = chest.itemsID[slotIndex] || 0;
                        const amount = chest.itemsAmount[slotIndex] || 0;
                        return {
                            itemID,
                            amount,
                            isEmpty: itemID === 0
                        };
                    });

                    return (
                        <div key={chestIndex} className="mb-4">
                            <InventoryGrid
                                items={chestItems}
                                inventoryType="chest"
                                title={`Cofre ${chestIndex + 1} (Mobiliario ${chest.furnitureID})`}
                                chestIndex={chestIndex}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
