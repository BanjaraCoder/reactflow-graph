import React, { useState } from 'react';
import { getColorClass } from './colormap';
interface NodeListProps {
  onNodeSelect: (nodeName: string) => void;
  nodes: string[];
}

interface NodeType {
  name: string;
  color: string;
}

const NodeList: React.FC<NodeListProps> = ({ onNodeSelect, nodes }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  

  

  // Create NodeType array from the provided nodes
  const nodeTypes: NodeType[] = nodes.map(nodeName => ({
    name: nodeName,
    color: getColorClass(nodeName) || 'bg-gray-400', // Default to gray if no color is defined
  }));

  const handleNodeClick = (nodeName: string) => {
    setSelectedNode(nodeName === selectedNode ? null : nodeName);
    onNodeSelect(nodeName);
  };

  return (
    <div className='mt-4'>
      <h2 className='text-lg  font-semibold mb-2'>Nodes</h2>
      <div className='space-y-2 border rounded-lg p-2'>
        {nodeTypes.map((node) => (
          <div
            key={node.name}
            className={`flex items-center space-x-2 p-2 border  font-Manrope rounded cursor-pointer transition-colors
              ${
                selectedNode === node.name
                  ? 'ring-2 ring-red-500'
                  : 'hover:bg-red-100'
              }`}
            onClick={() => handleNodeClick(node.name)}
          >
            <div className={`w-4 h-4 rounded-full ${node.color}`}></div>
            <span className='text-gray-600'>{node.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeList;