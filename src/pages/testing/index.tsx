import React, { useState, useEffect } from 'react';
import SearchBar from './searchbar';
import NodeList from './nodelist';
import RelationshipList from './relationshipList';
import { runQuery, fetchDataModel } from '../../services/neo4jService';
import GraphVisualization from './graph';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';

export interface Relationship {
  source: string;
  type: string;
  target: string;
}

export interface Node {
  id: string;
  label: string;
  type: string;
  name?: string;
  color?: string;
  [key: string]: any;
}

export interface Link {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface QueryResult {
  results: Array<{
    [key: string]: any;
  }>;
}

interface DataModel {
  nodes: Array<{
    type: string;
    attributes: string[];
  }>;
  relationships: Array<{
    start_node: string;
    type: string;
    end_node: string;
  }>;
}

interface NavbarProps {
  onZoomChange: (level: number) => void;
}

const GraphExplorer: React.FC = () => {
  const location = useLocation();
  const [selectedType, setSelectedType] = useState<'node' | 'relationship' | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);
  const [availableProperties, setAvailableProperties] = useState<string[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Record<string, string>>({});
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isGraphVisible, setIsGraphVisible] = useState(false);
  const [nodeProperties, setNodeProperties] = useState<Record<string, string[]>>({});
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const generateNodeId = (node: Record<string, any>, prefix: string = ''): string => {
    if (!node) return '';
    const identifierProps = ['id', 'name', 'type', 'index'];
    for (const prop of identifierProps) {
      if (node[prop]) {
        return prefix ? `${prefix}-${node[prop]}` : String(node[prop]);
      }
    }
    return prefix
      ? `${prefix}-${Object.values(node).join('-')}`
      : Object.values(node).join('-');
  };

  const createNode = (nodeData: Record<string, any>, nodeType: string): Node | null => {
    if (!nodeData) return null;
    const nodeId = generateNodeId(nodeData, nodeType);
    return {
      id: nodeId,
      label: nodeData.name || nodeData.type || nodeType,
      type: nodeType,
      ...nodeData,
    };
  };

  const determineNodeType = (node: Record<string, any>): string => {
    if (node.type) return node.type;
    if (node.name?.includes('metric')) return 'Metric';
    if (node.name?.includes('score')) return 'Score';
    if (node.name?.includes('date')) return 'Date';
    return 'Node';
  };

  const determineLinkLabel = (sourceNode: Record<string, any>, targetNode: Record<string, any>): string => {
    if (targetNode.type) return `APPLIES_${targetNode.type}`;
    if (sourceNode.type) return `FROM_${sourceNode.type}`;
    return 'CONNECTED_TO';
  };

  const COLORS: string[] = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080',
  ];

  const colorMap = new Map<string, string>();

  const getNodeColor = (nodeId: string): string => {
    if (!colorMap.has(nodeId)) {
      const color = COLORS[colorMap.size % COLORS.length];
      colorMap.set(nodeId, color);
    }
    return colorMap.get(nodeId) || COLORS[0];
  };

  const processQueryResult = (result: QueryResult): GraphData => {
    const nodes = new Set<string>();
    const links = new Set<string>();

    if (result?.results?.length) {
      result.results.forEach((item: Record<string, any>) => {
        const nodeKeys = Object.keys(item)
          .filter((key) => key.startsWith('n'))
          .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

        nodeKeys.forEach((key) => {
          if (item[key]) {
            const nodeType = determineNodeType(item[key]);
            const node = createNode(item[key], nodeType);
            if (node) {
              node.color = getNodeColor(node.id);
              nodes.add(JSON.stringify(node));
            }
          }
        });

        for (let i = 0; i < nodeKeys.length - 1; i++) {
          const currentKey = nodeKeys[i];
          const nextKey = nodeKeys[i + 1];

          if (item[currentKey] && item[nextKey]) {
            const sourceId = generateNodeId(
              item[currentKey],
              determineNodeType(item[currentKey])
            );
            const targetId = generateNodeId(
              item[nextKey],
              determineNodeType(item[nextKey])
            );

            const link = {
              source: sourceId,
              target: targetId,
              label: determineLinkLabel(item[currentKey], item[nextKey]),
            };

            links.add(JSON.stringify(link));
          }
        }
      });
    }

    return {
      nodes: Array.from(nodes).map((node) => JSON.parse(node)),
      links: Array.from(links).map((link) => JSON.parse(link)),
    };
  };

  const constructQuery = (properties: Record<string, string>): string => {
    let query = '';

    if (selectedType === 'relationship' && selectedRelationships.length > 0) {
      query = selectedRelationships.reduce((acc, rel, index) => {
        const [source, relType, target] = rel.split(' - ');
        const sourceWithProps = addPropertiesToNode(source, properties);
        const targetWithProps = addPropertiesToNode(target, properties);

        if (index === 0) {
          return `${sourceWithProps} - ${relType} - ${targetWithProps}`;
        }
        return `${acc} - ${relType} - ${targetWithProps}`;
      }, '');
    } else if (selectedType === 'node' && selectedNode) {
      query = addPropertiesToNode(selectedNode, properties);
    }

    return query;
  };

  const addPropertiesToNode = (
    node: string,
    properties: Record<string, string>
  ): string => {
    const relevantProps = Object.entries(properties)
      .filter(([key]) => key.startsWith(node))
      .map(([key, value]) => {
        const propname = key.split('_');
        const formattedKey = propname.slice(1).join('_');
        return `${formattedKey}:${value}`;
      });

    if (relevantProps.length > 0) {
      return `${node}:${relevantProps.join(',')}`;
    }
    return node;
  };

  useEffect(() => {
    const loadDataModel = async () => {
      try {
        const dataModel = await fetchDataModel() as DataModel;

        const nodeProps: Record<string, string[]> = {};
        dataModel.nodes.forEach((node) => {
          nodeProps[node.type] = node.attributes;
        });

        setNodeProperties(nodeProps);

        const rels: Relationship[] = dataModel.relationships.map((rel) => ({
          source: rel.start_node,
          type: rel.type,
          target: rel.end_node,
        }));
        setRelationships(rels);
      } catch (error) {
        console.error('Error loading data model:', error);
        setError('Failed to load data model');
      }
    };

    loadDataModel();
  }, []);

  useEffect(() => {
    if (selectedRelationships.length > 0) {
      const allNodes = selectedRelationships.flatMap((rel) => {
        const [sourceNode, , targetNode] = rel.split(' - ');
        return [sourceNode, targetNode];
      });
      const uniqueNodes = Array.from(new Set(allNodes));
      const combinedProperties = uniqueNodes.flatMap(
        (node) =>
          nodeProperties[node]?.map(
            (prop) => `${node}_${prop}`
          ) || []
      );
      setAvailableProperties(Array.from(new Set(combinedProperties)));
    } else if (selectedNode) {
      setAvailableProperties(
        nodeProperties[selectedNode]?.map(
          (prop) => `${selectedNode}_${prop}`
        ) || []
      );
    } else {
      setAvailableProperties([]);
    }
  }, [selectedNode, selectedRelationships, nodeProperties]);

  const handleSearch = async () => {
    setError(null);
    const query = constructQuery(selectedProperties);

    if (!query) {
      setError('Query is empty');
      return;
    }

    try {
      const result = await runQuery(searchTerm);
      setQueryResult(result);
      const processedData = processQueryResult(result);
      setGraphData(processedData);
      setIsGraphVisible(true);
      setSelectedType(null);
    } catch (error) {
      console.error('Error executing API query:', error);
      setError('Failed to execute query');
      setGraphData(null);
    }
  };

  const handleTypeSelect = (type: 'node' | 'relationship') => {
    setSelectedType((prevType) => (prevType === type ? null : type));
    setSelectedNode(null);
    setSelectedRelationships([]);
    setSelectedProperties({});
  };

  const handleNodeSelect = (nodeName: string) => {
    setSelectedNode(nodeName);
    setSearchTerm(nodeName);
    setSelectedProperties({});
    setSelectedRelationships([]);
    setAvailableProperties(
      nodeProperties[nodeName]?.map(
        (prop) => `${nodeName}_${prop}`
      ) || []
    );
  };

  const handleRelationshipSelect = (newSelectedRelationships: string[]) => {
    setSelectedRelationships(newSelectedRelationships);
    const queryString = newSelectedRelationships.reduce((acc, rel, index) => {
      const [source, relType, target] = rel.split(' - ');
      if (index === 0) {
        return `${source} - ${relType} - ${target}`;
      }
      return `${acc} - ${relType} - ${target}`;
    }, '');

    setSearchTerm(queryString);
  };

  const handleReset = () => {
    setSelectedType(null);
    setSearchTerm('');
    setSelectedNode(null);
    setSelectedRelationships([]);
    setSelectedProperties({});
    setAvailableProperties([]);
    setQueryResult(null);
    setIsGraphVisible(false);
    setGraphData(null);
    setError(null);
  };

  const handleZoomChange = (level: number) => {
    setZoomLevel(level);
  };

  return (
    <div className=''>
      <Navbar onZoomChange={handleZoomChange} />
      <SearchBar
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        availableProperties={availableProperties}
        selectedProperties={selectedProperties}
        setSelectedProperties={setSelectedProperties}
        onReset={handleReset}
        nodeProperties={nodeProperties}
      />
      <div className='mt-3 px-2 w-1/5 flex space-x-2'>
        <button
          className={`px-3 border py-1 hover:text-black rounded ${
            selectedType === 'node'
              ? 'bg-transparent text-gray-600'
              : 'text-gray-600'
          }`}
          onClick={() => handleTypeSelect('node')}
        >
          Nodes
        </button>
        <button
          className={`px-3 border hover:text-black py-1 rounded ${
            selectedType === 'relationship'
              ? 'transparent text-gray-600'
              : 'text-gray-600'
          }`}
          onClick={() => handleTypeSelect('relationship')}
        >
          Relationships
        </button>
      </div>
      <div className='flex px-2 justify-between'>
        <div>
          {selectedType === 'node' && (
            <NodeList
              onNodeSelect={handleNodeSelect}
              nodes={Object.keys(nodeProperties)}
            />
          )}
          {selectedType === 'relationship' && (
            <RelationshipList
              relationships={relationships}
              onRelationshipSelect={handleRelationshipSelect}
              selectedRelationships={selectedRelationships}
            />
          )}
        </div>

        {graphData && graphData.nodes.length > 0 && (
          <div className='mt-4 flex justify-between'>
            <GraphVisualization
              relationships={relationships}
              data={graphData}
              isVisible={isGraphVisible}
              zoomLevel={zoomLevel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphExplorer;