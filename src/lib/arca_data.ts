export interface ArcaItem {
    id: number;
    name: string;
    planet?: string;
    source?: string;
}

export interface ArcaCategory {
    category: string;
    description: string;
    items: ArcaItem[];
}

export const ARCA_DATA: ArcaCategory[] = [
    {
        category: "Hortalizas (Cultivos)",
        description: "En esta sección se tienen en cuenta los ítems de la sección del lado derecho de las hortalizas de El Arca. Las semillas son obtenibles a través del cultivo, mientras que el Vendedor Ambulante permite la compra directa.",
        items: [
            { id: 28, name: "Azafrán Boomerang", source: "Semilla" },
            { id: 184, name: "Bólaro", source: "Semilla" },
            { id: 182, name: "Brote de Blóbulo", source: "Semilla" },
            { id: 168, name: "Condurl", source: "Semilla" },
            { id: 166, name: "Crisful", source: "Semilla" },
            { id: 174, name: "Cuadrachofa", source: "Semilla" },
            { id: 198, name: "Cuouí", source: "Semilla" },
            { id: 27, name: "Flor de Cactus", source: "Semilla" },
            { id: 16, name: "Fruto Temporal", source: "Semilla" },
            { id: 178, name: "Galleta", source: "Semilla" },
            { id: 200, name: "Globolabaza", source: "Semilla" },
            { id: 186, name: "Icosandía (loosandía)", source: "Semilla" },
            { id: 190, name: "Kuriq", source: "Semilla" },
            { id: 192, name: "Mollifruta", source: "Semilla" },
            { id: 164, name: "Odox", source: "Semilla" },
            { id: 194, name: "Pelombio", source: "Semilla" },
            { id: 170, name: "Penrose", source: "Semilla" },
            { id: 29, name: "Queso Vegano", source: "Semilla" }
        ]
    },
    {
        category: "Hortalizas: No Cultivos",
        description: "Items del lado izquierdo de las hortalizas. El loot de cajas/barriles depende del planeta. También se obtienen de NPCs (Gorg, Grubert) o enemigos específicos (Robot Hafnir, Bicho Seta).",
        items: [
            { id: 207, name: "Cactus Terbinita", planet: "Terbin" },
            { id: 1836, name: "Caparazón Bonito", source: "Cajas" },
            { id: 1846, name: "Caparazón Espiral", source: "Cajas" },
            { id: 1856, name: "Caparzón Hermitaño", source: "Cajas" },
            { id: 1862, name: "Caracol Celeste", source: "Cajas" },
            { id: 31, name: "Seta Bohrlana", planet: "Bohr" },
            { id: 120, name: "Seta Galeana", planet: "Galea" },
            { id: 164, name: "Champiñón Rojo (Odox)", planet: "Galea?" }, // Placeholder mapping based on general name
            { id: 279, name: "Champiñón Gigante", source: "Bicho Seta" },
            { id: 32, name: "Coral (Rosa de Terbin)", planet: "Terbin" },
            { id: 40, name: "Cristal de Hielo", planet: "Bohr?" },
            { id: 8, name: "Diente de León (Hierba)", planet: "Galea" },
            { id: 1866, name: "Estrella de Mar", source: "Cajas" },
            { id: 116, name: "Flor Galeana", planet: "Galea" },
            { id: 117, name: "Madera Galeana", planet: "Galea" },
            { id: 332, name: "Madera Goddolita", planet: "Goddol" },
            { id: 10, name: "Piedra", source: "Gorg" },
            { id: 119, name: "Savia", source: "Árboles" },
            { id: 172, name: "Solaria", source: "Semilla/Goddol" },
            { id: 1882, name: "Tulipán Fantasma", planet: "Goddol" }
        ]
    },
    {
        category: "Minerales",
        description: "Obtenibles de forma natural en planetas o a través de NPCs como Te'Kragh y Gorg. El Rubí puede ser soltado por la Tortuga en Bohr.",
        items: [
            { id: 53, name: "Apalescita" },
            { id: 50, name: "Bismuto" },
            { id: 12, name: "Carbón", source: "Gorg" },
            { id: 55, name: "Celestio" },
            { id: 36, name: "Circón" },
            { id: 40, name: "Cristalinita", source: "Te'Kragh" },
            { id: 41, name: "Cronio", source: "Te'Kragh" },
            { id: 38, name: "Esmeralda" },
            { id: 44, name: "Fluidirita" },
            { id: 48, name: "Kassimerita" },
            { id: 47, name: "Luminita" },
            { id: 49, name: "Magma Cristalizado" },
            { id: 43, name: "Mitrilo" },
            { id: 42, name: "Oro", source: "Gorg" },
            { id: 45, name: "Oxigenio" },
            { id: 46, name: "Resonita" },
            { id: 34, name: "Rubí", source: "Tortuga (Bohr)" },
            { id: 52, name: "Singularita" },
            { id: 37, name: "Sugilita" },
            { id: 131, name: "Titanio" }
        ]
    },
    {
        category: "Artefactos",
        description: "Se encuentran en grietas y flores de los planetas Bohr, Galea y Hafnir. Algunos como cráneos y huesos se obtienen pescando en Hafnir.",
        items: [
            { id: 155, name: "Acompañante de Baño", planet: "Bohr" },
            { id: 143, name: "Anillo Oxidado", planet: "Terbin" },
            { id: 149, name: "Cabeza Desenterrada", planet: "Terbin" },
            { id: 142, name: "Cráneo Desconocido", source: "Pesca (Hafnir)" },
            { id: 144, name: "Cuchilla Roma" },
            { id: 139, name: "Estatua Religiosa", planet: "Hafnir" },
            { id: 141, name: "Hueso Desconocido", source: "Pesca (Hafnir)" },
            { id: 162, name: "Instrumento para Viajes Temporales", planet: "Bohr" },
            { id: 156, name: "Liberador de la Ruina", planet: "Bohr" },
            { id: 140, name: "Máscara de Piedra", planet: "Hafnir" },
            { id: 148, name: "Controlador del Entretenimiento", planet: "Goddol" },
            { id: 159, name: "Palanca de la Diversión", planet: "Goddol" },
            { id: 157, name: "Reductor de Visión Metalizado", planet: "Galea" },
            { id: 152, name: "Reproductor de Melodías Arcaicas", planet: "Terbin" },
            { id: 154, name: "Reto Imposible", planet: "Galea" },
            { id: 134, name: "Tabla de Piedra 2", planet: "Hafnir" },
            { id: 135, name: "Tabla de Piedra 3", planet: "Hafnir" },
            { id: 136, name: "Tabla de Piedra 4", planet: "Hafnir" },
            { id: 137, name: "Tabla de Piedra 5", planet: "Hafnir" },
            { id: 138, name: "Tinaja Antigua", planet: "Hafnir" }
        ]
    },
    {
        category: "Insectos",
        description: "Fauna natural de cada planeta. La mayoría se pueden comprar al Vendedor Ambulante.",
        items: [
            { id: 102, name: "Araña Colorida", planet: "Galea" },
            { id: 113, name: "Avispa Vanadia", planet: "Vanadia" },
            { id: 108, name: "Bateria", planet: "Terbin" },
            { id: 98, name: "Bicho Burbuja", planet: "Terbin" },
            { id: 103, name: "Ciempiés Taladro", planet: "Hafnir" },
            { id: 94, name: "Cigarra Diamante", planet: "Hafnir" },
            { id: 106, name: "Cubeliyo", source: "Vendedor" },
            { id: 101, name: "Mosca del Néctar", planet: "Goddol" }, // Extraction says Galea/Goddol
            { id: 92, name: "Mosquito Hinchado", planet: "Bohr" },
            { id: 88, name: "Nebuposa", planet: "Goddol" },
            { id: 95, name: "Ninfa Azabache", planet: "Bohr" },
            { id: 111, name: "Niroide", planet: "Hafnir" },
            { id: 91, name: "Polilla de Algodón", planet: "Terbin" },
            { id: 105, name: "Salta-Lunas", planet: "Goddol" },
            { id: 110, name: "Slugra", source: "Vendedor" },
            { id: 93, name: "Tintinojo", planet: "Terbin" },
            { id: 104, name: "Tricacio", planet: "Galea" },
            { id: 112, name: "Vorgolia", planet: "Terbin" }
        ]
    },
    {
        category: "Peces",
        description: "Fauna acuática vinculada a sus respectivos planetas. Muchos son comprables al Vendedor Ambulante.",
        items: [
            { id: 75, name: "Alguila", source: "Vendedor" },
            { id: 79, name: "Butanco", source: "Vendedor" },
            { id: 67, name: "Caballito Magmático", source: "Vendedor" },
            { id: 62, name: "Caracol de Mar", source: "Vendedor" },
            { id: 61, name: "Clisea", source: "Vendedor" },
            { id: 78, name: "Cristarma", source: "Vendedor" },
            { id: 84, name: "Escairón", source: "Vendedor" },
            { id: 81, name: "Esturión Erizo", source: "Vendedor" },
            { id: 74, name: "Geodautilo", planet: "Hafnir" },
            { id: 72, name: "Magmamar", source: "Vendedor" },
            { id: 60, name: "Medusa Linterna", planet: "Bohr" },
            { id: 83, name: "Nemorquina", source: "Vendedor" },
            { id: 80, name: "Opabinia", source: "Vendedor" },
            { id: 82, name: "Pez Cola de Fuego", source: "Vendedor" },
            { id: 85, name: "Pez Hada", planet: "Bohr" },
            { id: 59, name: "Pez Pato", planet: "Galea" },
            { id: 70, name: "Pulpunk", source: "Vendedor" },
            { id: 57, name: "Rogoluz", source: "Vendedor" },
            { id: 77, name: "Skupo", planet: "Granja" },
            { id: 69, name: "Tiburón Caña", source: "Vendedor" },
            { id: 71, name: "Tiburón de Obsidiana", source: "Vendedor" },
            { id: 64, name: "Tilipio", planet: "Galea" },
            { id: 65, name: "Trucha Troyana", source: "Vendedor" }
        ]
    }
];
