// SongPlayer.js

import React, { useState } from 'react';
import axios from 'axios';

const SongPlayer = ({ emotion }) => {
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      // Fetch the Spotify token
      const tokenResponse = await axios.post('http://127.0.0.1:8000/get-spotify-token/');
      const accessToken = tokenResponse.data.access_token;

      // Fetch songs based on the emotion
      const songResponse = await axios.post('http://127.0.0.1:8000/search-songs/', {
        emotion: emotion,
        access_token: accessToken
      });

      setSongs(songResponse.data.tracks.items); // Set the song list
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchSongs}>Play Song for Emotion: {emotion}</button>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {song.name} by {song.artists.map(artist => artist.name).join(', ')}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongPlayer;
