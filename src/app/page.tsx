// src/app/page.tsx
'use client';

import { useSaveData } from '@/components/utils/useSaveData';
import FileSelector from '@/components/file/FileSelector';

import { useItems } from '@/lib/useItems';

import CommunitySaves from '@/components/explorer/CommunitySaves';
import AdminPanel from '@/components/layout/AdminPanel';

export default function Home() {
  const { savedData, loadedFromFile } = useSaveData();
  const { loaded } = useItems();

  if (!loaded) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <h4>Iniciando sistemas de navegación...</h4>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-dark min-vh-100 text-white">
      <div className="container py-4">
        <FileSelector />

        {!savedData && (
          <div className="mt-5 border-top border-secondary pt-5">
            <CommunitySaves />
          </div>
        )}

        <AdminPanel />
      </div>
    </main>
  );
}