import axios from 'axios';

// const BASE_URL = process.env.REACT_APP_API_BASE_URL; 
const BASE_URL = 'http://localhost:8000/api/'

const api = axios.create({
  baseURL: BASE_URL,
});

export const getItems = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    // Handle errors appropriately, e.g., using a state management library to store error messages
    console.error('Error fetching data:', error);
    throw error; // Re-throw to allow components to handle errors gracefully
  }
};

export const postItem = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    // Handle errors appropriately as in getItems
    console.error('Error posting data:', error);
    throw error;
  }
};