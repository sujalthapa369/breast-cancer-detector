# 🩺 Breast Cancer Detection Web Application

A full-stack web application for breast cancer detection using machine learning. Built with Flask backend and React.js frontend.

## 📋 Features

- **Machine Learning Model**: Random Forest classifier trained on breast cancer dataset
- **Interactive Frontend**: User-friendly React.js interface with real-time predictions
- **REST API**: Flask backend with multiple prediction endpoints
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Results**: Instant predictions with confidence scores
- **Educational Tooltips**: Helpful descriptions for each feature

## 🚀 Tech Stack

### Backend
- **Flask**: Web framework
- **scikit-learn**: Machine learning library
- **NumPy & Pandas**: Data processing
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React.js**: Frontend framework with TypeScript
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with gradients and animations

### Deployment
- **Vercel**: Serverless deployment platform

## 🏗️ Project Structure

```
breast-cancer-detector/
├── backend/
│   ├── app.py              # Flask application
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   └── App.css        # Styling
│   └── package.json       # Node.js dependencies
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### GET `/`
Returns API information and available endpoints.

### GET `/health`
Health check endpoint to verify API status.

### GET `/features`
Returns the list of features required by the ML model.

### POST `/predict`
Full prediction with all 30 features.

**Request Body:**
```json
{
  "features": [14.0, 19.0, 91.0, ...]  // Array of 30 numerical values
}
```

### POST `/predict-simple`
Simplified prediction with 10 key features.

**Request Body:**
```json
{
  "mean_radius": 14.0,
  "mean_texture": 19.0,
  "mean_perimeter": 91.0,
  "mean_area": 654.0,
  "mean_smoothness": 0.1,
  "mean_compactness": 0.1,
  "mean_concavity": 0.08,
  "mean_concave_points": 0.05,
  "mean_symmetry": 0.18,
  "mean_fractal_dimension": 0.06
}
```

**Response:**
```json
{
  "prediction": "Benign",
  "confidence": 92.5,
  "probability": {
    "malignant": 7.5,
    "benign": 92.5
  }
}
```

## 🌐 Deployment to Vercel

### Method 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub repository
2. Connect repository to Vercel dashboard
3. Vercel will automatically deploy on push

### Environment Variables

Set the following environment variable in Vercel:

- `REACT_APP_API_URL`: Set to your Vercel API URL (e.g., `https://your-app.vercel.app/api`)

## 📊 Model Information

- **Algorithm**: Random Forest Classifier
- **Dataset**: Wisconsin Breast Cancer Dataset (sklearn)
- **Features**: 30 numerical features describing cell nuclei
- **Accuracy**: ~95% on test set
- **Classes**: 
  - Malignant (0)
  - Benign (1)

## 🔍 Feature Descriptions

The model uses 10 key features:

1. **Mean Radius**: Average distance from center to perimeter points
2. **Mean Texture**: Standard deviation of gray-scale values
3. **Mean Perimeter**: Average perimeter of the cell nuclei
4. **Mean Area**: Average area of the cell nuclei
5. **Mean Smoothness**: Local variation in radius lengths
6. **Mean Compactness**: Perimeter² / area - 1.0
7. **Mean Concavity**: Severity of concave portions
8. **Mean Concave Points**: Number of concave portions
9. **Mean Symmetry**: Symmetry of the cell nuclei
10. **Mean Fractal Dimension**: Coastline approximation - 1

## ⚠️ Disclaimer

**This application is for educational and demonstration purposes only. It should NOT be used for actual medical diagnosis. Always consult with qualified healthcare professionals for medical advice and diagnosis.**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Wisconsin Breast Cancer Dataset from UCI Machine Learning Repository
- scikit-learn for the machine learning tools
- React.js team for the amazing frontend framework
- Vercel for the seamless deployment platform
