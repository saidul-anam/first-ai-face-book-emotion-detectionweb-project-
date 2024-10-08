import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './book.css';
const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [topEmotion, setTopEmotion] = useState(null);
  const [song, setSong] = useState(null); // Store song data
  const [accessToken, setAccessToken] = useState(null); // Store Spotify access token

  const analyzeEmotion = async (text) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze-emotion/', { text });
      return response.data;
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      return [];
    }
  };

  const fetchSpotifyToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/get-spotify-token/');
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
    }
  };

  const fetchSongForEmotion = async (emotion) => {
    if (!emotion || !accessToken) return;
    try {
      const response = await axios.post('http://127.0.0.1:8000/search-songs/', {
        emotion: emotion.label,
        access_token: accessToken
      });
      setSong(response.data); // Set the song data returned from the server
    } catch (error) {
      console.error('Error fetching song:', error);
    }
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/books/${bookId}/`)
      .then(response => {
        setBook(response.data);
        return analyzeEmotion(response.data.description);
      })
      .then(emotionAnalysis => {
        if (emotionAnalysis && emotionAnalysis[0]) {
          const topEmotion = emotionAnalysis[0].reduce((prev, current) => 
            (prev.score > current.score) ? prev : current
          );
          setTopEmotion(topEmotion);
        }
      })
      .catch(error => {
        console.log('Error fetching book details:', error);
      });

    // Fetch Spotify token once when the component loads
    fetchSpotifyToken();
  }, [bookId]);

  useEffect(() => {
    // Fetch the song whenever the top emotion changes
    if (topEmotion) {
      fetchSongForEmotion(topEmotion);
    }
  }, [topEmotion, accessToken]);

  return (
    <div className="book-detail-container">
      {book ? (
        <div className="book-details">
          <h1 className="book-title">{book.title}</h1>
          <h2 className="book-author">{book.author}</h2>
          <p className="book-description">{book.description}</p>

          {topEmotion ? (
            <div className="emotion-analysis">
              <h3>Top Emotion</h3>
              <p>{topEmotion.label}: {topEmotion.score ? topEmotion.score.toFixed(2) : 'N/A'}</p>
            </div>
          ) : (
            <div className="emotion-analysis">
              <h3>Emotion Analysis</h3>
              <p>No emotions detected.</p>
            </div>
          )}

          {song && song.preview_url ? (
            <div className="song-preview">
              <h3>Suggested Song: {song.song_name} by {song.artist}</h3>
              <audio controls>
                <source src={song.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p>No song available for this emotion.</p>
          )}
        </div>
      ) : (
        <p>Loading book details...</p>
      )}
    </div>
  );
};

export default BookDetail;
