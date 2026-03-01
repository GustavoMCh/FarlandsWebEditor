// src/components/file/FileLoader.tsx
'use client';

import { useSaveData } from '@/components/utils/useSaveData';

export default function FileLoader() {
  const { setSavedData, setCurrentSlotIndex,setLoadedFromFile} = useSaveData(); 

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    console.group('Cargando fichero...', file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.gameData?.slotData) throw new Error("❌ Formato inválido");
      
        console.log("✅ Datos preparados ",{data});
        setSavedData(data);
        console.log("✅ Datos guardado ");
        setCurrentSlotIndex(data.currentSlot || -1);
        console.log("✅ Estableciendo partida:",{data.currentSlot || -1});
        setLoadedFromFile(true);
      } catch (err) {
        console.error("❌ Error al parsear el archivo:", err);
      }
    };
    reader.readAsText(file);
    console.groupEnd();
  };

  return (
    <input type="file" onChange={handleFile} />
  );
}