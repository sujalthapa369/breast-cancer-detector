from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_breast_cancer
import os
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Global variables for model and scaler
model = None
scaler = None
feature_names = None

def create_and_train_model():
    """Create and train a breast cancer detection model if not exists"""
    global model, scaler, feature_names
    
    # Load the breast cancer dataset
    data = load_breast_cancer()
    X, y = data.data, data.target
    feature_names = data.feature_names
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Save the model and scaler
    joblib.dump(model, 'breast_cancer_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    
    accuracy = model.score(X_test_scaled, y_test)
    print(f"Model trained with accuracy: {accuracy:.4f}")
    
    return model, scaler, feature_names

def load_model():
    """Load existing model or create new one"""
    global model, scaler, feature_names
    
    try:
        model = joblib.load('breast_cancer_model.pkl')
        scaler = joblib.load('scaler.pkl')
        # Load feature names from dataset
        data = load_breast_cancer()
        feature_names = data.feature_names
        print("Model loaded successfully!")
    except FileNotFoundError:
        print("Model not found, creating new one...")
        model, scaler, feature_names = create_and_train_model()

# Initialize model when app starts
load_model()

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Breast Cancer Detection API",
        "status": "running",
        "endpoints": {
            "/predict": "POST - Make prediction",
            "/features": "GET - Get feature names",
            "/health": "GET - Health check"
        }
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    })

@app.route('/features', methods=['GET'])
def get_features():
    """Return the feature names for the model"""
    return jsonify({
        "features": feature_names.tolist() if feature_names is not None else [],
        "count": len(feature_names) if feature_names is not None else 0
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Check if features are provided
        if 'features' not in data:
            return jsonify({"error": "Features not provided"}), 400
        
        features = data['features']
        
        # Validate feature count
        if len(features) != len(feature_names):
            return jsonify({
                "error": f"Expected {len(feature_names)} features, got {len(features)}"
            }), 400
        
        # Convert to numpy array and reshape
        input_data = np.array(features).reshape(1, -1)
        
        # Scale the input
        input_scaled = scaler.transform(input_data)
        
        # Make prediction
        prediction = model.predict(input_scaled)[0]
        prediction_proba = model.predict_proba(input_scaled)[0]
        
        # Convert prediction to readable format
        result = "Malignant" if prediction == 0 else "Benign"
        confidence = max(prediction_proba) * 100
        
        return jsonify({
            "prediction": result,
            "confidence": round(confidence, 2),
            "probability": {
                "malignant": round(prediction_proba[0] * 100, 2),
                "benign": round(prediction_proba[1] * 100, 2)
            },
            "raw_prediction": int(prediction)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict-simple', methods=['POST'])
def predict_simple():
    """Simplified prediction endpoint with common features"""
    try:
        data = request.get_json()
        
        # Simple feature mapping for easier frontend integration
        simple_features = {
            'mean_radius': data.get('mean_radius', 14.0),
            'mean_texture': data.get('mean_texture', 19.0),
            'mean_perimeter': data.get('mean_perimeter', 91.0),
            'mean_area': data.get('mean_area', 654.0),
            'mean_smoothness': data.get('mean_smoothness', 0.1),
            'mean_compactness': data.get('mean_compactness', 0.1),
            'mean_concavity': data.get('mean_concavity', 0.08),
            'mean_concave_points': data.get('mean_concave_points', 0.05),
            'mean_symmetry': data.get('mean_symmetry', 0.18),
            'mean_fractal_dimension': data.get('mean_fractal_dimension', 0.06)
        }
        
        # Create full feature array with defaults for missing features
        full_features = []
        for i, feature_name in enumerate(feature_names):
            if any(key in feature_name.lower() for key in simple_features.keys()):
                # Find matching feature
                for key, value in simple_features.items():
                    if key.replace('_', ' ') in feature_name.lower():
                        full_features.append(value)
                        break
                else:
                    # Default value if no match found
                    full_features.append(np.mean([v for v in simple_features.values()]))
            else:
                # Use average of provided features for missing ones
                full_features.append(np.mean([v for v in simple_features.values()]))
        
        # Make prediction
        input_data = np.array(full_features).reshape(1, -1)
        input_scaled = scaler.transform(input_data)
        
        prediction = model.predict(input_scaled)[0]
        prediction_proba = model.predict_proba(input_scaled)[0]
        
        result = "Malignant" if prediction == 0 else "Benign"
        confidence = max(prediction_proba) * 100
        
        return jsonify({
            "prediction": result,
            "confidence": round(confidence, 2),
            "probability": {
                "malignant": round(prediction_proba[0] * 100, 2),
                "benign": round(prediction_proba[1] * 100, 2)
            },
            "input_features": simple_features
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
