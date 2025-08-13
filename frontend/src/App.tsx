import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface PredictionResult {
  prediction: string;
  confidence: number;
  probability: {
    malignant: number;
    benign: number;
  };
  input_features?: any;
}

interface FeatureInputs {
  mean_radius: number;
  mean_texture: number;
  mean_perimeter: number;
  mean_area: number;
  mean_smoothness: number;
  mean_compactness: number;
  mean_concavity: number;
  mean_concave_points: number;
  mean_symmetry: number;
  mean_fractal_dimension: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [features, setFeatures] = useState<FeatureInputs>({
    mean_radius: 14.0,
    mean_texture: 19.0,
    mean_perimeter: 91.0,
    mean_area: 654.0,
    mean_smoothness: 0.1,
    mean_compactness: 0.1,
    mean_concavity: 0.08,
    mean_concave_points: 0.05,
    mean_symmetry: 0.18,
    mean_fractal_dimension: 0.06
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (key: keyof FeatureInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFeatures(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict-simple`, features);
      setPrediction(response.data as PredictionResult);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred while making prediction');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFeatures({
      mean_radius: 14.0,
      mean_texture: 19.0,
      mean_perimeter: 91.0,
      mean_area: 654.0,
      mean_smoothness: 0.1,
      mean_compactness: 0.1,
      mean_concavity: 0.08,
      mean_concave_points: 0.05,
      mean_symmetry: 0.18,
      mean_fractal_dimension: 0.06
    });
    setPrediction(null);
    setError('');
  };

  const featureLabels: Record<keyof FeatureInputs, { label: string; description: string; min: number; max: number; step: number }> = {
    mean_radius: { label: 'Mean Radius', description: 'Mean of distances from center to points on perimeter', min: 6, max: 30, step: 0.1 },
    mean_texture: { label: 'Mean Texture', description: 'Standard deviation of gray-scale values', min: 9, max: 40, step: 0.1 },
    mean_perimeter: { label: 'Mean Perimeter', description: 'Mean perimeter of the tumor', min: 43, max: 189, step: 1 },
    mean_area: { label: 'Mean Area', description: 'Mean area of the tumor', min: 143, max: 2501, step: 1 },
    mean_smoothness: { label: 'Mean Smoothness', description: 'Local variation in radius lengths', min: 0.05, max: 0.16, step: 0.001 },
    mean_compactness: { label: 'Mean Compactness', description: 'Perimeter^2 / area - 1.0', min: 0.019, max: 0.345, step: 0.001 },
    mean_concavity: { label: 'Mean Concavity', description: 'Severity of concave portions', min: 0, max: 0.427, step: 0.001 },
    mean_concave_points: { label: 'Mean Concave Points', description: 'Number of concave portions', min: 0, max: 0.201, step: 0.001 },
    mean_symmetry: { label: 'Mean Symmetry', description: 'Symmetry of the tumor', min: 0.106, max: 0.304, step: 0.001 },
    mean_fractal_dimension: { label: 'Mean Fractal Dimension', description: 'Coastline approximation - 1', min: 0.049, max: 0.097, step: 0.001 }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🩺 Breast Cancer Detection</h1>
        <p>Machine Learning-based Breast Cancer Diagnosis Tool</p>
      </header>
      
      <main className="App-main">
        <div className="feature-inputs">
          <h2>Enter Tumor Features</h2>
          <div className="input-grid">
            {Object.entries(featureLabels).map(([key, config]) => (
              <div key={key} className="input-group">
                <label htmlFor={key}>
                  {config.label}
                  <span className="tooltip">
                    <span className="tooltip-text">{config.description}</span>
                  </span>
                </label>
                <input
                  id={key}
                  type="number"
                  value={features[key as keyof FeatureInputs]}
                  onChange={(e) => handleInputChange(key as keyof FeatureInputs, e.target.value)}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  className="feature-input"
                />
              </div>
            ))}
          </div>
          
          <div className="button-group">
            <button 
              onClick={handlePredict} 
              disabled={loading}
              className="predict-button"
            >
              {loading ? 'Analyzing...' : 'Predict'}
            </button>
            <button 
              onClick={resetForm}
              className="reset-button"
            >
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {prediction && (
          <div className={`prediction-result ${prediction.prediction.toLowerCase()}`}>
            <h2>Prediction Result</h2>
            <div className="result-content">
              <div className="prediction-main">
                <span className="prediction-label">Diagnosis:</span>
                <span className={`prediction-value ${prediction.prediction.toLowerCase()}`}>
                  {prediction.prediction}
                </span>
              </div>
              <div className="confidence">
                <span>Confidence: {prediction.confidence}%</span>
              </div>
              <div className="probabilities">
                <div className="prob-item">
                  <span>Malignant: {prediction.probability.malignant}%</span>
                  <div className="prob-bar">
                    <div 
                      className="prob-fill malignant" 
                      style={{width: `${prediction.probability.malignant}%`}}
                    ></div>
                  </div>
                </div>
                <div className="prob-item">
                  <span>Benign: {prediction.probability.benign}%</span>
                  <div className="prob-bar">
                    <div 
                      className="prob-fill benign" 
                      style={{width: `${prediction.probability.benign}%`}}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="disclaimer">
                <p>⚠️ This is a demonstration tool and should not be used for actual medical diagnosis. Always consult with healthcare professionals.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
