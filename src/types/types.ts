export interface GameSaveData {
  [x: string]: any;
  settings?: SettingsData; // Opcional: algunos saves lo tienen, otros no
  gameData: GameData;
  versionSaveNumber: number;
}

export interface SettingsData {
  generalVolume: number;
  musicVolume: number;
  soundVolume: number;
  fullscreen: boolean;
  graphics: number;
  language: number;
  uiBigMode: boolean;
}

export interface GameData {
  currentSlot: number;
  slotData: SlotData[];
}

// === SlotData ===
export interface SlotData {
  hasData: boolean;
  granjaFirstTime: boolean;
  mineBohrFirstTime: boolean;
  houseFarmEntered: boolean;
  currentLevel: number;
  houseTreasurePicked: boolean;
  currentSeason: number;
  selectedChar: number;
  playerName: string;
  farmName: string;
  credits: number;
  acumulatedCredits?: number;
  colorPalette: ColorRGB[];
  passOut: boolean;
  spawnTag: string;
  currentEnergyLevel: number;
  robotName: string;
  robotTutorialCompleted: boolean;
  alreadyTalked: boolean;
  spareCrafted: boolean;
  spaceShipCurrentEnergy: number;
  spaceShipAvailableCells: number;
  spaceShipActiveCells: number;
  shipParts: ShipPartProgress[];
  shipCurrentDecorationIndex: number;
  obtainedDecorations: number[];
  wakeUpFromShip: boolean;
  currentDay: number;
  currentYear: number;
  farmTiles: FarmTile[];
  wateredTiles: number[];
  plantSaves: any[]; // Puedes definir mejor si lo necesitas
  granjaWorldItems: any[];
  placeableItems: PlaceableItem[];
  granjaSmallResources: WorldResource[];
  granjaBigResources: WorldResource[];
  savedTreeData: SavedTreeLevel[];
  sprinklerPlantSaves: any[];
  inventorySaveItems: ItemSlot[];
  shipInventorySaveItems: ItemSlot[];
  chestSlots: ChestSlot[];
  flaggedEvents: FlaggedEvent[];
  savedOneTimeCompletedIDs: number[];
  bohrTPStatus: boolean[];
  arcaItemsDiscovered: number[];
  arcaRewardData: ArcaReward[];
  arcaPendingItems: any[];
  arcaCurrentLevel: number;
  arcaCurrentProgress: number;
  vegetablesItemsActive: boolean;
  insectsActive: boolean;
  artifactsActive: boolean;
  mineralsActive: boolean;
  fishesActive: boolean;
  robeetData: RobeetData;
  robeetCollectedData: RobeetCollected[];
  uniqueItemsSold: number[];
  obtainedChipsIDs: number[];
  alreadyCraftedUniqueItems: number[];
  hatchetLevel: number;
  pickaxeLevel: number;
  sickleLevel: number;
  hoeLevel: number;
  wateringCanLevel: number;
  achievementsUnlocked: number[];
  creditsObtained: number;
  currentHouseLevel: number;
  housingStarterKitSpawned: boolean;
  npcSavedDataList: NPCSavedData[];
  mailList: MailData[];
  bufferedMailList: MailData[];
  historicMailList: MailData[];
  hafnirTPStatus: boolean[];
}

// === Tipos auxiliares ===
export interface ColorRGB {
  R: number;
  G: number;
  B: number;
}

export interface ShipPartProgress {
  shipPart: number;
  currentProgress: number;
}

export interface FarmTile {
  hasPlant: boolean;
  x: number;
  y: number;
  z: number;
}

export interface PlaceableItem {
  itemID: number;
  uniqueID: number;
  x: number;
  y: number;
  z: number;
  side: number;
}

export interface WorldResource {
  worldResourceID: number;
  x: number;
  y: number;
  z: number;
  spriteIndex: number;
}

export interface SavedTreeLevel {
  levelName: string;
  resourceID: number;
  worldTreeSaves: TreeSave[];
  stumpsSaves: any[]; // Puedes definir si es necesario
}

export interface TreeSave {
  resourceID: number;
  currentPR: number;
  treeStage: number;
  x: number;
  y: number;
  z: number;
}

export interface ItemSlot {
  itemID: number;
  amount: number;
  isEmpty: boolean;
  isLocked?: boolean;
}

export interface ChestSlot {
  furnitureID: number;
  x: number;
  y: number;
  z: number;
  itemsID: number[];
  itemsAmount: number[];
}

export interface FlaggedEvent {
  ID: number;
  flagged: boolean;
  completed: boolean;
  hasDependency: boolean;
  dependencyID: number;
}

export interface ArcaReward {
  percent: number;
  itemID: number;
  rewardAmount: number;
  isRewardObtained: boolean;
}

export interface RobeetData {
  totalRobeetCount: number;
  totalEnergyUpgradeAmount: number;
  areRobeetsActive: boolean;
  isCianRobeetInHouse: boolean;
  isYellowRobeetInHouse: boolean;
  isGreenRobeetInHouse: boolean;
  cianCount: number;
  wateringCount: number;
  wateredIDs: number[];
  allCropsWatered: boolean;
  hasPlantDied: boolean;
  isWateringCanMaxUpgraded: boolean;
  yellowCount: number;
  cropsCount: number;
  cropsIDs: number[];
  allCropsCollected: boolean;
  moneyMadeWithCrops: number;
  isSickleMaxUpgraded: boolean;
  redCount: number;
  snailCount: number;
  bunnyCount: number;
  eggsCount: number;
  hasOneOfEverything: boolean;
  hasTwentyFiveOfEverything: boolean;
  darkBlueCount: number;
  fishCount: number;
  firstTimeMidRodUsed: boolean;
  firstTimeMaxRodUsed: boolean;
  fishFailedTimes: number;
  fishIDs: number[];
  allFishesCaught: boolean;
  orangeCount: number;
  bugCount: number;
  firstTimeMidNetUsed: boolean;
  firstTimeMaxNetUsed: boolean;
  bugIDs: number[];
  allBugsCaught: boolean;
  bugFailedTimes: number;
  greenCount: number;
  brokenSticks: number;
  cutTrees: number;
  isHouseUpgraded: boolean;
  isAxeMaxUpgraded: boolean;
  blackCount: number;
  brokenRocks: number;
  brokenBigRocks: number;
  isPickaxeMaxUpgraded: boolean;
  purpleCount: number;
  brokenMinerals: number;
  brokenGemstones: number;
  bohrMaxDepthReached: boolean;
  hafnirMaxDepthReached: boolean;
  darmstadMaxDepthReached: boolean;
  pinkCount: number;
  FarmPlanetChecked: boolean;
  bohrChecked: boolean;
  terbinChecked: boolean;
  galeaChecked: boolean;
  gadolChecked: boolean;
  hafnirChecked: boolean;
  darmstadChecked: boolean;
  vanadianChecked: boolean;
  ID: number;
}

export interface RobeetCollected {
  ID: number;
  obtained: boolean;
}

export interface NPCSavedData {
  currentNPCLevel: number;
  currentNPCRP: number;
  itemsGifted: number[];
}

export interface MailData {
  mailID: number;
  mailFrom: string;
  mailText: string;
  hasItems: boolean;
  opened: boolean;
  isImportant: boolean;
}




export interface ToolLevel {
  level: number;
  title: string;
  img: string;
  effects: string[];
  requirements: Requirement[];
}

export interface Requirement {
  item: string;
  amount: string;
  source?: string;
  id?: number;
}


// === GUIAS ===

export interface ToolGuide {
  [toolName: string]: ToolLevel[];
}

export interface SeasonGuide {
  season: string;
  title: string;
  intro: string;
  plants: Plant[];
  bestOptions: BestOption[];
}

export interface Plant {
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

export interface BestOption {
  name: string;
  valorCultivo: string | number;
  cosechasPorEstacion: number;
  valorTotal: number;
  diasSobrantes: number;
  nota?: string;
}

// === Items from items.json ===
export interface ItemDetail {
  id: number;
  name: string;
  procesar?: string;
  type?: string;
  get?: string;
  description?: string;
  planet?: string;
}