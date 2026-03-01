
'use client';

import { useState, useEffect } from 'react';

interface SpriteSheetOptions {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useSpriteSheet = ({ src, x, y, width, height }: SpriteSheetOptions) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImage(img);
      setLoading(false);
    };

    img.onerror = () => {
      setError(`❌ No se pudo cargar la imagen: ${src}`);
      setLoading(false);
    };
  }, [src]);

  // Función para dibujar el recorte en cualquier canvas
  const drawOnCanvas = (
    canvas: HTMLCanvasElement,
    destX = 0,
    destY = 0,
    destWidth = canvas.width,
    destHeight = canvas.height
  ) => {
    if (!image || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar tamaño proporcional si es necesario
    ctx.drawImage(
      image,
      x, y, width, height,           // Fuente: recorte
      destX, destY, destWidth, destHeight // Destino
    );
  };

  // Función para obtener un Data URL del recorte
  const getDataUrl = (): string | null => {
    if (!image) return null;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    return tempCanvas.toDataURL(); // Puedes usar esto para <img src="..." />
  };

  return {
    image,
    loading,
    error,
    drawOnCanvas,
    getDataUrl,
  };
};