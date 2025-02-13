import React, { useState, useEffect, useRef } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { getColorClass } from './colormap';
import Dots from '../../assets/Dots.svg';

// ColoredSearchTerm Component
const ColoredSearchTerm = ({ searchTerm, onSearchTermChange }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const parentWidth = container.parentElement?.clientWidth || 0;
      const contentWidth = container.scrollWidth;
      if (contentWidth > parentWidth) {
        setScale(parentWidth / contentWidth);
      } else {
        setScale(1);
      }
    }
  }, [searchTerm]);

  const segments = searchTerm.split(' - ');

  return (
    <div
      ref={containerRef}
      className='flex items-center space-x-1 cursor-text origin-left'
      onClick={onSearchTermChange}
      style={{ transform: `scale(${scale})` }}
    >
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          <span className={`px-1 rounded ${getColorClass(segment)} text-white`}>
            {segment}
          </span>
          {index < segments.length - 1 && <span>-</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

// Main SearchBar Component
const SearchBar = ({
  onSearch,
  searchTerm,
  setSearchTerm,
  availableProperties,
  selectedProperties,
  setSelectedProperties,
  onReset,
  nodeProperties,
}) => {
  const [propertyValue, setPropertyValue] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const [displayedQuery, setDisplayedQuery] = useState(searchTerm);

  const nodes = Object.keys(nodeProperties);
  useEffect(() => {
    setDisplayedQuery(searchTerm);
  }, [searchTerm]);

  const handleSearchTermChange = () => setIsEditing(true);

  const getNodeOccurrences = () => {
    const segments = displayedQuery.split(' - ');
    const occurrences = {};

    segments.forEach((segment, index) => {
      const baseNodeMatch = segment.match(/^([^:]+)/);
      if (baseNodeMatch) {
        const baseNode = baseNodeMatch[1].trim().toUpperCase();
        if (!occurrences[baseNode]) {
          occurrences[baseNode] = [];
        }
        occurrences[baseNode].push(index);
      }
    });

    return occurrences;
  };

  const getAvailableIndices = () => {
    if (!selectedProperty) return [];

    const nodeType = nodes.find((node) => selectedProperty.includes(node));

    const occurrences = getNodeOccurrences();
    return occurrences[nodeType] || [];
  };

  const updateQueryWithProperty = ({
    nodeType,
    propertyName,
    value,
    index,
  }) => {
    const segments = displayedQuery.split(' - ');
    let currentInstance = -1;

    const updatedSegments = segments.map((segment) => {
      const baseNodeMatch = segment.match(/^([^:]+)/);
      if (baseNodeMatch) {
        const trimmedNode = baseNodeMatch[1].trim().toUpperCase();

        if (trimmedNode === nodeType.toUpperCase()) {
          currentInstance++;
          if (currentInstance === index) {
            return `${nodeType}:${propertyName}:${value}`;
          }
        }
      }
      return segment;
    });

    return updatedSegments.join(' - ');
  };

  const handleAddFilter = () => {
    if (selectedProperty && propertyValue) {
      const currentNode = nodes.find((node) => selectedProperty.includes(node));

      const propertyName = selectedProperty.split(`${currentNode}_`)[1];

      const newQuery = updateQueryWithProperty({
        nodeType: currentNode,
        propertyName,
        value: propertyValue,
        index: selectedIndex,
      });

      setDisplayedQuery(newQuery);
      setSearchTerm(newQuery);
      setSelectedProperty('');
      setPropertyValue('');
      setSelectedIndex(0);
    }
  };

  const handleRemoveFilter = (key) => {
    const [nodeType, indexStr] = key.split('_');
    const index = parseInt(indexStr);
    const segments = displayedQuery.split(' - ');
    let currentInstance = -1;

    const updatedSegments = segments.map((segment) => {
      const baseNodeMatch = segment.match(/^([^:]+)/);
      if (
        baseNodeMatch &&
        baseNodeMatch[1].trim().toUpperCase() === nodeType.toUpperCase()
      ) {
        currentInstance++;
        if (currentInstance === index) {
          return nodeType;
        }
      }
      return segment;
    });

    const newQuery = updatedSegments.join(' - ');
    setDisplayedQuery(newQuery);
    setSearchTerm(newQuery);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(displayedQuery);
    onSearch();
  };

  const availableIndices = getAvailableIndices();

  return (
    <form onSubmit={handleSubmit} className='flex flex-col space-y-1'>
      <div className='flex px-2 mb-2 h-8 space-x-2'>
        <div className='flex items-center justify-center border px-1 rounded gap-0'>
          <MdArrowBack className='ml-1 size-4' />
          <button
            type='button'
            onClick={onReset}
            className='text-black rounded whitespace-nowrap'
          >
            Go Back
          </button>
        </div>

        <div className='flex-grow flex items-center px-3 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-red-500'>
          {searchTerm && !isEditing ? (
            <ColoredSearchTerm
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
          ) : (
            <input
              ref={inputRef}
              type='text'
              value={displayedQuery}
              onChange={(e) => {
                setDisplayedQuery(e.target.value);
                setSearchTerm(e.target.value);
              }}
              onBlur={() => setIsEditing(false)}
              className='w-full px-1 focus:outline-none'
              placeholder='Search for nodes, relationships, or properties'
            />
          )}
        </div>

        <button
          type='submit'
          className='px-2 bg-black text-white hover:underline rounded font-bold whitespace-nowrap'
        >
          Search
        </button>
        <button
          type='button'
          onClick={onReset}
          className='px-2 bg-red-600 hover:bg-red-700 hover:underline text-white rounded font-bold whitespace-nowrap'
        >
          Reset
        </button>
        <img className='border rounded p-2' src={Dots} alt='three dots' />
      </div>

      <div className='flex px-2 h-8 space-x-2'>
        <select
          value={selectedProperty}
          onChange={(e) => {
            setSelectedProperty(e.target.value);
            setSelectedIndex(0);
          }}
          className='px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          <option value=''>Select property (optional)</option>
          {availableProperties.map((prop) => (
            <option key={prop} value={prop}>
              {prop}
            </option>
          ))}
        </select>

        {selectedProperty && availableIndices.length > 0 && (
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className='px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500'
          >
            {availableIndices.map((idx, index) => (
              <option key={idx} value={index}>
                Instance {index + 1}
              </option>
            ))}
          </select>
        )}

        <input
          type='text'
          value={propertyValue}
          onChange={(e) => setPropertyValue(e.target.value)}
          className='flex-grow px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500'
          placeholder='Property value (optional)'
        />

        <button
          type='button'
          onClick={handleAddFilter}
          className='px-2 h-8 text-gray-600 rounded border hover:text-black focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap'
        >
          Add Filter
        </button>
        <img className='border rounded p-2' src={Dots} alt='three dots' />
      </div>
    </form>
  );
};

export default SearchBar;