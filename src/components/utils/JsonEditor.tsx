'use client';

import React, { useState } from 'react';

const FIELD_TRANSLATIONS: Record<string, string> = {
    "itemID": "ID del Ítem",
    "amount": "Cantidad",
    "isEmpty": "Vacío (sí/no)",
    "level": "Nivel",
    "energy": "Energía",
    "maxEnergy": "Energía Máxima",
    "health": "Salud",
    "maxHealth": "Salud Máxima",
    "money": "Dinero",
    "day": "Día actual",
    "season": "Estación",
    "year": "Año",
    "playerName": "Nombre del Jugador",
    "farmName": "Nombre de la Granja",
    "spaceShipActiveCells": "Nivel de la Nave",
    "spaceShipAvailableCells": "Nivel Máximo Nave",
    "spaceShipCurrentEnergy": "Energía Actual de la Nave",
    "currentEnergyLevel": "Nivel de Energía Actual",
    "maxEnergyLevel": "Nivel Máximo de Energía",
    "saveTime": "Tiempo de Guardado",
    "playTime": "Tiempo de Juego",
    "inventorySaveItems": "Inventario del Jugador",
    "shipInventorySaveItems": "Inventario de la Nave",
    "chestSlots": "Cofres",
    "itemsID": "IDs de los Ítems",
    "itemsAmount": "Cantidades de los Ítems"
};

const formatKeyName = (key: string): string => {
    // Si la clave no está en el diccionario, intentamos convertir snake_case o camelCase a texto normal capitalizado
    return key
        // Insertar un espacio antes de las mayúsculas (camelCase -> camel Case)
        .replace(/([A-Z])/g, ' $1')
        // Reemplazar guiones bajos con espacios (snake_case -> snake case)
        .replace(/_/g, ' ')
        // Capitalizar la primera letra
        .replace(/^./, str => str.toUpperCase())
        .trim();
};

interface JsonEditorProps {
    data: any;
    onChange: (newData: any) => void;
    name?: string;
    level?: number;
    showTranslations?: boolean;
}

export default function JsonEditor({ data, onChange, name = 'root', level = 0, showTranslations = false }: JsonEditorProps) {
    // Por defecto, colapsa objetos profundos para no sobrecargar la UI
    const [collapsed, setCollapsed] = useState(level > 1);

    const displayName = showTranslations ? (FIELD_TRANSLATIONS[name] || formatKeyName(name)) : name;
    const hoverName = showTranslations ? `Original: ${name}` : (FIELD_TRANSLATIONS[name] || formatKeyName(name));

    if (typeof data !== 'object' || data === null) {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let val: any = e.target.value;
            if (typeof data === 'number') {
                val = val === '' ? 0 : Number(val);
            }
            if (typeof data === 'boolean') {
                val = e.target.checked;
            }
            onChange(val);
        };

        return (
            <div className="d-flex align-items-center mb-1" style={{ marginLeft: level * 20 }}>
                <span
                    className="fw-bold me-2 text-info"
                    title={hoverName}
                    style={{ cursor: 'help' }}
                >
                    {displayName}:
                </span>
                {typeof data === 'boolean' ? (
                    <div className="form-check form-switch mb-0">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={data}
                            onChange={handleChange}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                ) : (
                    <input
                        type={typeof data === 'number' ? 'number' : 'text'}
                        className="form-control form-control-sm bg-dark text-light border-secondary"
                        style={{ width: typeof data === 'number' ? '120px' : '250px', display: 'inline-block' }}
                        value={data ?? ''}
                        onChange={handleChange}
                    />
                )}
            </div>
        );
    }

    const isArray = Array.isArray(data);
    const keys = Object.keys(data);

    return (
        <div style={{ marginLeft: level > 0 ? 20 : 0, marginBottom: '4px' }}>
            <div
                className="d-flex align-items-center rounded p-1"
                style={{ userSelect: 'none', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
                <span
                    className="me-2 cursor-pointer d-flex justify-content-center align-items-center"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ width: '20px', height: '20px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}
                >
                    {collapsed ? '▶' : '▼'}
                </span>
                <span
                    className="fw-bold text-warning cursor-pointer"
                    onClick={() => setCollapsed(!collapsed)}
                    title={hoverName}
                    style={{ cursor: 'help' }}
                >
                    {displayName}
                </span>
                <span className="ms-2 text-muted" style={{ fontSize: '0.8rem' }}>
                    {isArray ? `Array(${keys.length})` : `{ ${keys.length} campos }`}
                </span>
            </div>

            {!collapsed && (
                <div className="mt-1 border-start border-secondary ps-2 ms-2">
                    {keys.map(key => (
                        <JsonEditor
                            key={key}
                            name={key}
                            data={(data as any)[key]}
                            level={level + 1}
                            showTranslations={showTranslations}
                            onChange={(newVal) => {
                                const newData = isArray ? [...data] : { ...data };
                                (newData as any)[key] = newVal;
                                onChange(newData);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
