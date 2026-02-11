
import React from 'react';
import { Quiz } from '../../../../types';
import { Brain, Plus } from 'lucide-react';

interface Props {
  quiz: Quiz | undefined;
  onChange: (quiz: Quiz | undefined) => void;
}

export const QuizTab: React.FC<Props> = ({ quiz, onChange }) => {
  return (
    <div className="text-center py-12 text-gray-500 border border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center">
      <Brain size={32} className="mx-auto mb-3 opacity-50"/>
      <p className="text-sm font-bold">Quiz Manager</p>
      <p className="text-xs text-gray-600 mt-1 max-w-xs">Create multiple choice questions to test student knowledge.</p>
      
      {!quiz ? (
        <button 
          onClick={() => onChange({ id: 'q-'+Date.now(), title: 'New Quiz', questions: [] })}
          className="mt-6 btn-secondary text-xs flex items-center gap-2"
        >
          <Plus size={14} /> Create Quiz
        </button>
      ) : (
        <div className="mt-6 space-y-2">
           <div className="text-green-500 font-bold text-sm">Quiz Active: {quiz.title}</div>
           <button className="btn-secondary text-xs">Edit Questions ({quiz.questions.length})</button>
        </div>
      )}
    </div>
  );
};
