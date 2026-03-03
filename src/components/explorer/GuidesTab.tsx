// src/components/explorer/GuidesTab.tsx
'use client';

import { useState } from 'react';
import { guidesData, Guide } from '@/lib/guides_data';

export default function GuidesTab() {
    const [selectedGuide, setSelectedGuide] = useState<Guide>(guidesData[0]);

    return (
        <div className="card bg-dark text-light border-secondary">
            <div className="card-header bg-gradient-dark border-secondary p-3">
                <h3 className="mb-0">📖 Guías de la Comunidad</h3>
                <p className="text-secondary small mb-0">Información útil extraída de las guías de Steam. ¡Gracias a sus creadores!</p>
            </div>
            <div className="card-body p-0">
                <div className="row g-0">
                    {/* Sidebar de Guías */}
                    <div className="col-md-4 border-end border-secondary" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <div className="list-group list-group-flush">
                            {guidesData.map((guide) => (
                                <button
                                    key={guide.id}
                                    className={`list-group-item list-group-item-action bg-dark text-light border-secondary py-3 ${selectedGuide.id === guide.id ? 'active bg-primary' : ''}`}
                                    onClick={() => setSelectedGuide(guide)}
                                >
                                    <div className="d-flex w-100 justify-content-between">
                                        <h6 className="mb-1">{guide.title}</h6>
                                    </div>
                                    <small className={selectedGuide.id === guide.id ? 'text-light' : 'text-secondary'}>
                                        Por: {guide.author}
                                    </small>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contenido de la Guía */}
                    <div className="col-md-8 p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h4 className="text-primary mb-1">{selectedGuide.title}</h4>
                                <p className="text-secondary small">
                                    Autor: <span className="text-light">{selectedGuide.author}</span>
                                </p>
                            </div>
                            <a
                                href={selectedGuide.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-info btn-sm"
                            >
                                Ver en Steam ↗
                            </a>
                        </div>

                        <div className="guide-content">
                            {selectedGuide.sections.map((section, idx) => (
                                <div key={idx} className="mb-4 p-3 rounded bg-black-50 border border-secondary">
                                    <h5 className="text-info border-bottom border-secondary pb-2 mb-3">{section.title}</h5>
                                    <div className="text-light" style={{ whiteSpace: 'pre-line' }}>
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 p-3 bg-darker rounded border border-warning">
                            <p className="mb-0 small text-warning italic">
                                Nota: Esta información es facilitada por la comunidad. Los datos pueden variar según la versión del juego.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bg-gradient-dark {
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
        }
        .bg-darker {
          background-color: #0d0d0d;
        }
        .bg-black-50 {
          background-color: rgba(0, 0, 0, 0.4);
        }
        .nav-link {
          color: #adb5bd;
          border-radius: 0;
        }
        .nav-link.active {
          background-color: #0d6efd !important;
          color: white !important;
        }
        .list-group-item-action:hover {
          background-color: #2c2c2c;
        }
      `}</style>
        </div>
    );
}
