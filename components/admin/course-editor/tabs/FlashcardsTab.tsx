
import React from 'react';
import { Flashcard } from '../../../../types';
import { Zap, Plus } from 'lucide-react';

interface Props {
  flashcards: Flashcard[] | undefined;
  onChange: (cards: Flashcard[]) => void;
}

export const FlashcardsTab: React.FC<Props> = ({ flashcards, onChange }) => {
  return (
    <div className="text-center py-12 text-gray-500 border border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center">
      <Zap size={32} className="mx-auto mb-3 opacity-50"/>
      <p className="text-sm font-bold">Flashcards & Ads</p>
      <p className="text-xs text-gray-600 mt-1 max-w-xs">Add quick revision cards or promotional content for this lesson.</p>
      
      <button className="mt-6 btn-secondary text-xs flex items-center gap-2">
        <Plus size={14} /> Add Card
      </button>
      
      {flashcards && flashcards.length > 0 && (
         <p className="mt-4 text-xs text-gray-400">{flashcards.length} cards in deck.</p>
      )}
    </div>
  );
};
