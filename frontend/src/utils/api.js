import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Certificate API calls
export const getCertificates = async () => {
  try {
    const response = await api.get('/api/certificates');
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

export const getCertificate = async (tokenId) => {
  try {
    const response = await api.get(`/api/certificates/${tokenId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching certificate ${tokenId}:`, error);
    throw error;
  }
};

export const createCertificate = async (formData) => {
  try {
    const response = await api.post('/api/certificates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating certificate:', error);
    throw error;
  }
};

export const updateCertificate = async (tokenId, formData) => {
  try {
    const response = await api.put(`/api/certificates/${tokenId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating certificate ${tokenId}:`, error);
    throw error;
  }
};

export const revokeCertificate = async (tokenId) => {
  try {
    const response = await api.delete(`/api/certificates/${tokenId}`);
    return response.data;
  } catch (error) {
    console.error(`Error revoking certificate ${tokenId}:`, error);
    throw error;
  }
};

// Network info
export const getNetworkInfo = async () => {
  try {
    const response = await api.get('/api/network');
    return response.data;
  } catch (error) {
    console.error('Error fetching network info:', error);
    throw error;
  }
};

export default api; 