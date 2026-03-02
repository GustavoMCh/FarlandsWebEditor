// src/components/editor/Editor.tsx
'use client';

import { useSaveData } from '@/components/utils/useSaveData';
import DayYearDisplay from '@/components/day/DayYearDisplay';
import PlayerSection from '@/components/player/PlayerSection';
import ToolsStats from '@/components/tools/ToolsStats';
import ShipSection from '@/components/ship/ShipSection';
import FarmSection from '@/components/farm/FarmSection';
import ChestSection from '@/components/inventory/ChestSection';
import ArcaProgress from '@/components/arca/ArcaProgress';
import ItemExplorerTab from '@/components/explorer/ItemExplorerTab';
import ExportButton from '@/components/buttons/ExportButton';
import ClearAllButton from '@/components/buttons/ClearAllButton';
import BackButton from '@/components/buttons/BackButton';
import ManualIdModal from '@/components/modals/ManualIdModal';
import ToolGuideModal from '@/components/modals/ToolGuideModal';
import { useState, useEffect } from 'react';
import JsonEditor from '@/components/utils/JsonEditor';
import AchievementsTab from '@/components/explorer/AchievementsTab';

export default function Editor() {
  const { savedData, setSavedData, currentSlotIndex, currentSlot, clearSaveData } = useSaveData();
  const [showToolGuide, setShowToolGuide] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Todo');
  const [showTranslations, setShowTranslations] = useState<boolean>(false);

  useEffect(() => {
    const handleInventorySwap = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { source, target } = customEvent.detail;

      if (!savedData || currentSlotIndex === -1) return;

      const updatedSlotData = [...savedData.gameData.slotData];
      const slotDataClone = { ...updatedSlotData[currentSlotIndex] };
      const cloneInventories = {
        player: [...(slotDataClone.inventorySaveItems || [])],
        ship: [...(slotDataClone.shipInventorySaveItems || [])],
        chest: [...(slotDataClone.chestSlots || [])],
      };

      // Extract source item
      let sourceItem = { itemID: 0, amount: 0, isEmpty: true };
      if (source.inventoryType === 'player') {
        sourceItem = cloneInventories.player[source.slotIndex];
        cloneInventories.player[source.slotIndex] = { itemID: 0, amount: 0, isEmpty: true };
      } else if (source.inventoryType === 'ship') {
        sourceItem = cloneInventories.ship[source.slotIndex];
        cloneInventories.ship[source.slotIndex] = { itemID: 0, amount: 0, isEmpty: true };
      } else if (source.inventoryType === 'chest' && source.chestIndex !== undefined) {
        sourceItem = {
          itemID: cloneInventories.chest[source.chestIndex].itemsID[source.slotIndex],
          amount: cloneInventories.chest[source.chestIndex].itemsAmount[source.slotIndex],
          isEmpty: cloneInventories.chest[source.chestIndex].itemsID[source.slotIndex] === 0
        };
        const ch = { ...cloneInventories.chest[source.chestIndex] };
        ch.itemsID = [...ch.itemsID];
        ch.itemsAmount = [...ch.itemsAmount];
        ch.itemsID[source.slotIndex] = 0;
        ch.itemsAmount[source.slotIndex] = 0;
        cloneInventories.chest[source.chestIndex] = ch;
      }

      // Extract target item
      let targetItem = { itemID: 0, amount: 0, isEmpty: true };
      if (target.inventoryType === 'player') {
        targetItem = cloneInventories.player[target.slotIndex] || { itemID: 0, amount: 0, isEmpty: true };
        cloneInventories.player[target.slotIndex] = sourceItem;
      } else if (target.inventoryType === 'ship') {
        targetItem = cloneInventories.ship[target.slotIndex] || { itemID: 0, amount: 0, isEmpty: true };
        cloneInventories.ship[target.slotIndex] = sourceItem;
      } else if (target.inventoryType === 'chest' && target.chestIndex !== undefined) {
        targetItem = {
          itemID: cloneInventories.chest[target.chestIndex].itemsID[target.slotIndex] || 0,
          amount: cloneInventories.chest[target.chestIndex].itemsAmount[target.slotIndex] || 0,
          isEmpty: (cloneInventories.chest[target.chestIndex].itemsID[target.slotIndex] || 0) === 0
        };
        const ch = { ...cloneInventories.chest[target.chestIndex] };
        ch.itemsID = [...ch.itemsID];
        ch.itemsAmount = [...ch.itemsAmount];
        ch.itemsID[target.slotIndex] = sourceItem.itemID;
        ch.itemsAmount[target.slotIndex] = sourceItem.amount;
        cloneInventories.chest[target.chestIndex] = ch;
      }

      // Put target item back into source (SWAP)
      if (source.inventoryType === 'player') {
        cloneInventories.player[source.slotIndex] = targetItem;
      } else if (source.inventoryType === 'ship') {
        cloneInventories.ship[source.slotIndex] = targetItem;
      } else if (source.inventoryType === 'chest' && source.chestIndex !== undefined) {
        const ch = { ...cloneInventories.chest[source.chestIndex] };
        ch.itemsID = [...ch.itemsID];
        ch.itemsAmount = [...ch.itemsAmount];
        ch.itemsID[source.slotIndex] = targetItem.itemID;
        ch.itemsAmount[source.slotIndex] = targetItem.amount;
        cloneInventories.chest[source.chestIndex] = ch;
      }

      slotDataClone.inventorySaveItems = cloneInventories.player;
      slotDataClone.shipInventorySaveItems = cloneInventories.ship;
      slotDataClone.chestSlots = cloneInventories.chest as any;

      // === SYNC TOOL LEVELS IF MOVED ===
      const toolLevels: Record<string, number[]> = {
        "Hacha": [1, 240, 241, 242, 243],
        "Azada": [2, 248, 249, 250, 251],
        "Pico": [3, 244, 245, 246, 247],
        "Hoz": [4, 252, 253, 254, 255],
        "Regadera": [22, 256, 257, 258, 259],
        "Caña": [5, 378, 379],
        "Red": [6, 380, 381]
      };

      const toolKeyMap: Record<string, string> = {
        "Hacha": "hatchetLevel",
        "Azada": "hoeLevel",
        "Pico": "pickaxeLevel",
        "Hoz": "sickleLevel",
        "Regadera": "wateringCanLevel",
        "Caña": "cañaLevel",
        "Red": "redLevel"
      };

      // Check all 7 locked tool slots in Player Inventory
      for (let i = 0; i <= 6; i++) {
        const itemID = cloneInventories.player[i]?.itemID || 0;

        // If a known tool is placed here, update its corresponding save data level
        if (itemID > 0) {
          for (const [toolName, ids] of Object.entries(toolLevels)) {
            const levelIndex = ids.indexOf(itemID);
            if (levelIndex !== -1) {
              const levelKey = toolKeyMap[toolName];
              (slotDataClone as any)[levelKey] = levelIndex;
              break;
            }
          }
        }
      }

      updatedSlotData[currentSlotIndex] = slotDataClone;
      setSavedData({
        ...savedData,
        gameData: {
          ...savedData.gameData,
          slotData: updatedSlotData
        }
      });
    };

    window.addEventListener('inventory-swap', handleInventorySwap);
    return () => window.removeEventListener('inventory-swap', handleInventorySwap);
  }, [savedData, currentSlotIndex]);

  const tabs = [
    { id: 'Jugador', label: 'Jugador' },
    { id: 'Nave', label: 'Nave' },
    { id: 'Herramienta', label: 'Herramientas' },
    { id: 'Granja', label: 'Granja' },
    { id: 'Cofres', label: 'Cofres' },
    { id: 'Progreso Arca', label: 'Progreso Arca' },
    { id: 'Catálogo', label: 'Ítems' },
    { id: 'Logros', label: '🏆 Logros' },
    { id: 'Avanzado', label: '⚙️ Avanzado' },
    { id: 'Todo', label: 'Ver Todo' }
  ];

  const handleRawDataChange = (newData: any) => {
    if (!savedData) return;
    const newSlotData = [...savedData.gameData.slotData];
    newSlotData[currentSlotIndex] = newData;
    setSavedData({
      ...savedData,
      gameData: {
        ...savedData.gameData,
        slotData: newSlotData
      }
    });
  };

  return (
    <div className="container-fluid py-4 px-2 md:px-4">

      <DayYearDisplay />

      {/* Navegación por Pestañas — scroll horizontal en una sola línea */}
      <div style={{ overflowX: 'auto', overflowY: 'hidden', marginBottom: '1rem', scrollbarWidth: 'none' }}>
        <ul className="nav nav-tabs flex-nowrap" style={{ minWidth: 'max-content', borderBottom: '1px solid #dee2e6' }}>
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? 'active fw-bold' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido Condicional */}
      {(activeTab === 'Todo' || activeTab === 'Jugador') && <PlayerSection />}
      {(activeTab === 'Todo' || activeTab === 'Nave') && <ShipSection />}
      {(activeTab === 'Todo' || activeTab === 'Herramienta') && <ToolsStats onOpenToolGuide={setShowToolGuide} />}
      {(activeTab === 'Todo' || activeTab === 'Granja') && <FarmSection />}
      {(activeTab === 'Todo' || activeTab === 'Cofres') && <ChestSection />}
      {(activeTab === 'Todo' || activeTab === 'Progreso Arca') && <ArcaProgress />}
      {(activeTab === 'Todo' || activeTab === 'Catálogo') && <ItemExplorerTab />}
      {(activeTab === 'Todo' || activeTab === 'Logros') && <AchievementsTab />}

      {(activeTab === 'Todo' || activeTab === 'Avanzado') && currentSlot && (
        <div className="card bg-dark border-danger my-3">
          <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h4 className="mb-0">⚙️ Editor Avanzado (Datos Crudos)</h4>
              <small>Cuidado: La edición de estos datos no se valida y puede corromper la partida.</small>
            </div>
            <div className="form-check form-switch mt-2 mt-md-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="translateSwitch"
                checked={showTranslations}
                onChange={(e) => setShowTranslations(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label className="form-check-label text-white ms-1" htmlFor="translateSwitch" style={{ cursor: 'pointer' }}>
                Traducir Nombres
              </label>
            </div>
          </div>
          <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <JsonEditor data={currentSlot} onChange={handleRawDataChange} name="currentSlot" showTranslations={showTranslations} />
          </div>
        </div>
      )}

      <div className="text-center mt-3">
        <ClearAllButton />
        <p className="text-warning mt-1 small">
          ⚠️ Vaciará slots 9-26 del inventario principal. ¡Los primeros 9 slots NO se tocan!
        </p>
      </div>

      <ExportButton />
      <BackButton />

      {/* Modales */}
      <ManualIdModal />
      {showToolGuide && (
        <ToolGuideModal
          toolName={showToolGuide}
          isOpen={true}
          onClose={() => setShowToolGuide(null)}
        />
      )}
    </div>
  );
}