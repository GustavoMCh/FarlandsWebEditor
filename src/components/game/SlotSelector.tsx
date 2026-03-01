import { useSaveData } from '@/components/utils/useSaveData';
import { SlotData } from '@/types/types';

export default function SlotSelector() {
  const { savedData, currentSlotIndex, setCurrentSlotIndex } = useSaveData();

  if (!savedData) return null;

  return (
    <div className="flex gap-2 mb-4">
      {savedData.slotData.map((_:SlotData, idx:number) => (
        <button
          key={idx}
          className={`px-4 py-2 rounded ${currentSlotIndex === idx ? 'bg-accent-success text-black' : 'bg-bg-card'}`}
          onClick={() => setCurrentSlotIndex(idx)}
        >
          Partida {idx + 1}
        </button>
      ))}
    </div>
  );
}