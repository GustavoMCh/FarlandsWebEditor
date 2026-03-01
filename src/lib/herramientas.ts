// src/lib/herramientas.ts
export type ToolName = keyof typeof toolUpgradeGuides;

export const toolUpgradeGuides = {
  "Pico": [
    {
      level: 1,
      title: "Mejora 1",
      img: "/static/items/Item_244.png",
      effects: [
        "Rango: Incrementa el rango de picado de 1 casilla a 3 casillas.",
        "Piedras: Disminuye los picados, pasa de 2 picadas a 1 picada.",
        "Minerales: Disminuye los picados, pasa de 3 picadas a 2 picadas.",
        "Rocas Grandes: Disminuye los picados, pasa de 24 picadas a 12 picadas."
      ],
      requirements: [
        { item: "Dinero", amount: "500g" },
        { id: 55, item: "Celestio", amount: "5 unidades", source: "Mina de Bohr - Todos los Niveles. Mina de Hafnir - Todos los Niveles. Comprando de Te’Kragh por 30g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 117, item: "Madera Galeana", amount: "10 unidades", source: "Talando árboles galeanos, tocones galeanos, leños galeanos en el Planeta Galea. Comprando de Grubert por 25g cada uno." }
      ]
    },
    {
      level: 2,
      title: "Mejora 2",
      img: "/static/items/Item_245.png",
      effects: [
        "Rango: Incrementa el rango de picado de 3 casillas a 6 casillas.",
        "Piedras: Ahora todas las piedras se rompen con 1 picada.",
        "Minerales: Disminuye los picados, pasa de 2 picadas a 1 picada.",
        "Rocas Grandes: Disminuye los picados, pasa de 12 picadas a 8 picadas."
      ],
      requirements: [
        { item: "Dinero", amount: "2.000g" },
        { id: 19, item: "Plata", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Comprando de Gorg por 100g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 125, item: "Madera de Palmera", amount: "10 unidades", source: "Comprando de Grubert por 50g cada uno." }
      ]
    },
    {
      level: 3,
      title: "Mejora 3",
      img: "/static/items/Item_246.png",
      effects: [
        "Rango: Incrementa el rango de picado de 6 casillas a 9 casillas.",
        "Piedras: Se mantiene la mejora de que se rompen en 1 picada.",
        "Minerales: Se mantiene la mejora de que se rompen en 1 picada.",
        "Rocas Grandes: Disminuye los picados, pasa de 8 picadas a 5 picadas."
      ],
      requirements: [
        { item: "Dinero", amount: "5.000g" },
        { id: 41, item: "Cronio", amount: "15 unidades", source: "Mina de Hafnir - Nivel 41 al 100. Comprando de Te’Kragh por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 332, item: "Madera Goddolita", amount: "10 unidades", source: "Talando leños goddolita en el Planeta Goddol. Comprando de Grubert por 100g cada uno." },
        { id: 7, item: "Madera", amount: "8 unidades", source: "Talando árboles normales o leños normales en la granja. Comprando de Grubert por 10g cada uno." }
      ]
    },
    {
      level: 4,
      title: "Mejora 4",
      img: "/static/items/Item_247.png",
      effects: [
        "Rango: Incrementa el rango de picado de 9 casillas a 25 casillas.",
        "Piedras: Se mantiene la mejora de que se rompen en 1 picada.",
        "Minerales: Se mantiene la mejora de que se rompen en 1 picada.",
        "Rocas Grandes: Disminuye los picados, pasa de 8 picadas a 4 picadas."
      ],
      requirements: [
        { item: "Dinero", amount: "50.000g" },
        { id: 43, item: "Mitrilo", amount: "25 unidades", source: "Comprando de Te’Kragh por 200g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 42, item: "Oro", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Mina de Hafnir - Nivel 1 al 40. Comprando de Gorg por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." }
      ]
    }
  ],
  "Hacha": [
    {
      level: 1,
      title: "Mejora 1",
      img: "/static/items/Item_240.png",
      effects: [
        "Árboles: Disminuye los golpes, pasa de 21 golpes a 16 golpes.",
        "Tocones: No puede romper tocones aún."
      ],
      requirements: [
        { item: "Dinero", amount: "500g" },
        { id: 55, item: "Celestio", amount: "5 unidades", source: "Mina de Bohr - Todos los Niveles. Mina de Hafnir - Todos los Niveles. Comprando de Te’Kragh por 30g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 117, item: "Madera Galeana", amount: "10 unidades", source: "Talando árboles galeanos, tocones galeanos, leños galeanos en el Planeta Galea. Comprando de Grubert por 25g cada uno." }
      ]
    },
    {
      level: 2,
      title: "Mejora 2",
      img: "/static/items/Item_241.png",
      effects: [
        "Árboles: Disminuye los golpes, pasa de 16 golpes a 11 golpes.",
        "Tocones: Ahora se pueden romper tocones con 10 golpes."
      ],
      requirements: [
        { item: "Dinero", amount: "2.000g" },
        { id: 19, item: "Plata", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Comprando de Gorg por 100g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 125, item: "Madera de Palmera", amount: "10 unidades", source: "Comprando de Grubert por 50g cada uno." }
      ]
    },
    {
      level: 3,
      title: "Mejora 3",
      img: "/static/items/Item_242.png",
      effects: [
        "Árboles: Disminuye los golpes, pasa de 11 golpes a 7 golpes.",
        "Tocones: Disminuye los golpes, pasa de 10 golpes a 7 golpes."
      ],
      requirements: [
        { item: "Dinero", amount: "5.000g" },
        { id: 41, item: "Cronio", amount: "15 unidades", source: "Mina de Hafnir - Nivel 41 al 100. Comprando de Te’Kragh por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 332, item: "Madera Goddolita", amount: "10 unidades", source: "Talando leños goddolita en el Planeta Goddol. Comprando de Grubert por 100g cada uno." },
        { id: 7, item: "Madera", amount: "8 unidades", source: "Talando árboles normales o leños normales en la granja. Comprando de Grubert por 10g cada uno." }
      ]
    },
    {
      level: 4,
      title: "Mejora 4",
      img: "/static/items/Item_243.png",
      effects: [
        "Árboles: Disminuye los golpes, pasa de 7 golpes a 5 golpes.",
        "Tocones: Disminuye los golpes, pasa de 7 golpes a 4 golpes."
      ],
      requirements: [
        { item: "Dinero", amount: "50.000g" },
        { id: 43, item: "Mitrilo", amount: "25 unidades", source: "Comprando de Te’Kragh por 200g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 42, item: "Oro", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Mina de Hafnir - Nivel 1 al 40. Comprando de Gorg por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." }
      ]
    }
  ],
  "Azada": [
    {
      level: 1,
      title: "Mejora 1",
      img: "/static/items/Item_248.png",
      effects: ["Incrementa el rango de arado de 1 casilla a 3 casillas."],
      requirements: [
        { item: "Dinero", amount: "500g" },
        { id: 55, item: "Celestio", amount: "5 unidades", source: "Mina de Bohr - Todos los Niveles. Mina de Hafnir - Todos los Niveles. Comprando de Te’Kragh por 30g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 117, item: "Madera Galeana", amount: "10 unidades", source: "Talando árboles galeanos, tocones galeanos, leños galeanos en el Planeta Galea. Comprando de Grubert por 25g cada uno." }
      ]
    },
    {
      level: 2,
      title: "Mejora 2",
      img: "/static/items/Item_249.png",
      effects: ["Incrementa el rango de arado de 3 casillas a 6 casillas."],
      requirements: [
        { item: "Dinero", amount: "2.000g" },
        { id: 19, item: "Plata", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Comprando de Gorg por 100g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 125, item: "Madera de Palmera", amount: "10 unidades", source: "Comprando de Grubert por 50g cada uno." }
      ]
    },
    {
      level: 3,
      title: "Mejora 3",
      img: "/static/items/Item_250.png",
      effects: ["Incrementa el rango de arado de 6 casillas a 9 casillas."],
      requirements: [
        { item: "Dinero", amount: "5.000g" },
        { id: 41, item: "Cronio", amount: "15 unidades", source: "Mina de Hafnir - Nivel 41 al 100. Comprando de Te’Kragh por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 332, item: "Madera Goddolita", amount: "10 unidades", source: "Talando leños goddolita en el Planeta Goddol. Comprando de Grubert por 100g cada uno." },
        { id: 7, item: "Madera", amount: "8 unidades", source: "Talando árboles normales o leños normales en la granja. Comprando de Grubert por 10g cada uno." }
      ]
    },
    {
      level: 4,
      title: "Mejora 4",
      img: "/static/items/Item_251.png",
      effects: ["Incrementa el rango de arado de 9 casillas a 25 casillas."],
      requirements: [
        { item: "Dinero", amount: "50.000g" },
        { id: 43, item: "Mitrilo", amount: "25 unidades", source: "Comprando de Te’Kragh por 200g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 42, item: "Oro", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Mina de Hafnir - Nivel 1 al 40. Comprando de Gorg por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." }
      ]
    }
  ],
  "Hoz": [
    {
      level: 1,
      title: "Mejora 1",
      img: "/static/items/Item_252.png",
      effects: ["Incrementa el rango de corte de 1 casilla a 3 casillas."],
      requirements: [
        { item: "Dinero", amount: "500g" },
        { id: 55, item: "Celestio", amount: "5 unidades", source: "Mina de Bohr - Todos los Niveles. Mina de Hafnir - Todos los Niveles. Comprando de Te’Kragh por 30g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 117, item: "Madera Galeana", amount: "10 unidades", source: "Talando árboles galeanos, tocones galeanos, leños galeanos en el Planeta Galea. Comprando de Grubert por 25g cada uno." }
      ]
    },
    {
      level: 2,
      title: "Mejora 2",
      img: "/static/items/Item_253.png",
      effects: ["Incrementa el rango de corte de 3 casillas a 6 casillas."],
      requirements: [
        { item: "Dinero", amount: "2.000g" },
        { id: 19, item: "Plata", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Comprando de Gorg por 100g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 125, item: "Madera de Palmera", amount: "10 unidades", source: "Comprando de Grubert por 50g cada uno." }
      ]
    },
    {
      level: 3,
      title: "Mejora 3",
      img: "/static/items/Item_254.png",
      effects: ["Incrementa el rango de corte de 6 casillas a 9 casillas."],
      requirements: [
        { item: "Dinero", amount: "5.000g" },
        { id: 41, item: "Cronio", amount: "15 unidades", source: "Mina de Hafnir - Nivel 41 al 100. Comprando de Te’Kragh por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 332, item: "Madera Goddolita", amount: "10 unidades", source: "Talando leños goddolita en el Planeta Goddol. Comprando de Grubert por 100g cada uno." },
        { id: 7, item: "Madera", amount: "8 unidades", source: "Talando árboles normales o leños normales en la granja. Comprando de Grubert por 10g cada uno." }
      ]
    },
    {
      level: 4,
      title: "Mejora 4",
      img: "/static/items/Item_255.png",
      effects: ["Incrementa el rango de corte de 9 casillas a 25 casillas."],
      requirements: [
        { item: "Dinero", amount: "50.000g" },
        { id: 43, item: "Mitrilo", amount: "25 unidades", source: "Comprando de Te’Kragh por 200g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 42, item: "Oro", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Mina de Hafnir - Nivel 1 al 40. Comprando de Gorg por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." }
      ]
    }
  ],
  "Caña": [
    {
      level: 1,
      title: 'Proximamente',
      img: "/static/items/Item_378.png",
      effects: ['Proximamente'],
      requirements: []
    },
    {
      level: 2,
      title: 'Proximamente',
      img: "/static/items/Item_379.png",
      effects: ['Proximamente'],
      requirements: []
    }
  ],
  "Red": [
    {
      level: 1,
      img: "/static/items/Item_380.png",
      title: 'Proximamente',
      effects: ['Proximamente'],
      requirements: []
    },
    {
      level: 2,
      img: "/static/items/Item_381.png",
      title: 'Proximamente',
      effects: ['Proximamente'],
      requirements: []
    }
  ],
  "Regadera": [
    {
      level: 1,
      title: "Mejora 1",
      img: "/static/items/Item_256.png",
      effects: ["Incrementa el rango de riego de 1 casilla a 3 casillas."],
      requirements: [
        { item: "Dinero", amount: "500g" },
        { id: 55, item: "Celestio", amount: "5 unidades", source: "Mina de Bohr - Todos los Niveles. Mina de Hafnir - Todos los Niveles. Comprando de Te’Kragh por 30g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 117, item: "Madera Galeana", amount: "10 unidades", source: "Talando árboles galeanos, tocones galeanos, leños galeanos en el Planeta Galea. Comprando de Grubert por 25g cada uno." }
      ]
    },
    {
      level: 2,
      title: "Mejora 2",
      img: "/static/items/Item_257.png",
      effects: ["Incrementa el rango de riego de 3 casillas a 6 casillas."],
      requirements: [
        { item: "Dinero", amount: "2.000g" },
        { id: 19, item: "Plata", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Comprando de Gorg por 100g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 125, item: "Madera de Palmera", amount: "10 unidades", source: "Comprando de Grubert por 50g cada uno." }
      ]
    },
    {
      level: 3,
      title: "Mejora 3",
      img: "/static/items/Item_258.png",
      effects: ["Incrementa el rango de riego de 6 casillas a 9 casillas."],
      requirements: [
        { item: "Dinero", amount: "5.000g" },
        { id: 41, item: "Cronio", amount: "15 unidades", source: "Mina de Hafnir - Nivel 41 al 100. Comprando de Te’Kragh por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 332, item: "Madera Goddolita", amount: "10 unidades", source: "Talando leños goddolita en el Planeta Goddol. Comprando de Grubert por 100g cada uno." },
        { id: 7, item: "Madera", amount: "8 unidades", source: "Talando árboles normales o leños normales en la granja. Comprando de Grubert por 10g cada uno." }
      ]
    },
    {
      level: 4,
      title: "Mejora 4",
      img: "/static/items/Item_259.png",
      effects: ["Incrementa el rango de riego de 9 casillas a 25 casillas."],
      requirements: [
        { item: "Dinero", amount: "50.000g" },
        { id: 43, item: "Mitrilo", amount: "25 unidades", source: "Comprando de Te’Kragh por 200g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." },
        { id: 42, item: "Oro", amount: "10 unidades", source: "Mina de Bohr - Nivel 21 al 50. Mina de Hafnir - Nivel 1 al 40. Comprando de Gorg por 150g cada uno. Comprando del Vendedor Ambulante LarryBarry a un costo de g variable." }
      ]
    }
  ]
};