'use client';

import { useEffect, useRef } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';
import { SlotData } from '@/types/types';


// Mapeo de herramientas a sus IDs por nivel
const toolLevels = {
  "Hacha": [1, 240, 241, 242, 243],
  "Azada": [2, 248, 249, 250, 251],
  "Pico": [3, 244, 245, 246, 247],
  "Hoz": [4, 252, 253, 254, 255],
  "Regadera": [22, 256, 257, 258, 259],
  "Caña": [5, 378, 379],
  "Red": [6, 380, 381]
};

export default function ToolsStats({ onOpenToolGuide }: { onOpenToolGuide: (toolName: string) => void }) {
  const { savedData, currentSlotIndex, currentSlot, setSavedData } = useSaveData();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!savedData || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = ''; // Limpieza completa


    Object.keys(toolLevels).forEach(toolName => {
      const toolIds = toolLevels[toolName as keyof typeof toolLevels];

      const toolKeyMap: Record<string, keyof SlotData> = {
        "Hacha": "hatchetLevel",
        "Azada": "hoeLevel",
        "Pico": "pickaxeLevel",
        "Hoz": "sickleLevel",
        "Regadera": "wateringCanLevel",
        "Caña": "cañaLevel" as keyof SlotData, // Asumiendo que existe o adaptarlo si hay otro nombre en json (fishingRod?)
        "Red": "redLevel" as keyof SlotData
      };

      const levelKey = toolKeyMap[toolName];

      const toolSlotMap: Record<string, number> = {
        "Hacha": 0,
        "Azada": 1,
        "Pico": 2,
        "Hoz": 3,
        "Regadera": 4,
        "Caña": 5,
        "Red": 6
      };

      if (!currentSlot) return null;

      const fallbackSlotIndex = toolSlotMap[toolName];
      // Intentar obtener el nivel buscando en TODO el inventario del jugador
      let currentLevelFromInv = -1;
      let actualSlotIndex = fallbackSlotIndex;

      if (currentSlot.inventorySaveItems) {
        for (let i = 0; i < currentSlot.inventorySaveItems.length; i++) {
          const item = currentSlot.inventorySaveItems[i];
          if (item && item.itemID > 0) {
            const idx = toolIds.indexOf(item.itemID);
            if (idx !== -1) {
              currentLevelFromInv = idx;
              actualSlotIndex = i;
              break;
            }
          }
        }
      }

      let currentLevel: any = currentSlot?.[levelKey] || 0;
      if (currentLevelFromInv !== -1) {
        currentLevel = currentLevelFromInv; // El inventario manda
      }

      if (currentLevel >= toolIds.length) currentLevel = 0; // Protección
      const currentItemId = toolIds[currentLevel];

      // Crear tarjeta con document.createElement
      const $card = document.createElement('div');
      $card.className = 'col card text-center tool-card cursor-pointer shadow-sm';
      $card.setAttribute('data-tool', toolName);
      $card.setAttribute('data-current-level', currentLevel.toString());

      // Contenido visual
      $card.innerHTML = `
        <div class="card-body d-flex flex-column align-items-center justify-content-center p-2">
          <img 
            src="/static/items/Item_${currentItemId}.png"
            width="48"
            height="48"
            alt="${toolName}"
            title="Nivel ${currentLevel}"
            style="border-radius: 4px;"
            onerror="this.src='/static/items/unknown.png'; this.title='Ítem desconocido';"
          >
          <strong class="mt-1" style="color: #f1faee; font-size: 0.9rem;">
            ${toolName} 
            <i class="m-1 fa-solid fa-circle-info"></i>
          </strong>
          <small class="text-muted mt-1" style="font-size: 0.8rem;">Nivel ${currentLevel}</small>
        </div>
      `;

      // Evento clic
      $card.addEventListener('click', (e) => {
        const clickedToolName = $card.getAttribute('data-tool')!;
        const target = e.target as HTMLElement;

        // Si haces clic en la información (icono, nombre), abre guía
        if (target.closest('.fa-solid.fa-circle-info')) {
          onOpenToolGuide(clickedToolName);
          return;
        }

        // Avanzar nivel
        const currentLvlAttr = parseInt($card.getAttribute('data-current-level') || '0', 10);
        const nextLevel = (currentLvlAttr + 1) % toolIds.length;
        const nextItemId = toolIds[nextLevel];

        // Actualizar estado global
        const newSlotData = [...savedData.gameData.slotData];
        const updatedSlot = { ...newSlotData[currentSlotIndex] };

        // Actualizar variable level
        (updatedSlot as any)[levelKey] = nextLevel;

        // Actualizar también en el inventario para que coincida siempre y se quede donde estaba
        const newInventory = [...(updatedSlot.inventorySaveItems || [])];
        if (newInventory[actualSlotIndex]) {
          newInventory[actualSlotIndex] = {
            ...newInventory[actualSlotIndex],
            itemID: nextItemId,
            isEmpty: nextItemId === 0
          };
        } else {
          newInventory[actualSlotIndex] = { itemID: nextItemId, amount: 1, isEmpty: nextItemId === 0 };
        }
        updatedSlot.inventorySaveItems = newInventory;

        newSlotData[currentSlotIndex] = updatedSlot;

        setSavedData({
          ...savedData,
          gameData: {
            ...savedData.gameData,
            slotData: newSlotData
          }
        });

        // Actualizar visualmente la tarjeta de la herramienta
        const img = $card.querySelector('img')!;
        img.src = `/static/items/Item_${nextItemId}.png`;
        $card.setAttribute('data-current-level', nextLevel.toString());
        $card.querySelector('small')!.textContent = `Nivel ${nextLevel}`;
      });

      container.appendChild($card);
    });
  }, [savedData, currentSlotIndex, onOpenToolGuide, setSavedData]);

  return (
    <div className="card bg-dark border-primary my-3">
      <div className="card-body">
        <h3 className="text-primary">🛠️ Herramientas Niveladas</h3>
        <div
          ref={containerRef}
          id="toolsStats"
          className="row row-cols-1 row-cols-md-5 g-3 mb-3"
        ></div>
      </div>
    </div>
  );
}