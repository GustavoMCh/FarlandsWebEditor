// src/components/context/SaveDataContext.tsx
'use client';

import { GameSaveData, SlotData, ItemSlot } from '@/types/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SaveDataContextType {
  savedData: GameSaveData | null;
  currentSlotIndex: number;
  currentSlot: SlotData | null;
  loadedFromFile: boolean;
  contextMenuSlotIndex: number | null;
  contextMenuPosition: { x: number; y: number };
  showContextMenu: boolean;
  editingSlotKey: string | null;
  setSavedData: (data: GameSaveData | null) => void;
  setCurrentSlotIndex: (index: number) => void;
  setLoadedFromFile: (loaded: boolean) => void;
  clearSaveData: () => void;
  setContextMenuSlotIndex: (index: number | null) => void;
  setContextMenuPosition: (pos: { x: number; y: number }) => void;
  setShowContextMenu: (show: boolean) => void;
  updateSlot: (slotIndex: number, updates: Partial<ItemSlot>, inventoryType: 'player' | 'ship') => void;
  setEditingSlotKey: (key: string | null) => void;
}

const SaveDataContext = createContext<SaveDataContextType | undefined>(undefined);

export const SaveDataProvider = ({ children }: { children: ReactNode }) => {
  const [savedData, setSavedData] = useState<GameSaveData | null>(null);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(-1);
  const [loadedFromFile, setLoadedFromFile] = useState<boolean>(false);
  const [contextMenuSlotIndex, setContextMenuSlotIndex] = useState<number | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [editingSlotKey, setEditingSlotKey] = useState<string | null>(null);

  const currentSlot: SlotData | null = savedData?.gameData?.slotData?.[currentSlotIndex] ?? null;

  // Cargar desde localStorage al inicio
  useEffect(() => {
    const savedJson = localStorage.getItem('farlandsSaveData');
    const savedSlot = localStorage.getItem('farlandsCurrentSlot');
    if (!savedJson) return;

    try {
      const data = JSON.parse(savedJson);
      if (!data.gameData?.slotData) return;

      setSavedData(data);
      setCurrentSlotIndex(savedSlot ? parseInt(savedSlot, 10) : data.gameData.currentSlot || 0);
      setLoadedFromFile(false);
    } catch (err) {
      console.error("❌ Error al cargar desde localStorage:", err);
      localStorage.removeItem('farlandsSaveData');
      localStorage.removeItem('farlandsCurrentSlot');
    }
  }, []);

  // Guardar en localStorage cuando cambie savedData
  useEffect(() => {
    if (!savedData) return;
    try {
      localStorage.setItem('farlandsSaveData', JSON.stringify(savedData));
    } catch (err) {
      console.error("❌ Error al guardar savedData en localStorage:", err);
    }
  }, [savedData]);

  useEffect(() => {
    if (currentSlotIndex !== -1) {
      try {
        localStorage.setItem('farlandsCurrentSlot', currentSlotIndex.toString());
      } catch (err) {
        console.error("❌ Error al guardar currentSlotIndex en localStorage:", err);
      }
    }
  }, [currentSlotIndex]);

  const clearSaveData = () => {
    setSavedData(null);
    setCurrentSlotIndex(-1);
    setLoadedFromFile(false);
    localStorage.removeItem('farlandsSaveData');
    localStorage.removeItem('farlandsCurrentSlot');
  };

  const updateSlot = (
    slotIndex: number,
    updates: Partial<ItemSlot>,
    inventoryType: 'player' | 'ship' // o 'chest' en el futuro
  ) => {
    if (!savedData || currentSlotIndex === -1) return;

    const slotData = [...savedData.gameData.slotData];
    const currentSlotData = slotData[currentSlotIndex];

    let inventory: ItemSlot[];
    let key: keyof SlotData;

    if (inventoryType === 'player') {
      inventory = [...currentSlotData.inventorySaveItems];
      key = 'inventorySaveItems';
    } else if (inventoryType === 'ship') {
      inventory = [...currentSlotData.shipInventorySaveItems];
      key = 'shipInventorySaveItems';
    } else {
      return; // o manejar cofres después
    }

    const current = inventory[slotIndex] || { itemID: 0, amount: 0, isEmpty: true };
    const updated: ItemSlot = {
      ...current,
      ...updates,
      isEmpty: (updates.itemID ?? current.itemID) === 0,
    };

    inventory[slotIndex] = updated;
    slotData[currentSlotIndex] = { ...currentSlotData, [key]: inventory };

    setSavedData({
      ...savedData,
      gameData: { ...savedData.gameData, slotData }
    });
  };

  return (
    <SaveDataContext.Provider
      value={{
        savedData,
        currentSlotIndex,
        currentSlot,
        loadedFromFile,
        contextMenuSlotIndex,
        contextMenuPosition,
        showContextMenu,
        editingSlotKey,
        setSavedData,
        setCurrentSlotIndex,
        setLoadedFromFile,
        clearSaveData,
        setContextMenuSlotIndex,
        setContextMenuPosition,
        setShowContextMenu,
        updateSlot,
        setEditingSlotKey,
      }}
    >
      {children}
    </SaveDataContext.Provider>
  );
};

// Hook personalizado para usar el contexto (también exportado desde useSaveData.ts para retrocompatibilidad)
export const useSaveData = () => {
  const context = useContext(SaveDataContext);
  if (!context) {
    throw new Error('useSaveData debe usarse dentro de un SaveDataProvider');
  }
  return context;
};