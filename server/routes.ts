import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertCharacterSchema, type WSMessage } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  // Broadcast to all connected clients
  function broadcast(message: WSMessage) {
    const messageStr = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  // WebSocket connection handling
  wss.on('connection', async (ws) => {
    clients.add(ws);
    
    // Send current state to new client
    const characters = await storage.getCharacters();
    const population = await storage.getPopulationByZone();
    
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'characters_update', characters }));
      ws.send(JSON.stringify({ type: 'population_update', population }));
    }

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Character migration system
  setInterval(async () => {
    const characters = await storage.getCharacters();
    const zones = await storage.getZones();
    
    for (const character of characters) {
      // Simple migration logic - characters occasionally move to adjacent zones
      if (Math.random() < 0.1) { // 10% chance per interval
        const currentZone = zones.find(z => z.name === character.currentZone);
        if (currentZone) {
          // Pick a random zone (simplified - in reality would be based on proximity)
          const newZone = zones[Math.floor(Math.random() * zones.length)];
          if (newZone.name !== character.currentZone) {
            // Calculate new position within the zone
            const newX = newZone.x + Math.random() * newZone.width;
            const newY = newZone.y + Math.random() * newZone.height;
            
            const updatedCharacter = await storage.updateCharacter(character.id, {
              currentZone: newZone.name,
              x: newX,
              y: newY,
            });
            
            if (updatedCharacter) {
              broadcast({ type: 'character_moved', character: updatedCharacter });
            }
          }
        }
      }
    }
    
    // Update population counts
    const population = await storage.getPopulationByZone();
    broadcast({ type: 'population_update', population });
  }, 5000); // Every 5 seconds

  // REST API routes
  app.get('/api/characters', async (req, res) => {
    const characters = await storage.getCharacters();
    res.json(characters);
  });

  app.get('/api/characters/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const character = await storage.getCharacter(id);
    
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    res.json(character);
  });

  app.post('/api/characters', async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      
      // Assign random position within the starting zone
      const zones = await storage.getZones();
      const startingZone = zones.find(z => z.name === validatedData.currentZone) || zones[0];
      
      const characterData = {
        ...validatedData,
        x: startingZone.x + Math.random() * startingZone.width,
        y: startingZone.y + Math.random() * startingZone.height,
      };
      
      const character = await storage.createCharacter(characterData);
      
      // Broadcast new character to all clients
      broadcast({ type: 'character_created', character });
      
      // Update population
      const population = await storage.getPopulationByZone();
      broadcast({ type: 'population_update', population });
      
      res.status(201).json(character);
    } catch (error) {
      res.status(400).json({ message: 'Invalid character data', error });
    }
  });

  app.get('/api/zones', async (req, res) => {
    const zones = await storage.getZones();
    res.json(zones);
  });

  app.get('/api/population', async (req, res) => {
    const population = await storage.getPopulationByZone();
    res.json(population);
  });

  return httpServer;
}
