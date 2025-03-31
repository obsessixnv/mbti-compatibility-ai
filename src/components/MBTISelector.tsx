import React from 'react';

type MBTISelectorProps = {
  label: string;
  selectedType: string | null;
  onSelect: (value: string) => void;
};

// MBTI types organized by categories
const mbtiGroups = [
  { name: 'Analysts', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] },
  { name: 'Diplomats', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] },
  { name: 'Sentinels', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] },
  { name: 'Explorers', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] }
];

// Subtle descriptions for each type
const mbtiDescriptions: Record<string, string> = {
  INTJ: 'Architect', INTP: 'Logician', ENTJ: 'Commander', ENTP: 'Debater',
  INFJ: 'Advocate', INFP: 'Mediator', ENFJ: 'Protagonist', ENFP: 'Campaigner',
  ISTJ: 'Logistician', ISFJ: 'Defender', ESTJ: 'Executive', ESFJ: 'Consul',
  ISTP: 'Virtuoso', ISFP: 'Adventurer', ESTP: 'Entrepreneur', ESFP: 'Entertainer'
};

// Color associations for each category (simplified)
const groupColors: Record<string, string> = {
  'Analysts': 'from-violet-500 to-indigo-500',
  'Diplomats': 'from-pink-500 to-purple-500',
  'Sentinels': 'from-blue-500 to-indigo-500',
  'Explorers': 'from-amber-500 to-orange-500'
};

export default function MBTISelector({ label, selectedType, onSelect }: MBTISelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-base font-medium mb-3">
        {label}
      </label>
      
      <div className="space-y-4">
        {mbtiGroups.map((group) => (
          <div key={group.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`h-0.5 w-6 bg-gradient-to-r ${groupColors[group.name]}`}></div>
              <h3 className="text-xs uppercase tracking-wide font-medium opacity-70">
                {group.name}
              </h3>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {group.types.map((type) => (
                <button
                  key={type}
                  className={`mbti-button ${
                    selectedType === type ? 'mbti-button-selected' : ''
                  }`}
                  onClick={() => onSelect(type)}
                  title={mbtiDescriptions[type]}
                >
                  <div className="flex flex-col justify-center items-center py-1">
                    <span className="font-medium">{type}</span>
                    <span className="text-xs mt-0.5 font-normal opacity-75">{mbtiDescriptions[type]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 