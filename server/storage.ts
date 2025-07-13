import { characters, zones, type Character, type InsertCharacter, type Zone, type InsertZone } from "@shared/schema";

export interface IStorage {
  // Characters
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined>;
  deleteCharacter(id: number): Promise<boolean>;
  
  // Zones
  getZones(): Promise<Zone[]>;
  getZone(name: string): Promise<Zone | undefined>;
  createZone(zone: InsertZone): Promise<Zone>;
  
  // Population
  getPopulationByZone(): Promise<Record<string, number>>;
}

export class MemStorage implements IStorage {
  private characters: Map<number, Character>;
  private zones: Map<string, Zone>;
  private currentCharacterId: number;
  private currentZoneId: number;

  constructor() {
    this.characters = new Map();
    this.zones = new Map();
    this.currentCharacterId = 1;
    this.currentZoneId = 1;
    
    // Initialize default zones
    this.initializeZones();
  }

  private async initializeZones() {
    const defaultZones = [
      { name: 'FOREST', x: 0, y: 0, width: 300, height: 300 },
      { name: 'PLAZA', x: 300, y: 0, width: 300, height: 300 },
      { name: 'COAST', x: 0, y: 300, width: 300, height: 300 },
      { name: 'MEADOW', x: 300, y: 300, width: 300, height: 300 },
      { name: 'SHRINE', x: 150, y: 150, width: 200, height: 200 },
    ];

    for (const zone of defaultZones) {
      await this.createZone(zone);
    }
  }

  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentCharacterId++;
    const character: Character = {
      ...insertCharacter,
      id,
      createdAt: new Date(),
    };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updatedCharacter = { ...character, ...updates };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  async deleteCharacter(id: number): Promise<boolean> {
    return this.characters.delete(id);
  }

  async getZones(): Promise<Zone[]> {
    return Array.from(this.zones.values());
  }

  async getZone(name: string): Promise<Zone | undefined> {
    return this.zones.get(name);
  }

  async createZone(insertZone: InsertZone): Promise<Zone> {
    const id = this.currentZoneId++;
    const zone: Zone = { ...insertZone, id };
    this.zones.set(zone.name, zone);
    return zone;
  }

  async getPopulationByZone(): Promise<Record<string, number>> {
    const population: Record<string, number> = {};
    const characters = await this.getCharacters();
    
    // Initialize all zones with 0
    const zones = await this.getZones();
    zones.forEach(zone => {
      population[zone.name] = 0;
    });
    
    // Count characters in each zone
    characters.forEach(character => {
      population[character.currentZone] = (population[character.currentZone] || 0) + 1;
    });
    
    return population;
  }
}

export const storage = new MemStorage();
