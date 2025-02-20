import {
  BaseEdge,
  BezierEdge,
  BuiltInNode,
  ConnectionMode,
  Controls,
  EdgeProps,
  getBezierPath,
  Handle,
  MarkerType,
  NodeProps,
  NodeTypes,
  Position,
  ReactFlow,
  ReactFlowState,
  useEdgesState,
  useNodesState,
  useStore
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./reactflow.css"; // css added to hide the watermark of react flow
import dagre from "dagre";
import React, { useCallback, useEffect, useState } from "react";
import { HiXCircle } from "react-icons/hi2";
import useWindowDimensions from "../../lib/windowDimensions";
import { de } from "date-fns/locale";

interface CustomNodeData {
  label: string;
  status?: "active" | "inactive" | "error";
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
  };
  type?: string;
}

// Enhanced CustomNode component with better styling
const CustomNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  const getNodeTypeColor = (type?: string) => {
    switch (type?.toUpperCase()) {
      case "ATTRIBUTE":
        return "bg-gradient-to-b from-red-100 to-pink-200";
      case "TRANSFORMATION":
        return "bg-gradient-to-b from-gray-300 to-slate-300";
      case "TABLE_VIEW":
        return "bg-gradient-to-b from-red-300 to-rose-300";
      default:
        return "bg-gradient-to-b from-slate-100 to-gray-200";
    }
  };

  return (
    <div
      className={`px-1 py-2 shadow-lg rounded-lg bg-white border-2 ${getNodeTypeColor(
        data.type
      )}`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-gray-400 border-2 border-white"
      />

      {/* Node Content */}
      <div className="flex items-center gap-2">
        <div
          className={`w - 3 h-3 rounded-full ${getStatusColor(data.status)}`}
          title={`Status: ${data.status || "default"}`}
        />
        <div className="font-medium text-sm text-gray-800">{data.type}</div>
      </div>

      {/* Node Label */}
      <div className="mt-1">
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
          {data.label}
        </span>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-gray-400 border-2 border-white"
      />
    </div>
  );
};

const BiDirectionalNode = ({ data }: NodeProps<BuiltInNode>) => {
  return (
    <div>
      <Handle type="source" position={Position.Left} id="left" />
      {data?.label}
      <Handle type="source" position={Position.Right} id="right" />
    </div>
  );
};

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number,
) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX} ${centerY + offset
    } ${targetX} ${targetY}`;
};

const BiDirectionalEdge = ({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) => {
  const isBiDirectionEdge = useStore((s: ReactFlowState) => {
    const edgeExists = s.edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target),
    );

    return edgeExists;
  });

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  let path = '';

  if (isBiDirectionEdge) {
    path = getSpecialPath(edgePathParams, sourceX < targetX ? 25 : -25);
  } else {
    [path] = getBezierPath(edgePathParams);
  }

  return <BaseEdge path={path} markerEnd={markerEnd} />;
}

// const SelfConnecting = (props: EdgeProps) => {
//   // Normal connections use default edge
//   if (props.source !== props.target) {
//     return <BezierEdge {...props} />;
//   }

//   console.log('RENDERING SELF LOOP:', props.source, props.target);

//   // // For self-loops, draw a fixed circle
//   // const centerX = props.sourceX;
//   // const centerY = props.sourceY;
//   // const radius = 55;

//   // // Simple SVG circle path - with a very small offset to force rendering
//   // const edgePath = `M ${centerX - radius + 10} ${centerY - radius - 40}
//   //                   a ${radius} ${radius} 0 1 0 0.1 0`;




//   const { sourceX, sourceY, targetX, targetY, id, markerEnd } = props;
// //   const radiusX = (sourceX - targetX) * 0.6;
// //   const radius = 50;
// //   // const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
// //   //   targetX + 2
// //   // } ${targetY}`;
// //   const edgePath = `
// //   M ${sourceX} ${sourceY}
// //   C ${sourceX - radius * 2} ${sourceY - (sourceY - targetY)/2},
// //     ${sourceX - radius * 2} ${targetY + (sourceY - targetY)/2},
// //     ${targetX} ${targetY}
// // `;jkjm




//   // Calculate dimensions for a nice semi-circular arc
//   const yDiff = Math.abs(sourceY - targetY);
//   const radius = Math.max(80, yDiff * 1.5); // Make radius responsive to the vertical distance

//   // Create a path that forms a semi-circle to the left
//   const edgePath = `
//     M ${sourceX} ${sourceY}
//     C ${sourceX - radius} ${sourceY+radius},
//       ${targetX - radius} ${targetY-radius},
//       ${targetX} ${targetY}
//   `;
//   return (
//     <BaseEdge
//       path={edgePath}
//       markerEnd={props.markerEnd}
//       style={{ strokeWidth: 2, stroke: '#666' }}
//     />
//   );
// };


const SelfConnecting = (props: EdgeProps) => {
  // we are using the default bezier edge when source and target ids are different
  if (props.source !== props.target) {
    return <BezierEdge {...props} />;
  }

  const { sourceX, sourceY, targetX, targetY, id, markerEnd } = props;
  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 50;
  const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${targetX + 2
    } ${targetY}`;

  return <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ strokeWidth: 1.5, stroke: '#666' }} />;
}

interface Node {
  id: string;
  name?: string;
  type?: string;
}

interface Link {
  source: string;
  target: string;
  label?: string;
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

// Helper functions
function getNodeColor(node: Node): string {
  switch (node.type?.toUpperCase()) {
    case "ATTRIBUTE":
      return "#ff69b4";
    case "TRANSFORMATION":
      return "#3a2f2fff";
    case "TABLE_VIEW":
      return "#c10104ff";
    default:
      return "#808080";
  }
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  data,
  isVisible,
  relationships,
}) => {
  const [finalData, setFinalData] = useState<any>(data);
  useEffect(() => {
    setFinalData(data);
  }, [data]);

  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const nodeTypes: NodeTypes = {
    customNode: CustomNode,
    biDirectionalNode: BiDirectionalNode
  };

  const edgeTypes = {
    selfLoop: SelfConnecting,
    bidirectional: BiDirectionalEdge
  };

  const getRelationshipLabel = (link: Link, relationships: Relationship[]) => {
    const relationship = relationships.find(
      (rel) => rel.source === link.source && rel.target === link.target
    );
    return relationship?.type || "";
  };

  const getLayoutedElements = useCallback((
    direction = "LR"
  ) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 250;
    const nodeHeight = 80;

    dagreGraph.setGraph({
      rankdir: direction, // Left to Right layout
      nodesep: 80,
      ranksep: 100,
    });

    finalData.nodes.map((node: Node) => ({
      id: node.id,
      type: "customNode",
      position: { x: 0, y: 0 },
      data: {
        ...node, // Default status
        label: truncateText(node.name || node.id, 20),
        type: node.type,
        status: "active",
      },
    })).forEach((node: any) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    finalData.links.map((link: Link, index: number) => {
      const isSelfLoop = link.source === link.target;
      const isBidirectional = data.links.some(
        (otherLink) =>
          otherLink.source === link.target && otherLink.target === link.source
      );

      if (isSelfLoop) {
        return {
          id: `e${index}`,
          source: link.source,
          target: link.target,
          type: 'selfLoop',
          style: { stroke: "#666", strokeWidth: 1.5 },
          labelStyle: { fill: "#666", fontSize: 12 },
          markerEnd: { type: "arrowclosed", color: "#666", }
        };
      }

      return {
        id: `e${index}`,
        source: link.source,
        target: link.target,
        label: getRelationshipLabel(link, relationships),
        style: { stroke: "#666", strokeWidth: 1.5 },
        labelStyle: { fill: "#666", fontSize: 12 },
        markerEnd: {
          type: "arrowclosed",
          color: "#666",
        },
        ...(isBidirectional && {
          type: "bidirectional",
          markerStart: { type: "arrowclosed", color: "#666" },
        }),
      };
    }).forEach((edge: any) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return {
      nodes: finalData.nodes.map((node: Node) => ({
        id: node.id,
        type: "customNode",
        position: { x: 0, y: 0 },
        data: {
          ...node, // Default status
          label: truncateText(node.name || node.id, 20),
          type: node.type,
          status: "active",
        },
      })).map((node: any) => ({
        ...node,
        position: {
          x: dagreGraph.node(node.id).x - nodeWidth / 2,
          y: dagreGraph.node(node.id).y - nodeHeight / 2,
        },
      })),
      edges: finalData.links.map((link: Link, index: number) => {
        const isSelfLoop = link.source === link.target;
        const isBidirectional = data.links.some(
          (otherLink) =>
            otherLink.source === link.target && otherLink.target === link.source
        );

        if (isSelfLoop) {
          return {
            id: `e${index}`,
            source: link.source,
            target: link.target,
            type: 'selfLoop',
            style: { stroke: "#666", strokeWidth: 1.5 },
            labelStyle: { fill: "#666", fontSize: 12 },
            markerEnd: { type: "arrowclosed", color: "#666", }
          };
        }

        return {
          id: `e${index}`,
          source: link.source,
          target: link.target,
          label: getRelationshipLabel(link, relationships),
          style: { stroke: "#666", strokeWidth: 1.5 },
          labelStyle: { fill: "#666", fontSize: 12 },
          markerEnd: {
            type: "arrowclosed",
            color: "#666",
          },
          ...(isBidirectional && {
            type: "bidirectional",
            markerStart: { type: "arrowclosed", color: "#666" },
          }),
        };
      }),
    };
  }, [finalData]);



  const [nodes, setNodes, onNodesChange] = useNodesState(getLayoutedElements(
    "LR"
  ).nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(getLayoutedElements(
    "LR"
  ).edges);

  useEffect(() => {
    let { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      "LR"
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [finalData]);

  // Node click handler
  const handleNodeClick = useCallback((event: any, node: any) => {
    if (event) {
      console.log({ x: event.clientX, y: event.clientY });
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
    setHoveredNode(node);
  }, []);

  // Copy node content to clipboard
  const handleCopyContent = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content));
    alert("Copied to clipboard");
  };
  if (!isVisible) return null;

  const { height, width } = useWindowDimensions();

  const [wrapperStyle, setWrapperStyle] = useState<{ css: React.CSSProperties, isFullApplied: boolean }>({ css: { width: `${width - 140}px`, height: "100vh", position: "relative", display: "flex" }, isFullApplied: false })
  return (
    <div style={wrapperStyle.css}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        minZoom={0.1}
        maxZoom={2}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
        style={{
          alignItems: "center",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(238,174,202,.3) 0%, rgba(148,187,233,0.3) 100%)",
        }}

      >
        <Controls position="top-left" onFitView={() => setWrapperStyle((prevState) => (prevState.isFullApplied ? { css: { width: `${width - 140}px`, height: "100vh", position: "relative", top: 0, left: 0 }, isFullApplied: false } : { css: { width: `100vw`, height: "100vh", position: "absolute", top: 0, left: 0, zIndex: 100, backgroundColor: "white" }, isFullApplied: true }))} />
      </ReactFlow>

      {/* Node details tooltip/panel */}
      {hoveredNode && (
        <div
          id="contentDiv"
          className="fixed border-black border-2 bg-white p-3 rounded-md shadow-md text-sm max-w-[300px] z-10 overflow-auto max-h-[200px]"
          style={{
            left: (width - tooltipPosition.x) > 300 ? tooltipPosition.x : tooltipPosition.x - (300 - (width - tooltipPosition.x)),
            top: (height - tooltipPosition.y) > 200 ? tooltipPosition.y : tooltipPosition.y - (200 - (height - tooltipPosition.y)),
          }}
        >
          <div className="flex w-full justify-between items-center mb-2">
            <button
              className="bg-black text-white px-2 py-1 rounded-lg"
              onClick={() => handleCopyContent(hoveredNode)}
            >
              Copy content
            </button>

            <button
              className="text-red-600"
              onClick={() => setHoveredNode(null)}
            >
              <HiXCircle size={20} />
            </button>
          </div>
          {Object.entries({ ...hoveredNode }).filter(([key]) => key === "id" || key === "data").map(([key, value]) => {
            if (value === null || value === undefined) return null;
            console.log(key, value)
            if (Array.isArray(value)) {
              return (
                <div key={key} className="mb-2">
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>
                  <ul className="list-disc ml-4 mt-1">
                    {value.map((item, i) => (
                      <li key={i} className="text-gray-700 capitalize">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            if (key === "data") {
              return (
                <div key={key} className="">
                  <ul className="">
                    {Object.entries(value).filter(([key]) => key !== "id").map(([key, value]) => (
                      <li key={key} className="text-gray-700 capitalize mb-2">
                        <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return (
              <div key={key} className="mb-2">
                <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                <span className="text-gray-700 capitalize">
                  {typeof (value) === "object" ? JSON.stringify(value, null, 2) : typeof (value) === "string" ? value.toString() : value}
                </span>
              </div>
            );
          })}
        </div>
      )
      }
    </div>
  );
};

export default GraphVisualization;