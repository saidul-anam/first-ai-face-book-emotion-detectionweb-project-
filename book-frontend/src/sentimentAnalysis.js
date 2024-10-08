// src/sentimentAnalysis.js
import axios from 'axios';

export const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/analyze-sentiment/', { text });
    return response.data; // Returns the sentiment result
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return null;
  }
};
export const analyzeEmotion = async (text) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/analyze-emotion/', { text });
    return response.data; // Returns the emotion analysis result
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return null;
  }
};