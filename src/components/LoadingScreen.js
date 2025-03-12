// LoadingScreen.js
import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <p className="loading-text">Loading<span className="dots"></span></p>
    </div>
  );
};

export default LoadingScreen;