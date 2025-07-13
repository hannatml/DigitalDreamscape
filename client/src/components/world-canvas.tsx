import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Character, type Zone } from "@shared/schema";
import { CharacterModal } from "./character-modal";

interface WorldCanvasProps {
  characters: Character[];
  population: Record<string, number>;
}

export function WorldCanvas({ characters, population }: WorldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);

  const { data: zonesData } = useQuery({
    queryKey: ['/api/zones'],
  });

  useEffect(() => {
    if (zonesData) {
      setZones(zonesData);
    }
  }, [zonesData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.strokeStyle = '#f5f5f5';
    ctx.lineWidth = 1;
    const gridSize = 60;

    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw zone labels
    ctx.fillStyle = '#e5e5e5';
    ctx.font = '10px ui-monospace, monospace';
    
    zones.forEach(zone => {
      const x = (zone.x / 600) * canvas.width + 20;
      const y = (zone.y / 600) * canvas.height + 30;
      ctx.fillText(zone.name, x, y);
    });

    // Draw characters
    characters.forEach(character => {
      const x = (character.x / 600) * canvas.width;
      const y = (character.y / 600) * canvas.height;
      
      ctx.fillStyle = character.color;
      
      const sizeMultiplier = character.size === 'small' ? 0.7 : character.size === 'large' ? 1.3 : 1;
      const baseSize = 12 * sizeMultiplier;

      switch (character.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(x, y, baseSize / 2, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(x - baseSize / 2, y - baseSize / 2, baseSize, baseSize);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(x, y - baseSize / 2);
          ctx.lineTo(x - baseSize / 2, y + baseSize / 2);
          ctx.lineTo(x + baseSize / 2, y + baseSize / 2);
          ctx.closePath();
          ctx.fill();
          break;
        case 'diamond':
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-baseSize / 2, -baseSize / 2, baseSize, baseSize);
          ctx.restore();
          break;
      }
    });
  }, [characters, zones]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Find clicked character
    const clickedCharacter = characters.find(character => {
      const x = (character.x / 600) * canvas.width;
      const y = (character.y / 600) * canvas.height;
      const sizeMultiplier = character.size === 'small' ? 0.7 : character.size === 'large' ? 1.3 : 1;
      const baseSize = 12 * sizeMultiplier;
      
      const distance = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
      return distance <= baseSize / 2 + 5; // Add some tolerance
    });

    if (clickedCharacter) {
      setSelectedCharacter(clickedCharacter);
    }
  };

  const totalPopulation = Object.values(population).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <div className="flex-1 relative bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
        />

        {/* Population Counter */}
        <div className="absolute top-6 right-6 bg-white border-2 border-black p-4 font-mono text-sm z-20">
          <div className="font-bold mb-2">POPULATION</div>
          <div className="space-y-1">
            {Object.entries(population).map(([zone, count]) => (
              <div key={zone}>
                {zone}: <span>{count}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-black mt-2 pt-2 font-bold">
            Total: <span>{totalPopulation}</span>
          </div>
        </div>

        {/* Hidden Gem: Ghibli Easter Egg */}
        <div className="absolute bottom-10 left-10 opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
          <div className="font-mono text-xs text-gray-400">...a small soot sprite watches...</div>
        </div>
      </div>

      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </>
  );
}
