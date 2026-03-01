'use client';

import { useEffect, useRef } from 'react';
import { useSaveData } from '@/components/utils/useSaveData';

export default function WateredCrops() {
  const { savedData, currentSlotIndex,currentSlot } = useSaveData();
  const wateredCountRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!savedData || !wateredCountRef.current || !currentSlot) return;


    const count = currentSlot.wateredTiles?.length || 0;
    wateredCountRef.current.textContent = count.toString();
  }, [savedData, currentSlotIndex, currentSlot]);

  return (
    <h5 className="text-warning">
      🪴 Cultivos Regados: <span ref={wateredCountRef}>--</span>
    </h5>
  );
}