import React, { useCallback, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { HiMagnifyingGlassMinus, HiMagnifyingGlassPlus } from 'react-icons/hi2';
import { TbArrowsDiagonal } from 'react-icons/tb';

type GraphNode = {
  id: string;
  name: string;
  label: string;
  displayName?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  [key: string]: any;
};

type GraphLink = {
  source: string | GraphNode;
  target: string | GraphNode;
  label?: string;
};

type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

type QueryGraphProps = {
  graphData: GraphData;
  selectedGraphNode: GraphNode | null;
  setSelectedGraphNode: (node: GraphNode | null) => void;
  zoomLevel: number;
};

const QueryGraph: React.FC<QueryGraphProps> = ({
  graphData,
  selectedGraphNode,
  setSelectedGraphNode,
  zoomLevel,
}) => {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const fgRef = useRef<any>(null);

  const getNodeColor = (node: GraphNode): string => {
    switch (node.label) {
      case 'ATTRIBUTE':
      case 'DATA_SOURCE':
        return '#ffa6d2';
      case 'TRANSFORMATION':
        return '#595959';
      case 'TABLE_VIEW':
        return '#c10104';
      case 'DATASET':
        return '#ca3679';
      default:
        return 'rgb(200, 200, 200)';
    }
  };

  const getRelevantProperties = (node: GraphNode) => {
    const excludedProps = [
      'x', 'y', 'vx', 'vy', 'index',
      '__indexColor', 'color', 'id', 'size'
    ];
    
    return Object.entries(node).reduce((acc: Record<string, any>, [key, value]) => {
      if (!excludedProps.includes(key) && value !== '' && value != null) {
        acc[key] = Array.isArray(value) ? value.filter(Boolean).join(', ') : value;
      }
      return acc;
    }, {});
  };

  const nodeCanvasObject = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const FIXED_NODE_SIZE = 40;
      const nodeRadius = FIXED_NODE_SIZE / globalScale;
      const label = node.name || node.label;
      const baseFontSize = Math.min(nodeRadius * 0.7, 16 / globalScale);
      
      ctx.font = `${baseFontSize}px Sans-Serif`;
      ctx.fillStyle = getNodeColor(node);
      
      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();

      if (selectedGraphNode?.id === node.id) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';

      const maxTextWidth = nodeRadius * 1.5;
      let displayText = label;
      let textWidth = ctx.measureText(displayText).width;

      while (textWidth > maxTextWidth && displayText.length > 3) {
        displayText = displayText.slice(0, -1);
        textWidth = ctx.measureText(displayText + '...').width;
      }

      ctx.fillText(
        displayText.length < label.length ? displayText + '...' : displayText,
        node.x ?? 0,
        node.y ?? 0
      );
    },
    [selectedGraphNode]
  );

  const linkCanvasObject = useCallback(
    (link: GraphLink, ctx: CanvasRenderingContext2D) => {
      const start = typeof link.source === 'object' ? link.source : { x: 0, y: 0 };
      const end = typeof link.target === 'object' ? link.target : { x: 0, y: 0 };

      const dx = (end.x ?? 0) - (start.x ?? 0);
      const dy = (end.y ?? 0) - (start.y ?? 0);
      const distance = Math.sqrt(dx * dx + dy * dy);

      const unitX = dx / distance;
      const unitY = dy / distance;

      const FIXED_NODE_SIZE = 40;
      const nodeRadius = FIXED_NODE_SIZE / ctx.getTransform().a;

      const startX = (start.x ?? 0) + unitX * nodeRadius;
      const startY = (start.y ?? 0) + unitY * nodeRadius;
      const endX = (end.x ?? 0) - unitX * nodeRadius;
      const endY = (end.y ?? 0) - unitY * nodeRadius;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw arrowhead
      const arrowSize = 8;
      const arrowAngle = Math.PI / 6;
      const angle = Math.atan2(dy, dx);

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle - arrowAngle),
        endY - arrowSize * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle + arrowAngle),
        endY - arrowSize * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fillStyle = '#666';
      ctx.fill();
    },
    []
  );

  return (
    <div className="relative" onMouseMove={(e) => setTooltipPosition({ x: e.clientX, y: e.clientY })}>
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 bg-gray-100 p-1">
        <button onClick={() => fgRef.current?.zoom(Math.max(zoomLevel * 0.8, 0.1), 400)} className="hover:text-gray-600">
          <HiMagnifyingGlassMinus className="h-5 w-5" />
        </button>
        <button onClick={() => fgRef.current?.zoom(Math.min(zoomLevel * 1.2, 8), 400)} className="hover:text-gray-600">
          <HiMagnifyingGlassPlus className="h-5 w-5" />
        </button>
      </div>
      
      <div className="absolute bottom-10 right-2 z-10">
        <TbArrowsDiagonal className="h-5 w-5" />
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        onNodeHover={setHoveredNode}
        onNodeClick={(node) => setSelectedGraphNode(node === selectedGraphNode ? null : node)}
        onLinkHover={setHoveredLink}
        backgroundColor="#f3f4f6"
        width={975}
        height={500}
        enableNodeDrag={false}
      />

      {(hoveredNode || hoveredLink) && (
        <div
          className="fixed z-50 rounded-md bg-white p-2 shadow-lg"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          {hoveredNode && (
            Object.entries(getRelevantProperties(hoveredNode)).map(([key, value]) => (
              <div key={key} className="mb-1">
                <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong>{' '}
                <span className="text-gray-700">{value}</span>
              </div>
            ))
          )}
          {hoveredLink && (
            <h1>{hoveredLink.label || 'Relationship'}</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryGraph;