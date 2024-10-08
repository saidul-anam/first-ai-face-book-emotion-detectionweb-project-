import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./book.css"
const FaceEmotion = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/';

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Error accessing webcam: ', err));
    };

    loadModels();
  }, []);

  useEffect(() => {
    const detectEmotions = async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        if (detections.length > 0) {
          const face = detections[0];
          const emotions = face.expressions;
          const topEmotion = Object.keys(emotions).reduce((a, b) =>
            emotions[a] > emotions[b] ? a : b
          );
          setEmotion(topEmotion);
        }
      }
    };
    const interval = setInterval(() => detectEmotions(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="face-emotion-container">
      <h1>Face Emotion Recognition</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        className="video-feed"
        style={{ width: '50%', height: '50%', borderRadius: '5px', marginBottom: '10px' }}
      />
      <div className="emotion-display">
        {emotion ? (
          <h2>Detected Emotion: {emotion.charAt(0).toUpperCase() + emotion.slice(1)}</h2>
        ) : (
          <p>No emotion detected</p>
        )}
      </div>
    </div>
  );
};

export default FaceEmotion;
