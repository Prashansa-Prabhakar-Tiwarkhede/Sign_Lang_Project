import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function App() {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState({ emotion: "Neutral", landmarks: 0 });

  const captureFrame = async () => {
    if (webcamRef.current) {
      // 1. Capture the current frame as a Base64 string
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      // 2. Convert the Base64 image to a "Blob" (File format) for Python
      const blob = await fetch(imageSrc).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      try {
        // 3. Send the image to your FastAPI Backend
        const response = await axios.post('http://127.0.0.1:8000/predict', formData);
        
        // 4. Update the screen with the AI's answer
        setPrediction({
          emotion: response.data.emotion,
          landmarks: response.data.landmark_count
        });
      } catch (error) {
        console.error("Connection to Python failed. Is the server running?");
      }
    }
  };

  // Set up a loop to run every 200ms
  useEffect(() => {
    const interval = setInterval(captureFrame, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#1a73e8' }}>✋ Sign Language AI Dashboard</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
        {/* WEBCAM VIEW */}
        <div style={{ borderRadius: '15px', overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
          />
        </div>

        {/* AI ANALYSIS DATA */}
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', minWidth: '300px' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📊 Real-Time Data</h2>
          
          <div style={{ margin: '20px 0', fontSize: '1.2rem' }}>
            <p><strong>Detected Emotion:</strong> <span style={{color: '#d93025'}}>{prediction.emotion}</span></p>
            <p><strong>Hand Landmarks:</strong> <span style={{color: '#188038'}}>{prediction.landmarks}</span></p>
          </div>

          <div style={{
            padding: '15px', 
            borderRadius: '10px', 
            backgroundColor: prediction.landmarks > 0 ? '#e6f4ea' : '#fce8e6',
            color: prediction.landmarks > 0 ? '#137333' : '#c5221f',
            fontWeight: 'bold'
          }}>
            {prediction.landmarks > 0 ? "✅ Hand Tracking Active" : "❌ No Hand Detected"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;