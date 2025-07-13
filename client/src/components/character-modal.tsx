import { Button } from "@/components/ui/button";
import { type Character } from "@shared/schema";

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
}

export function CharacterModal({ character, onClose }: CharacterModalProps) {
  const formatAge = (createdAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(createdAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'}`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      return 'Just born';
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-30">
      <div className="bg-white border-4 border-black p-6 max-w-sm">
        <div className="font-mono">
          <div className="text-lg font-bold mb-4">
            {character.name || 'Unnamed Being'}
          </div>
          <div className="space-y-2 text-sm">
            <div>Creator: <span>{character.creator}</span></div>
            <div>Current Zone: <span>{character.currentZone}</span></div>
            <div>Shape: <span>{character.shape}</span></div>
            <div>Color: <span>{character.color}</span></div>
            <div>Size: <span>{character.size}</span></div>
            <div>Age: <span>{formatAge(character.createdAt)}</span></div>
            <div className="border-t border-black pt-2 mt-3">
              <div className="font-bold mb-1">Journey:</div>
              <div className="text-xs space-y-1">
                <div>• Born in {character.currentZone}</div>
                <div>• Exploring the digital realm</div>
                <div>• Seeking connections</div>
              </div>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  );
}
