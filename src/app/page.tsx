// src/app/page.tsx
'use client';

import { useSaveData } from '@/components/utils/useSaveData';
import FileSelector from '@/components/file/FileSelector';

import { useItems } from '@/lib/useItems';

export default function Home() {
  const { savedData, currentSlotIndex,loadedFromFile } = useSaveData();
  const { loaded } = useItems();

  // Mientras cargan los ítems, muestra un cargador
  if (!loaded) {
    return <div>Cargando recursos...</div>;
  }

    return <FileSelector />;
}