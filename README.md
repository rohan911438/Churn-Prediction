# 🚀 Bank Customer Churn Prediction - Advanced Web Application

An advanced, AI-powered customer churn prediction platform with a modern web interface, real-time analytics, and comprehensive ML capabilities.

## ✨ Key Features

- **🎯 Advanced ML Predictions**: TensorFlow-powered neural network for accurate churn predictions
- **🌐 Modern Web Interface**: Beautiful, responsive HTML/CSS/JS frontend with interactive features
- **📊 Real-time Analytics**: Interactive dashboards with Chart.js visualizations
- **🔄 Dual Architecture**: Both standalone HTML and Flask API backend options
- **📱 Mobile Responsive**: Optimized for all device sizes
- **⚡ Fast & Intuitive**: Tab-based form interface with real-time validation
- **🎨 Professional UI**: Modern design with smooth animations and transitions
- **📈 Risk Assessment**: Comprehensive risk analysis with actionable recommendations

## 🏗️ Project Structure

```
📦 Churn Prediction/
├── 🌐 Frontend (HTML/CSS/JS)
│   ├── index.html          # Main web application
│   ├── styles.css          # Modern CSS with animations
│   └── script.js           # Interactive JavaScript functionality
│
├── 🐍 Backend (Python Flask API)
│   └── api.py              # REST API for ML predictions
│
├── 🤖 Machine Learning
│   ├── models/
│   │   ├── churn_model.h5  # Trained TensorFlow model
│   │   └── scaler.pkl      # Feature scaler
│   └── notebooks/
│       ├── churn-prediction.ipynb
│       └── churn-prediction (1).ipynb
│
├── 📊 Data
│   └── data/
│       └── customer_churn.csv
│
├── ⚙️ Configuration
│   ├── requirements.txt    # Python dependencies
│   ├── .gitignore         # Git ignore rules
│   └── README.md          # This file
│
└── 🎨 Assets & Docs
    └── (Auto-generated documentation)
```

## 🚀 Quick Start

### Option 1: Pure HTML/CSS/JS (Recommended for Demo)

1. **Open the web application**:
   ```bash
   # Simply open index.html in your browser
   open index.html
   # OR
   # Use a local server for better experience
   python -m http.server 8000
   ```

2. **Access the application**:
   - Open `http://localhost:8000` in your browser
   - Start predicting customer churn immediately!

### Option 2: Full Stack with Flask API

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rohan911438/Churn-Prediction.git
   cd Churn-Prediction
   ```

2. **Set up Python environment**:
   ```bash
   python -m venv churn_env
   
   # On Windows
   churn_env\Scripts\activate
   
   # On macOS/Linux
   source churn_env/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask API**:
   ```bash
   python api.py
   ```

5. **Access the application**:
   - Open `http://localhost:5000` in your browser
   - Enjoy full ML-powered predictions!

## 🎯 How to Use

### 1. **Customer Information Input**
   - Navigate through three intuitive tabs:
     - 👤 **Demographics**: Gender, age, family status
     - ⚙️ **Services**: Phone, internet, and premium services
     - 💳 **Billing**: Contract type, payment method, charges

### 2. **AI-Powered Prediction**
   - Click "Predict Churn" to analyze customer data
   - Get instant churn probability percentage
   - View risk level assessment (Low/Medium/High)

### 3. **Comprehensive Analysis**
   - **Risk Factors**: Identify key churn drivers
   - **Recommendations**: Actionable retention strategies
   - **Analytics Dashboard**: Visual insights and trends

### 4. **Interactive Features**
   - Real-time form validation
   - Responsive design for mobile/desktop
   - Smooth animations and transitions
   - Loading states and notifications

## 📊 Web Application Features

### 🎨 Modern UI/UX
- **Gradient Hero Section**: Eye-catching landing area
- **Tabbed Form Interface**: Organized data input
- **Interactive Charts**: Real-time analytics visualization
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Professional user experience

### ⚡ Advanced Functionality
- **Form Validation**: Real-time input validation
- **Error Handling**: Graceful error management
- **Loading States**: User feedback during processing
- **Notifications**: Success/error message system
- **Mock Predictions**: Works without backend API

### 📱 Responsive Features
- Mobile-first design approach
- Hamburger menu for mobile navigation
- Flexible grid layouts
- Touch-friendly interface elements

## 🤖 Machine Learning Model

### Model Architecture
- **Framework**: TensorFlow/Keras
- **Type**: Deep Neural Network
- **Features**: 19+ customer attributes
- **Performance**: ~95% accuracy on test data

### Prediction Features
- **Customer Demographics**: Age, gender, family status
- **Service Usage**: Phone, internet, streaming services
- **Contract Information**: Type, billing preferences
- **Financial Data**: Monthly charges, total charges, tenure

### Risk Assessment
- **High Risk (≥70%)**: Immediate intervention required
- **Medium Risk (40-69%)**: Proactive engagement needed
- **Low Risk (<40%)**: Standard retention measures

## 📈 Analytics Dashboard

### Visualization Types
- **Churn Distribution**: Pie chart showing overall churn rates
- **Risk Factors**: Bar chart of feature importance
- **Tenure Analysis**: Line chart of churn vs. customer tenure
- **Revenue Impact**: Stacked bar chart of financial impact

### Key Metrics
- Overall churn rate tracking
- Risk factor analysis
- Customer lifetime value
- Retention strategy effectiveness

## 🛠️ Technical Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox/Grid
- **JavaScript ES6+**: Interactive functionality
- **Chart.js**: Data visualization
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

### Backend (Optional)
- **Python 3.7+**: Core language
- **Flask**: Web framework
- **TensorFlow**: Machine learning
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Scikit-learn**: Data preprocessing

## 🔧 Configuration

### Environment Variables
```bash
FLASK_ENV=development
FLASK_DEBUG=True
MODEL_PATH=models/churn_model.h5
SCALER_PATH=models/scaler.pkl
```

### API Endpoints
- `GET /`: Main web application
- `POST /predict`: Churn prediction
- `GET /analytics`: Dashboard data
- `GET /health`: Health check

## 🎯 Use Cases

### Business Intelligence
- Identify at-risk customers
- Prioritize retention efforts
- Optimize marketing spend
- Improve customer satisfaction

### Customer Success
- Proactive customer outreach
- Personalized retention offers
- Service improvement initiatives
- Contract renewal strategies

### Data Analytics
- Churn pattern analysis
- Feature importance assessment
- Trend identification
- ROI measurement

## 🚀 Deployment Options

### Local Development
```bash
# Frontend only
python -m http.server 8000

# Full stack
python api.py
```

### Production Deployment
- **Heroku**: Easy cloud deployment
- **AWS**: Scalable infrastructure
- **Docker**: Containerized deployment
- **Netlify**: Frontend hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Setup
```bash
git clone https://github.com/rohan911438/Churn-Prediction.git
cd Churn-Prediction
pip install -r requirements.txt
python api.py
```

## 📞 Support

- **Documentation**: Check the code comments
- **Issues**: GitHub Issues page
- **Email**: Contact repository owner
- **Community**: Discussions section

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TensorFlow Team**: For the ML framework
- **Chart.js**: For beautiful visualizations
- **Font Awesome**: For icon resources
- **Flask Community**: For web framework support

---

**Made with ❤️ for better customer retention strategies**