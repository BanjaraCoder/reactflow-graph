import { useCallback, useEffect, useState } from 'react';
import { Relationship } from '..';
import {
  fetchDataModel,
  handleAdjacentNodes,
  runQuery,
} from '../../../services/neo4jService';
import Navbar from '../navbar';
import { getColorClass } from "../colormap";

import QueryGraph from './components/QueryGraph';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { RiDownloadLine } from 'react-icons/ri';

interface GraphData {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    color?: string;
    [key: string]: any;
  }>;
  links: Array<{
    source: string;
    target: string;
    label: string;
  }>;
}

const COLORS = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#808080',
];

const colorMap = new Map();

const getNodeColor = (nodeType: string): string => {
  if (!colorMap.has(nodeType)) {
    const color = COLORS[colorMap.size % COLORS.length];
    colorMap.set(nodeType, color);
  }
  return colorMap.get(nodeType);
};

const Query = () => {
  const [nodeProperties, setNodeProperties] = useState<{
    [key: string]: string[];
  }>({});
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
   const [activeTab, setActiveTab] = useState<"Nodes" | "Relationships">("Nodes");

  const [selectedType, setSelectedType] = useState<
    'Nodes' | 'Relationships' | null
  >(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [nodeCounts, setNodeCounts] = useState<{ [key: string]: number }>({});

  async function fetchNodeTypeCounts() {
    try {
      const response = await fetch(
        'https://neo4j-be-1060627628276.us-central1.run.app/node_type_counts',
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      const data = await response.json();
      const counts = data.node_counts.reduce(
        (
          acc: { [key: string]: number },
          item: { node_type: string; count: number }
        ) => {
          acc[item.node_type] = item.count;
          return acc;
        },
        {}
      );
      setNodeCounts(counts);
    } catch (error) {
      console.error('Error fetching node type counts:', error);
    }
  }

  useEffect(() => {
    const loadDataModel = async () => {
      try {
        const dataModel = await fetchDataModel();

        // Process node properties
        const nodeProps: { [key: string]: string[] } = {};
        dataModel.nodes.forEach((node: any) => {
          nodeProps[node.type] = node.attributes;
        });
        setNodeProperties(nodeProps);

        // Process relationships
        const rels: Relationship[] = dataModel.relationships.map(
          (rel: any) => ({
            source: rel.start_node,
            type: rel.type,
            target: rel.end_node,
          })
        );
        setRelationships(rels);
        await fetchNodeTypeCounts();
      } catch (error) {
        console.error('Error loading data model:', error);
        setError('Failed to load data model');
      } finally {
        setLoading(false);
      }
    };

    loadDataModel();
  }, []);

  const processQueryResult = (result: any): GraphData => {
    const nodes = new Set<string>();
    const links = new Set<string>();

    if (result?.results?.length) {
      result.results.forEach((item: any) => {
        Object.entries(item).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'object' && value !== null) {
            const nodeType = value.type || value.name;
            const nodeId = value.id || value.name || key;
             const displayName = value.name || nodeType;

            const node = {
              id: nodeId,
              label: value.type || nodeType,
              type: nodeType,
              color: getNodeColor(nodeType),
                size: 40, // Add consistent size for all nodes
            displayName: displayName.length > 12 ? displayName.substring(0, 12) + '...' : displayName,
            
              ...value,
            };
            nodes.add(JSON.stringify(node));
          }
        });
      });
    }

    return {
      nodes: Array.from(nodes).map((node) => JSON.parse(node)),
      links: Array.from(links).map((link) => JSON.parse(link)),
    };
  };

  const handleNodeClick = async (nodeType: string) => {
    try {
      const result = await runQuery(nodeType);
      const processedData = processQueryResult(result);
      setGraphData(processedData);
    } catch (error) {
      console.error('Error fetching node data:', error);
    }
  };

  const handleTypeSelect = (type: 'Nodes' | 'Relationships') => {
    setSelectedType(type === selectedType ? null : type);
  };

  const onReset = () => {
    setGraphData(null);
    setSelectedType(null);
    setSelectedGraphNode(null);
    setError(null);
  };

  const updateGraphWithAdjacentNodes = useCallback((adjacentNodes: any) => {
    setGraphData((prevData) => {
      if (!prevData) return null;

      const newNodes = [...prevData.nodes];
      const newLinks = [...prevData.links];

      const nodeSet = new Set(newNodes.map((node) => node.id));
      const linkSet = new Set(
        newLinks.map((link) =>
          JSON.stringify({ source: link.source, target: link.target })
        )
      );

      // Process each relationship in adjacentNodes
      Object.values(adjacentNodes).forEach((relationArray: any[]) => {
        const sourceNode = relationArray[0];
        const relationshipType = relationArray[1];
        const targetNode = relationArray[2];

        // Process source node
        const sourceId = sourceNode.name || sourceNode.type;
        if (sourceId && !nodeSet.has(sourceId)) {
          const displayName = sourceNode.name || sourceNode.type;
          const newNode = {
            ...sourceNode,
            id: sourceId,
            label: sourceNode.name || sourceNode.type || 'Unknown',
            type: sourceNode.type || 'Node',
            color: getNodeColor(sourceNode.type || 'Node'),
           size: 40,
          displayName: displayName.length > 12 ? displayName.substring(0, 12) + '...' : displayName,
          };
          newNodes.push(newNode);
          nodeSet.add(sourceId);
        }

        // Process target node
        const targetId = targetNode.name || targetNode.type;
        if (targetId && !nodeSet.has(targetId)) {
           const displayName = targetNode.name || targetNode.type;
          const newNode = {
            ...targetNode,
            id: targetId,
            label: targetNode.name || targetNode.type || 'Unknown',
            type: targetNode.type || 'Node',
            color: getNodeColor(targetNode.type || 'Node'),
             size: 40,
          displayName: displayName.length > 12 ? displayName.substring(0, 12) + '...' : displayName,
          };
          newNodes.push(newNode);
          nodeSet.add(targetId);
        }

        // Add relationship as a link
        if (sourceId && targetId) {
          const newLink = {
            source: sourceId,
            target: targetId,
            label: relationshipType || 'RELATED',
          };
          const linkKey = JSON.stringify({
            source: newLink.source,
            target: newLink.target,
          });

          if (!linkSet.has(linkKey)) {
            newLinks.push(newLink);
            linkSet.add(linkKey);
          }
        }
      });

      return { nodes: newNodes, links: newLinks };
    });
  }, []);

  const getRelevantNodesObject = (node: any) => {
    return {
      node_type: node.type,
      node_property: 'name',
      node_property_value: node.name,
    };
  };

  const handleAdjacentNodesFn = async (selectedNode: any) => {
    const nodeObj = getRelevantNodesObject(selectedNode);
    const adjacentNodes = await handleAdjacentNodes(nodeObj);

    console.log({ adjacentNodes });

    console.log({ graphData });

    updateGraphWithAdjacentNodes(adjacentNodes);
  };
  const handleZoomChange = (level: number) => {
    setZoomLevel(level);
  };

  useEffect(() => {
    if (selectedGraphNode) {
      handleAdjacentNodesFn(selectedGraphNode);
    }
  }, [selectedGraphNode]);

 // Rest of your component's JSX remains the same
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onZoomChange={handleZoomChange} />
        <hr className="text-gray-500" />

        <div className="grid grid-cols-12 h-full">
          <div className="relative bg-gray-100 col-span-9 border">
            <div
              style={{ zIndex: 9999 }}
              className="flex py-4 px-4 ml-11 items-center mb-4"
            >
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full border px-10 outline-red-500 py-2 rounded-md"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex ml-2">
                <button className="p-2 bg-black text-white rounded-md mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
                <button className="p-2 bg-white border rounded-md mr-2">
                  <RiDownloadLine />
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="p-2 bg-red-600 text-white rounded-md font-bold"
                >
                  Reset
                </button>
              </div>
            </div>
            {!!graphData && (
              <QueryGraph
                selectedGraphNode={selectedGraphNode}
                setSelectedGraphNode={setSelectedGraphNode}
                graphData={graphData}
                zoomLevel={zoomLevel}
              />
            )}
          </div>

          <div className="col-span-3 px-4 overflow-y-auto">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="">
                <div className="mb-6">
                  <div className="flex">
                    <button
                      className={`px-4 py-2 font-semibold ${
                        activeTab === "Nodes"
                          ? "text-red-600 border-b-2 border-red-600"
                          : "text-gray-600"
                      }`}
                      onClick={() => setActiveTab("Nodes")}
                    >
                      Nodes
                    </button>
                    <button
                      className={`px-4 py-2 font-semibold ${
                        activeTab === "Relationships"
                          ? "text-red-600 border-b-2 border-red-600"
                          : "text-gray-600"
                      }`}
                      onClick={() => setActiveTab("Relationships")}
                    >
                      Relationships
                    </button>
                  </div>
                  <div className="mt-4">
                    {activeTab === "Nodes" && (
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-gray-600 mb-1">Filter Categories</h3>
                          <button className="p-2 items-center text-gray-500 rounded">
                            <MdKeyboardArrowDown size={20} />
                          </button>
                        </div>
                        <div>
                          <ul className="flex gap-2 mb-2 text-gray-600">
                            <li className="cursor-pointer flex items-center gap-1">
                              <div className="rounded-full size-4 border-2"></div>
                              All Scene
                            </li>
                            <li className="cursor-pointer flex items-center gap-1">
                              <div className="rounded-full size-4 border-2"></div>
                              In Scene
                            </li>
                            <li className="cursor-pointer flex items-center gap-1">
                              <div className="rounded-full size-4 border-2"></div>
                              Off Scene
                            </li>
                          </ul>
                        </div>
                        <ul className="mt-4">
                          {Object.keys(nodeProperties).map((nodeType, index) => (
                            <li
                              key={index}
                              className="flex items-center border rounded px-2 mb-2 hover:bg-slate-100 py-2 cursor-pointer"
                              onClick={() => handleNodeClick(nodeType)}
                              >
                                <span
                                  className={`w-3 h-3 rounded-full mr-2 ${getColorClass(
                                    nodeType
                                  )}`}
                                ></span>
                                <span>{nodeType}</span>
                                <span className="ml-auto text-gray-600">
                                  {nodeCounts[nodeType] || 0}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {activeTab === "Relationships" && (
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-gray-600 mb-1">Filter Categories</h3>
                            <button className="p-2 items-center text-gray-500 rounded">
                              <MdKeyboardArrowDown size={20} />
                            </button>
                          </div>
                          <div>
                            <ul className="flex gap-2 mb-2 text-gray-600">
                              <li className="cursor-pointer flex items-center gap-1">
                                <div className="rounded-full size-4 border-2"></div>
                                All Scene
                              </li>
                              <li className="cursor-pointer flex items-center gap-1">
                                <div className="rounded-full size-4 border-2"></div>
                                In Scene
                              </li>
                              <li className="cursor-pointer flex items-center gap-1">
                                <div className="rounded-full size-4 border-2"></div>
                                Off Scene
                              </li>
                            </ul>
                          </div>
                          <ul className="mt-4">
                            {Array.from(
                              new Set(relationships.map((r) => r.type))
                            ).map((relType, index) => (
                              <li
                                key={index}
                                className="flex border rounded px-2 mb-2 hover:bg-slate-100 items-center py-2"
                              >
                                <span className="w-3 h-3 rounded-full mr-2 bg-red-500"></span>
                                <span>{relType}</span>
                                <span className="ml-auto text-gray-600">
                                  {
                                    relationships.filter(
                                      (r) => r.type === relType
                                    ).length
                                  }
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Query;