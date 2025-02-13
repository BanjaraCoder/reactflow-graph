import axios from 'axios';

export const runQuery = async (query: string): Promise<any> => {
  try {
    console.log('Sending request to API with query:', query);
    const response = await axios.post(
      'https://neo4j-be-1060627628276.us-central1.run.app/query_graph',
     
      {
        query: query,
      },

      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('API Error Response:', error.response.data);
    }
    console.error('Error executing API query:', error);
    throw error;
  }
};

export const handleAdjacentNodes = async ({
  node_type,
  node_property,
  node_property_value,
}: {
  node_type: string;
  node_property: string;
  node_property_value: string;
}): Promise<any> => {
  try {
    const response = await axios.post(
      'https://neo4j-be-1060627628276.us-central1.run.app/get_adjacent_nodes',
      {
        node_type,
        node_property,
        node_property_value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    console.log('API Response:', response.data);
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('API Error Response:', error.response.data);
    }
    console.error('Error executing API queryyyyyy:', error);
    throw error;
  }
};
export const fetchDataModel = async (): Promise<any> => {
  try {
    const response = await axios.get('https://neo4j-be-1060627628276.us-central1.run.app/data_model');
    return response.data;
  } catch (error) {
    console.error('Error fetching data model:', error);
    throw error;
  }
};
export const getcount = async (): Promise<any> => {
  try {
    const response = await axios.get('https://neo4j-be-1060627628276.us-central1.run.app/node_type_counts');
    return response.data;
  } catch (error) {
    console.error('Error fetching count:', error);
    throw error;
  }
};