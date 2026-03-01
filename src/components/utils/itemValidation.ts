// src/lib/itemValidation.ts

// IDs de herramientas que NO se pueden modificar manualmente
export const TOOL_IDS = new Set([1, 2, 3, 4, 5, 6, 22]);

// Tipos que solo permiten cantidad 1
export const SINGLE_QUANTITY_TYPES = new Set(['chip', 'insecto', 'Peces', 'artefacto']);

// Función pura: recibe el mapa de ítems desde fuera
export const validateItemChange = (
  currentItemId: number,
  newItemId: number,
  newAmount: number,
  itemMap: Map<number, { id: number; name: string; type?: string }>,
  onWarning: (msg: string) => void
): boolean => {
  // 1. Bloquear herramientas
  if (TOOL_IDS.has(currentItemId) || TOOL_IDS.has(newItemId)) {
    onWarning("❌ No puedes modificar herramientas manualmente. Usa la sección de mejoras.");
    return false;
  }

  // 2. Validar cantidad = 1 para ciertos tipos
  const newItem = itemMap.get(newItemId);
  if (newItem?.type && SINGLE_QUANTITY_TYPES.has(newItem.type)) {
    if (newAmount > 1) {
      onWarning("⚠️ Este ítem solo puede tener cantidad 1. Cantidad mayor puede causar problemas.");
      // Opcional: forzar a 1 → return false o ajustar en el llamador
    }
  }

  return true;
};