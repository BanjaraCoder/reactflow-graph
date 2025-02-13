// src/utils/colorMap.ts

export const colorMap: { [key: string]: string } = {
   Document: 'bg-custom-dark-brown',
    VIEW: 'bg-custom-dark-grey',
    TABLE_VIEW: 'bg-custom-dark-red',
    ATTRIBUTE: 'bg-custom-light-pink',
    TRANSFORMATION: 'bg-custom-dark-brown',
    CAST: 'bg-custom-red',
    CASE_WHEN: 'bg-custom-dark-brown',
    AGGREGATION: 'bg-custom-dark-pink',
  };
  
  export const getColorClass = (key: string): string => {
    return colorMap[key] || 'bg-gray-400'; // Default to gray if no color is defined
  };