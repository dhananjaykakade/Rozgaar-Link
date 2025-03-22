import axios from 'axios';

// Set base URL for backend API
const API_URL = "http://localhost:5000/api/audio"; // Adjust the port as needed

// Upload PDF and convert it to audio
export const uploadPDF = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch the list of converted audio files
export const getAudioFiles = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a specific audio file by its ID
export const getAudioFileById = async (audioId) => {
  try {
    const response = await axios.get(`${API_URL}/${audioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
