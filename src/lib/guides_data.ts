// src/lib/guides_data.ts

export interface GuideSection {
    title: string;
    content: string;
}

export interface Guide {
    id: string;
    title: string;
    author: string;
    url: string;
    sections: GuideSection[];
}

export const guidesData: Guide[] = [
    {
        id: 'cosechas-trirly',
        title: 'Mejor Cosecha para Cada Estación (Actualizado)',
        author: 'Trirly',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3296281201',
        sections: [
            {
                title: 'Introducción',
                content: 'En esta guía recopilaré datos de las diferentes cosechas de cada estación, definiendo cual es la mejor para cada una en base al dinero obtenible.'
            },
            {
                title: 'Estación Cálida',
                content: 'La mejor cosecha para la estación cálida es el **Cristal de Fuego**. Es rentable y fácil de mantener.'
            },
            {
                title: 'Estación Templada',
                content: 'Durante la estación templada, se recomienda enfocarse en las **Bayas Galeanas** por su bajo costo inicial y buena rentabilidad.'
            },
            {
                title: 'Estación Fría',
                content: 'En el invierno, las **Flores de Hielo** son la mejor opción, aunque requieren más cuidado.'
            }
        ]
    },
    {
        id: 'robeets-masiluisito',
        title: 'Lista de Obtención de Robeets - Actualizado a la 0.8.0',
        author: 'Masiluisito_23',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3311161140',
        sections: [
            {
                title: '¿Qué son los Robeets?',
                content: 'Son pequeños robots que puedes encontrar por el mundo. Al recolectar 8 de un color, obtienes un bono permanente de +20 de energía.'
            },
            {
                title: 'Ubicaciones por Colores',
                content: 'Azules: Mayoría en Planet Galea.\nAmarillos: Encontrados principalmente en Planet Bohr.\nRojos: En Planet Hafnir y Terbin.'
            }
        ]
    },
    {
        id: 'mejoras-universales',
        title: 'Lista de Mejoras Universales',
        author: 'Masiluisito_23',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3401417834',
        sections: [
            {
                title: 'Mejoras de la Nave',
                content: '- Células de combustible: Añade 2 nuevas células por mejora.\n- Mejora del motor: Reduce costes de combustible.\n- Espacio de carga: +4 espacios por mejora.\n- Reactores: Reduce 1 hora de viaje por mejora.'
            },
            {
                title: 'Mejoras de Herramientas',
                content: 'Pico, Hacha, Azada, Hoz y Regadera tienen 4 niveles de mejora cada una, aumentando rango y eficiencia.'
            }
        ]
    },
    {
        id: 'minerales-bohr',
        title: 'Guía Breve Minerales Mina Bohr',
        author: 'Kapitan Risk',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3297849266',
        sections: [
            {
                title: 'Distribución de Minerales',
                content: '- Niveles 1-10: Cobre y Celestio.\n- Niveles 11-20: Cobre, Celestio y Hierro.\n- Niveles 21-50: Plata, Oro y Cristalinita.'
            },
            {
                title: 'Enemigos y Flora',
                content: '- **Murlusa**: Enemigo volador. Suelta pelusa (50 monedas).\n- **Bicho seta**: Terrestre. Suelta setas.\n- **Tortuga mineral**: Muy útil. Con el golpe adecuado suelta el mineral que lleva en la espalda.\n- **Gatopo**: NO AGRESIVO. Te pide un material y a cambio te da materiales raros (ej: madera, cronium).'
            }
        ]
    },
    {
        id: 'romance-regalos',
        title: 'Guia de Romance y Mejores Regalos',
        author: 'Masiluisito_23',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3474100270',
        sections: [
            {
                title: 'Sistema de Relación',
                content: 'Habla a diario (+10 pts), cuenta un chiste (+20 pts) o intenta ligar (+50 pts si sale bien, -20 si sale mal).'
            },
            {
                title: 'Mejores Regalos para Candidatas',
                content: '- **Elora**: Cristal de Fuego\n- **Kael**: Piedra de Luna\n- **Mira**: Baya Galeana'
            }
        ]
    },
    {
        id: 'cocina-farlands',
        title: 'Cocina y Comida en Farlands',
        author: 'Masiluisito_23',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3406725200',
        sections: [
            {
                title: 'Recetas de 4 Estrellas',
                content: 'Las mejores recetas regeneran hasta 300 de energía. Requieren ingredientes avanzados de múltiples planetas.'
            },
            {
                title: 'Ingredientes Clave',
                content: 'Harina, Aceite y Sal se compran en la tienda. Los vegetales deben ser cultivados en sus respectivas estaciones.'
            }
        ]
    },
    {
        id: 'pesca-farlands',
        title: 'Guia de pesca de Farlands',
        author: 'Nico Marver',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3299658046',
        sections: [
            {
                title: 'Zonas de Pesca',
                content: 'Galea (Peces comunes), Bohr (Peces exóticos), Hafnir (Peces de fuego), Goddol (Peces tecnológicos).'
            },
            {
                title: 'Probabilidades de Artefactos',
                content: 'Pescar en burbujas aumenta la probabilidad de obtener artefactos raros en un 15%.'
            }
        ]
    },
    {
        id: 'artefactos-lista',
        title: 'Lista de Obtención de Artefactos',
        author: 'Masiluisito_23',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3562457517',
        sections: [
            {
                title: 'Donaciones al Arca',
                content: 'Muchos artefactos solo sirven para ser donados al Arca y completar la colección del planetario.'
            },
            {
                title: 'Artefactos por Planeta',
                content: 'Bohr: Circuitos antiguos, Engranajes oxidados.\nTerbin: Fósiles alienígenas, Cristales de memoria.'
            }
        ]
    },
    {
        id: 'backups-guide',
        title: 'Guía Rápida: Copias de seguridad',
        author: 'Daimer´s',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3403554022',
        sections: [
            {
                title: 'Ubicación de Partidas',
                content: 'Windows: %AppData%\\LocalLow\\Vandit\\Farlands\\Saves'
            },
            {
                title: 'Bonus: Cambio de Nombre',
                content: 'Puedes editar el archivo XML de la partida para cambiar tu nombre buscando el tag <playerName>.'
            }
        ]
    },
    {
        id: 'chips-guide',
        title: 'Guía de Obtención de Chips',
        author: 'Masiluisito_23',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3563135665',
        sections: [
            {
                title: 'Chips de Tecnología',
                content: 'Esenciales para fabricar aspersores avanzados y máquinas de procesamiento automático.'
            },
            {
                title: 'Decoración',
                content: 'Los sets de muebles (Moderno, Rústico, Espacial) requieren sus respectivos chips de diseño.'
            }
        ]
    }
];
