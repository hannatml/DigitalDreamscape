import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CharacterBuilder } from "@/components/character-builder";
import { WorldCanvas } from "@/components/world-canvas";
import { useWebSocket } from "@/hooks/use-websocket";
import { type Character, type WSMessage } from "@shared/schema";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [population, setPopulation] = useState<Record<string, number>>({});

  const { data: initialCharacters } = useQuery({
    queryKey: ['/api/characters'],
  });

  const { data: initialPopulation } = useQuery({
    queryKey: ['/api/population'],
  });

  // Initialize state with fetched data
  useState(() => {
    if (initialCharacters) {
      setCharacters(initialCharacters);
    }
    if (initialPopulation) {
      setPopulation(initialPopulation);
    }
  });

  const handleWebSocketMessage = useCallback((message: WSMessage) => {
    switch (message.type) {
      case 'character_created':
        setCharacters(prev => [...prev, message.character]);
        break;
      case 'character_moved':
        setCharacters(prev => 
          prev.map(char => 
            char.id === message.character.id ? message.character : char
          )
        );
        break;
      case 'characters_update':
        setCharacters(message.characters);
        break;
      case 'population_update':
        setPopulation(message.population);
        break;
    }
  }, []);

  const { isConnected } = useWebSocket(handleWebSocketMessage);

  return (
    <div className="flex h-screen">
      <CharacterBuilder />
      <WorldCanvas characters={characters} population={population} />
      
      {/* Connection indicator */}
      <div className={`fixed bottom-4 right-4 px-2 py-1 text-xs font-mono border ${
        isConnected 
          ? 'bg-green-100 border-green-400 text-green-800' 
          : 'bg-red-100 border-red-400 text-red-800'
      }`}>
        {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
      </div>
    </div>
  );
}
