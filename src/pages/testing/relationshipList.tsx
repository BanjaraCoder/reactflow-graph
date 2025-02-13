import React, { useMemo, useCallback } from 'react';
import { getColorClass } from './colormap';

interface RelationshipListProps {
  relationships: Relationship[];
  onRelationshipSelect: (relationships: string[]) => void;
  selectedRelationships: string[];
}

interface Relationship {
  source: string;
  type: string;
  target: string;
}

const RelationshipList: React.FC<RelationshipListProps> = ({
  relationships,
  onRelationshipSelect,
  selectedRelationships,
}) => {
  const filteredRelationships = useMemo(() => {
    if (selectedRelationships.length === 0) return relationships;
    const lastRelationship = selectedRelationships[selectedRelationships.length - 1];
    const [, , lastTarget] = lastRelationship.split(' - ');
    return relationships.filter((rel) => rel.source === lastTarget);
  }, [selectedRelationships, relationships]);

  const handleRelationshipClick = useCallback((relationship: string) => {
    const newSelectedRelationships = selectedRelationships.includes(relationship)
      ? selectedRelationships.slice(0, selectedRelationships.indexOf(relationship) + 1)
      : [...selectedRelationships, relationship];
    onRelationshipSelect(newSelectedRelationships);
  }, [selectedRelationships, onRelationshipSelect]);

  const getRelationshipString = useCallback((rel: Relationship) =>
    `${rel.source} - ${rel.type} - ${rel.target}`, []);

  const getTextColorClass = useCallback((key: string) =>
    key === 'Prompt' ? 'text-black' : 'text-white', []);

  return (
    <div className='mt-4'>
      <h2 className='text-lg font-semibold mb-2'>Relationships</h2>
      {filteredRelationships.length > 0 ? (
        <div className='space-y-2 border rounded-lg p-2'>
          {filteredRelationships.map((rel, index) => {
            const relationshipString = getRelationshipString(rel);
            return (
              <div
                key={`${rel.source}-${rel.type}-${rel.target}-${index}`}
                className={`flex items-center border-2 space-x-2 p-2 rounded cursor-pointer transition-colors
                  ${
                    selectedRelationships.includes(relationshipString)
                      ? 'ring-2 ring-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                onClick={() => handleRelationshipClick(relationshipString)}
              >
                <span className={`font-medium px-2 py-1 rounded ${getColorClass(rel.source)} ${getTextColorClass(rel.source)}`}>{rel.source}</span>
                <span className='text-black bg-gray-200 px-2 py-1 rounded'>{rel.type}</span>
                <span className={`font-medium px-2 py-1 rounded ${getColorClass(rel.target)} ${getTextColorClass(rel.target)}`}>{rel.target}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className='text-gray-500'>
          No more relationships available in this path.
        </p>
      )}
    </div>
  );
};

export default RelationshipList;