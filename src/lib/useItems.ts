'use client';

import { useState, useEffect } from 'react';
import { ItemDetail } from '@/types/types'

interface Item {
  id: number;
  name: string;
  procesar?: string;
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemNames, setItemNames] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading((currentLoading) => {
        if (currentLoading) {
          console.warn("⚠️ Timeout: Forzando fin de carga de ítems (10s)");
          setLoaded(true);
          return false;
        }
        return currentLoading;
      });
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    fetch('/guides/items.json')
      .then(res => res.json())
      .then(data => {
        const sorted = data.items.sort((a: Item, b: Item) => a.id - b.id);
        setItems(sorted);

        const names: { [key: number]: string } = {};
        sorted.forEach((item: ItemDetail) => {
          names[item.id] = item.name;
        });
        setItemNames(names);


      })
      .catch(err => {
        console.error("❌ Error crítico al cargar items.json", err);
      })
      .finally(() => {
        setLoading(false);
        setLoaded(true);
      });
  }, []);

  return { items, itemNames, loading, loaded };
};