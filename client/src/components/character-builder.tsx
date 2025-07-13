import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type InsertCharacter } from "@shared/schema";

const SHAPES = [
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'diamond', label: 'Diamond' },
];

const COLORS = [
  '#000000', '#666666', '#999999', '#cccccc',
  '#333333', '#777777', '#bbbbbb', '#eeeeee'
];

const SIZES = [
  { id: 'small', label: 'S' },
  { id: 'medium', label: 'M' },
  { id: 'large', label: 'L' },
];

const ZONES = ['FOREST', 'PLAZA', 'COAST', 'MEADOW', 'SHRINE'];

export function CharacterBuilder() {
  const [selectedShape, setSelectedShape] = useState('circle');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [characterName, setCharacterName] = useState('');
  const [creator, setCreator] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCharacterMutation = useMutation({
    mutationFn: async (character: InsertCharacter) => {
      const response = await apiRequest('POST', '/api/characters', character);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Being manifested!",
        description: "Your digital being has entered the world.",
      });
      // Reset form
      setCharacterName('');
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
    },
    onError: (error) => {
      toast({
        title: "Manifestation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!creator.trim()) {
      toast({
        title: "Creator name required",
        description: "Please enter your name as the creator.",
        variant: "destructive",
      });
      return;
    }

    const character: InsertCharacter = {
      name: characterName.trim() || undefined,
      creator: creator.trim(),
      shape: selectedShape,
      color: selectedColor,
      size: selectedSize,
      x: 0, // Will be set by server
      y: 0, // Will be set by server
      currentZone: ZONES[Math.floor(Math.random() * ZONES.length)], // Random starting zone
    };

    createCharacterMutation.mutate(character);
  };

  const renderShapePreview = (shape: string) => {
    const baseClasses = "mx-auto";
    switch (shape) {
      case 'circle':
        return <div className={`w-6 h-6 bg-black rounded-full ${baseClasses}`} />;
      case 'square':
        return <div className={`w-6 h-6 bg-black ${baseClasses}`} />;
      case 'triangle':
        return <div className={`w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-transparent border-b-black ${baseClasses} mt-1`} />;
      case 'diamond':
        return <div className={`w-6 h-6 bg-black transform rotate-45 ${baseClasses} mt-3`} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-r-2 border-black p-6 flex flex-col gap-6 overflow-y-auto">
      <div className="border-b-2 border-black pb-4">
        <h1 className="font-mono text-xl font-bold tracking-tight">DIGITAL BEINGS</h1>
        <p className="text-sm mt-2 text-gray-600">A shared space for geometric life</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-mono text-lg font-bold">CREATE BEING</h2>

        {/* Creator Name */}
        <div>
          <Label className="font-mono text-sm font-bold block mb-2">YOUR NAME</Label>
          <Input
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            className="font-mono text-sm border-2 border-black focus:ring-gray-400"
            placeholder="...who creates?"
            maxLength={20}
          />
        </div>

        {/* Shape Selection */}
        <div>
          <Label className="font-mono text-sm font-bold block mb-2">SHAPE</Label>
          <div className="grid grid-cols-4 gap-2">
            {SHAPES.map((shape) => (
              <Button
                key={shape.id}
                variant="outline"
                className={`w-12 h-12 border-2 border-black hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  selectedShape === shape.id ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                onClick={() => setSelectedShape(shape.id)}
              >
                {renderShapePreview(shape.id)}
              </Button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <Label className="font-mono text-sm font-bold block mb-2">COLOR</Label>
          <div className="grid grid-cols-4 gap-2">
            {COLORS.map((color) => (
              <Button
                key={color}
                variant="outline"
                className={`w-12 h-12 border-2 border-black hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  selectedColor === color ? 'ring-4 ring-gray-600' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <Label className="font-mono text-sm font-bold block mb-2">SIZE</Label>
          <div className="flex gap-2">
            {SIZES.map((size) => (
              <Button
                key={size.id}
                variant="outline"
                className={`px-4 py-2 border-2 border-black font-mono text-sm hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  selectedSize === size.id ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                onClick={() => setSelectedSize(size.id)}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <Label className="font-mono text-sm font-bold block mb-2">NAME (OPTIONAL)</Label>
          <Input
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="font-mono text-sm border-2 border-black focus:ring-gray-400"
            placeholder="...whisper a name"
            maxLength={16}
          />
          <div className="text-xs text-gray-500 mt-1">
            {characterName.length}/16
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          disabled={createCharacterMutation.isPending}
          className="w-full py-3 bg-black text-white font-mono text-sm font-bold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {createCharacterMutation.isPending ? 'MANIFESTING...' : 'MANIFEST BEING'}
        </Button>
      </div>

      {/* Hidden Gem: Secret Stats */}
      <div className="mt-6 p-3 border border-gray-300 opacity-70">
        <div className="font-mono text-xs text-gray-600">
          <div>Matcha ceremonies held: 7</div>
          <div>Cats spotted: 23</div>
          <div>Ocean dreams: ∞</div>
        </div>
      </div>
    </div>
  );
}
