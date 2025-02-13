import React, { useCallback, useRef, useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import {
  HiMagnifyingGlassPlus,
  HiMagnifyingGlassMinus,
  HiXCircle,
} from 'react-icons/hi2';

interface Node {
  id: string;
  name?: string;
  type?: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface Link {
  source: Node | string;
  target: Node | string;
  label?: string;
  isBidirectional?: boolean;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface Relationship {
  source: string;
  target: string;
  type: string;
}

interface GraphVisualizationProps {
  data: GraphData;
  isVisible: boolean;
  zoomLevel?: number;
  relationships: Relationship[];
}

interface TooltipPosition {
  x: number;
  y: number;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ 
  data, 
  isVisible, 
  zoomLevel, 
  relationships 
}) => {
  const fgRef = useRef<any>();
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const getNodeColor = (node: Node): string => {
    switch (node.type) {
      case 'ATTRIBUTE':
        return '#ff69b4';
      case 'TRANSFORMATION':
        return '#ff4040';
      case 'TABLEVIEW':
        return '#4169e1';
      case 'TABLE/VIEW':
        return '#800080';
      default:
        return '#808080';
    }
  };

  const getNodeSize = (node: Node): number => {
    switch (node.type) {
      case 'ATTRIBUTE':
        return 25;
      case 'TRANSFORMATION':
        return 25;
      case 'VIEW':
        return 25;
      default:
        return 25;
    }
  };

  const assignHierarchicalPositions = useCallback(() => {
    if (!data || !data.nodes || !data.links) return;

    const nodesById: { [key: string]: Node } = {};
    data.nodes.forEach((node) => {
      nodesById[node.id] = node;
    });

    const nodeDepths: { [key: string]: number } = {};
    const nodeChildren: { [key: string]: string[] } = {};
    let maxDepth = 0;

    data.nodes.forEach((node) => {
      nodeChildren[node.id] = [];
    });

    data.links.forEach((link) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      nodeChildren[sourceId].push(targetId);
    });

    const hasIncomingEdge = new Set(
      data.links.map((l) => typeof l.target === 'object' ? l.target.id : l.target)
    );
    const rootNodes = data.nodes.filter(
      (node) => !hasIncomingEdge.has(node.id)
    );

    const queue = rootNodes.map((node) => ({ id: node.id, depth: 0 }));
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current.id)) continue;

      visited.add(current.id);
      nodeDepths[current.id] = current.depth;
      maxDepth = Math.max(maxDepth, current.depth);

      nodeChildren[current.id].forEach((childId) => {
        if (!visited.has(childId)) {
          queue.push({ id: childId, depth: current.depth + 1 });
        }
      });
    }

    const verticalSpacing = 120;
    const horizontalSpacing = 100;

    const nodesByDepth: { [key: string]: string[] } = {};
    Object.entries(nodeDepths).forEach(([nodeId, depth]) => {
      if (!nodesByDepth[depth]) nodesByDepth[depth] = [];
      nodesByDepth[depth].push(nodeId);
    });

    Object.entries(nodesByDepth).forEach(([depth, nodeIds]) => {
      const depthNumber = parseInt(depth);
      const totalWidth = (nodeIds.length - 1) * horizontalSpacing;
      const startX = -totalWidth / 2;

      nodeIds.forEach((nodeId, index) => {
        const node = nodesById[nodeId];
        node.fx = startX + index * horizontalSpacing;
        node.fy = depthNumber * verticalSpacing;
      });
    });
  }, [data]);

  const nodeCanvasObject = useCallback((node: Node, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const maxCharsPerLine = 12;
    const label = node.name || node.type || 'N/A';
    const size = getNodeSize(node);
    const fontSize = size * 0.3;

    ctx.beginPath();
    ctx.fillStyle = getNodeColor(node);
    ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px Arial`;

    const words = label.includes('/') ? label.split('/') : [label];
    const truncatedWords = words.map((word) =>
      word.length > maxCharsPerLine
        ? `${word.substring(0, maxCharsPerLine)}...`
        : word
    );
    const lineHeight = fontSize * 1.2;

    truncatedWords.forEach((word, i) => {
      ctx.fillText(
        word,
        node.x || 0,
        (node.y || 0) + (i - (truncatedWords.length - 1) / 2) * lineHeight
      );
    });
  }, []);
    // Helper function to draw straight links
    const drawStraightLink = (
      ctx: CanvasRenderingContext2D,
      sourcePos: { x: number, y: number },
      targetPos: { x: number, y: number },
      nodeSize: number
    ) => {
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      const unitDx = dx / length;
      const unitDy = dy / length;
    
      const startPoint = {
        x: sourcePos.x + unitDx * nodeSize,
        y: sourcePos.y + unitDy * nodeSize,
      };
      const endPoint = {
        x: targetPos.x - unitDx * (nodeSize + 5),
        y: targetPos.y - unitDy * (nodeSize + 5),
      };
    
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.6)';
      ctx.lineWidth = 1;
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
    
      const angle = Math.atan2(dy, dx);
      drawArrow(ctx, endPoint.x, endPoint.y, angle);
    };
    
    // Helper function to draw arrows
    const drawArrow = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      angle: number
    ) => {
      const arrowLength = 8;
    
      const arrowPoint1 = {
        x: x - arrowLength * Math.cos(angle - Math.PI / 6),
        y: y - arrowLength * Math.sin(angle - Math.PI / 6),
      };
      const arrowPoint2 = {
        x: x - arrowLength * Math.cos(angle + Math.PI / 6),
        y: y - arrowLength * Math.sin(angle + Math.PI / 6),
      };
    
      ctx.beginPath();
      ctx.fillStyle = 'rgba(128, 128, 128, 0.6)';
      ctx.moveTo(x, y);
      ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
      ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
      ctx.closePath();
      ctx.fill();
    };
  // Helper function to draw curved links
  const drawCurvedLink = (
    ctx: CanvasRenderingContext2D,
    sourcePos: { x: number, y: number },
    targetPos: { x: number, y: number },
    nodeSize: number,
    curveOffset: number
  ) => {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
  
    // Calculate control point for quadratic curve
    const midX = (sourcePos.x + targetPos.x) / 2;
    const midY = (sourcePos.y + targetPos.y) / 2;
    
    // Calculate perpendicular offset for control point
    const perpX = -dy / length * curveOffset;
    const perpY = dx / length * curveOffset;
    
    const controlX = midX + perpX;
    const controlY = midY + perpY;
  
    // Calculate start and end points accounting for node size
    const unitDx = dx / length;
    const unitDy = dy / length;
  
    const startPoint = {
      x: sourcePos.x + unitDx * nodeSize,
      y: sourcePos.y + unitDy * nodeSize,
    };
    const endPoint = {
      x: targetPos.x - unitDx * (nodeSize + 5),
      y: targetPos.y - unitDy * (nodeSize + 5),
    };
  
    // Draw the curved path
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.6)';
    ctx.lineWidth = 1;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(controlX, controlY, endPoint.x, endPoint.y);
    ctx.stroke();
  
    // Calculate angle for arrow at the curve end
    const endTangentX = endPoint.x - controlX;
    const endTangentY = endPoint.y - controlY;
    const arrowAngle = Math.atan2(endTangentY, endTangentX);
    
    drawArrow(ctx, endPoint.x, endPoint.y, arrowAngle);
  };

  function checkBidirectional(dataArray: any[],link: { target: any; source: any; }) {
    // Check if there's a matching reverse link in the data
    const reverseLink = dataArray.find(item => 
        item.source === link.target && 
        item.target === link.source
    );
    
    return {
        isBidirectional: Boolean(reverseLink),
        reverseLink: reverseLink || null
    };
}
  const linkCanvasObject = useCallback((link: Link, ctx: CanvasRenderingContext2D) => {
    const source = typeof link.source === 'object' ? link.source : { x: 0, y: 0 };
    const target = typeof link.target === 'object' ? link.target : { x: 0, y: 0 };
    
    const sourcePos = { x: source.x || 0, y: source.y || 0 };
    const targetPos = { x: target.x || 0, y: target.y || 0 };
    const nodeSize = getNodeSize(typeof target === 'object' ? target : { type: '' });
  
    // Handle self-referential links
    if (
      source === target ||
      (typeof source === 'object' && typeof target === 'object' && 
       source.id === target.id && link.label === 'SELF_REFERENCE')
    ) {
      const radius = nodeSize * 1.2;
      const centerX = sourcePos.x + nodeSize * 1.5;
      const centerY = sourcePos.y;
      const startAngle = -Math.PI * 0.8;
      const endAngle = Math.PI * 0.8;
  
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.6)';
      ctx.lineWidth = 1;
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.stroke();
  
      drawArrow(ctx, 
        centerX + radius * Math.cos(endAngle),
        centerY + radius * Math.sin(endAngle),
        endAngle + Math.PI / 2
      );
      return;
    }
  
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
  
    if (length === 0) return;
  
    // Check if there's a bidirectional link
    const isBidirectional = checkBidirectional(data.links,link);
    // console.log(data.links)
    if (isBidirectional.isBidirectional) {
      console.log("hjkhjk")
      // Draw two curved paths
      drawCurvedLink(ctx, sourcePos, targetPos, nodeSize, 15); // Curve above
      // drawCurvedLink(ctx, sourcePos, targetPos, nodeSize, -15); // Curve below
    } else {
      // Draw straight link for single direction
      drawStraightLink(ctx, sourcePos, targetPos, nodeSize);
    }
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      assignHierarchicalPositions();

      fgRef.current.d3Force('charge').strength(-50).distanceMax(150);
      fgRef.current.d3Force('link').distance(80).strength(0.5);
      fgRef.current.d3Force('center', null);
    }
  }, [assignHierarchicalPositions]);

  const handleNodeHover = useCallback((node: Node | null, event: MouseEvent) => {
    if (event) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
    setHoveredNode(node);
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  }, []);

const handleLinkHover = useCallback((link: Link | null) => {
  // First log the incoming link data
  console.log('Hover link data:', link);
  
  if (!link) {
    setHoveredLink(null);
    return;
  }

  // Log source and target information
  console.log('Source:', link.source);
  console.log('Target:', link.target);
  console.log('Link label:', link.label);

  // Extract source and target with better type checking
  const sourceNode = typeof link.source === 'object' ? link.source : null;
  const targetNode = typeof link.target === 'object' ? link.target : null;

  // Log the extracted node information
  console.log('Source node:', sourceNode);
  console.log('Target node:', targetNode);

  // Check for self-reference
  const isSelfReference = sourceNode && 
                         targetNode && 
                         sourceNode.id === targetNode.id;

  console.log('Is self reference:', isSelfReference);

  if (isSelfReference) {
    // For self-referential links, look for relationships where source and target are the same
    const selfRelationship = relationships.find(rel => 
      rel.source === sourceNode.type && rel.target === sourceNode.type
    );

    console.log('Found self relationship:', selfRelationship);

    if (selfRelationship) {
      setHoveredLink(selfRelationship.type);
      return;
    }
  }

  // For normal links
  if (sourceNode && targetNode) {
    const relationship = relationships.find(rel =>
      rel.source === sourceNode.type && rel.target === targetNode.type
    );

    console.log('Found normal relationship:', relationship);

    if (relationship) {
      setHoveredLink(relationship.type);
      return;
    }
  }

  setHoveredLink(null);
}, [relationships]);

  const handleCopyContent = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content));
    alert('Copied to clipboard');
  };

  if (!isVisible) return null;

  return (
    <div className='relative w-full h-[600px]' onMouseMove={handleMouseMove}>
      <div className='absolute right-2 top-2 z-10 flex gap-2'>
        <button className='p-2 bg-white rounded shadow hover:bg-gray-50'>
          <HiMagnifyingGlassPlus size={20} />
        </button>
        <button className='p-2 bg-white rounded shadow hover:bg-gray-50'>
          <HiMagnifyingGlassMinus size={20} />
        </button>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        nodeRelSize={6}
        onNodeClick={handleNodeHover}
        onBackgroundClick={() => setHoveredNode(null)}
        backgroundColor='#ffffff'
        cooldownTicks={100}
        d3VelocityDecay={0.9}
        onLinkHover={handleLinkHover}
      />

      {hoveredNode && (
        <div
          className='fixed border-black border-2 bg-white p-3 rounded-md shadow-md text-sm max-w-[300px] z-10 overflow-auto max-h-[400px]'
          style={{
            right: 10,
            top: 100,
          }}
        >
          <div className='flex w-full justify-between items-center mb-2'>
            <button
              className='bg-black text-white px-2 py-1 rounded-lg'
              onClick={() => handleCopyContent(hoveredNode)}
            >
              Copy content
            </button>

            <button
              className='text-red-600'
              onClick={() => setHoveredNode(null)}
            >
              <HiXCircle size={20} />
            </button>
          </div>
          {Object.entries(hoveredNode).map(([key, value]) => {
            if (value === null || value === undefined) return null;

            if (Array.isArray(value)) {
              return (
                <div key={key} className='mb-2'>
                  <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong>
                  <ul className='list-disc ml-4 mt-1'>
                    {value.map((item, i) => (
                      <li key={i} className='text-gray-700 capitalize'>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <div key={key} className='mb-2'>
                <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong>{' '}
                <span className='text-gray-700 capitalize'>
                  {value.toString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {hoveredLink && (
        <div
          className='fixed bg-white p-3 rounded-md shadow-md text-sm max-w-[300px] z-10 overflow-auto max-h-[400px]'
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          <p className='text-gray-700'>{hoveredLink}</p>
        </div>
      )}
    </div>
  );
};

export default GraphVisualization;