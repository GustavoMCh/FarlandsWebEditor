'use client';

import { useState, useEffect } from 'react';

interface Plant {
  name: string;
  PC: string | number;
  PV: number;
  TC: string | number;
  CE?: string;
  TR?: number;
  MinR?: number;
  MaxR?: number;
  obtencion?: string;
  obtencionRenovable?: string;
  cosechasPosibles?: string[];
  nota?: string;
}

interface BestOption {
  name: string;
  valorCultivo: string | number;
  cosechasPorEstación: number;
  valorTotal: number;
  diasSobrantes: number;
  nota?: string;
}

export interface SeasonGuide {
  season: string;
  title: string;
  intro: string;
  plants: Plant[];
  bestOptions: BestOption[];
}

export const useSeasonGuides = () => {
  const [guides, setGuides] = useState<{ [season: string]: SeasonGuide }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seasons = ['warm', 'temperate', 'cold'];
    let loaded = 0;

    seasons.forEach(season => {
      fetch(`/guides/${season}.json`)
        .then(res => res.json())
        .then(data => {
          setGuides(prev => ({ ...prev, [season]: data }));
        })
        .catch(err => {
          console.warn(`⚠️ No se pudo cargar /guides/${season}.json`, err);
        })
        .finally(() => {
          loaded++;
          if (loaded === seasons.length) {
            setLoading(false);
          }
        });
    });
  }, []);

  return { guides, loading };
};