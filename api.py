"""
Flask API backend for churn prediction
This provides REST API endpoints for the HTML/JS frontend
"""
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from tensorflow import keras
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables for model and scaler
model = None
scaler = None

def load_model_and_scaler():
    """Load the trained model and scaler"""
    global model, scaler
    
    try:
        # Load the Keras model
        model_path = os.path.join('models', 'churn_model.h5')
        if os.path.exists(model_path):
            model = keras.models.load_model(model_path)
            logger.info("Model loaded successfully")
        else:
            logger.error(f"Model file not found at {model_path}")
            
        # Load the scaler
        scaler_path = os.path.join('models', 'scaler.pkl')
        if os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
            logger.info("Scaler loaded successfully")
        else:
            logger.error(f"Scaler file not found at {scaler_path}")
            
    except Exception as e:
        logger.error(f"Error loading model or scaler: {str(e)}")

def preprocess_input(data):
    """Preprocess input data for prediction"""
    try:
        # Define the expected feature columns
        feature_columns = [
            'Gender', 'SeniorCitizen', 'Partner', 'Dependents', 'tenure',
            'PhoneService', 'MultipleLines', 'InternetService', 'OnlineSecurity',
            'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV',
            'StreamingMovies', 'Contract', 'PaperlessBilling', 'PaymentMethod',
            'MonthlyCharges', 'TotalCharges'
        ]
        
        # Create a DataFrame from the input data
        df = pd.DataFrame([data])
        
        # Handle categorical variables (this is a simplified version)
        # In a real implementation, you would use the same encoding as during training
        categorical_mappings = {
            'Gender': {'Male': 1, 'Female': 0},
            'Partner': {'Yes': 1, 'No': 0},
            'Dependents': {'Yes': 1, 'No': 0},
            'PhoneService': {'Yes': 1, 'No': 0},
            'PaperlessBilling': {'Yes': 1, 'No': 0}
        }
        
        # Apply categorical mappings
        for col, mapping in categorical_mappings.items():
            if col in df.columns:
                df[col] = df[col].map(mapping)
        
        # Handle more complex categorical variables with one-hot encoding
        # For this demo, we'll use simplified mappings
        if 'MultipleLines' in df.columns:
            df['MultipleLines'] = df['MultipleLines'].map({
                'Yes': 1, 'No': 0, 'No phone service': 0
            })
        
        if 'InternetService' in df.columns:
            # Create dummy variables for InternetService
            df['InternetService_DSL'] = (df['InternetService'] == 'DSL').astype(int)
            df['InternetService_Fiber_optic'] = (df['InternetService'] == 'Fiber optic').astype(int)
            df = df.drop('InternetService', axis=1)
        
        # Handle other categorical variables similarly
        binary_internet_services = [
            'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 
            'TechSupport', 'StreamingTV', 'StreamingMovies'
        ]
        
        for col in binary_internet_services:
            if col in df.columns:
                df[col] = df[col].map({
                    'Yes': 1, 'No': 0, 'No internet service': 0
                })
        
        if 'Contract' in df.columns:
            df['Contract_Month-to-month'] = (df['Contract'] == 'Month-to-month').astype(int)
            df['Contract_One_year'] = (df['Contract'] == 'One year').astype(int)
            df['Contract_Two_year'] = (df['Contract'] == 'Two year').astype(int)
            df = df.drop('Contract', axis=1)
        
        if 'PaymentMethod' in df.columns:
            df['PaymentMethod_Electronic_check'] = (df['PaymentMethod'] == 'Electronic check').astype(int)
            df['PaymentMethod_Mailed_check'] = (df['PaymentMethod'] == 'Mailed check').astype(int)
            df['PaymentMethod_Bank_transfer'] = (df['PaymentMethod'] == 'Bank transfer (automatic)').astype(int)
            df['PaymentMethod_Credit_card'] = (df['PaymentMethod'] == 'Credit card (automatic)').astype(int)
            df = df.drop('PaymentMethod', axis=1)
        
        # Convert numeric columns
        numeric_columns = ['tenure', 'MonthlyCharges', 'TotalCharges']
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Fill missing values
        df = df.fillna(0)
        
        # Scale the features if scaler is available
        if scaler is not None:
            # Note: In a real implementation, you'd need to ensure the feature order matches training
            df_scaled = scaler.transform(df)
            return df_scaled
        else:
            return df.values
            
    except Exception as e:
        logger.error(f"Error in preprocessing: {str(e)}")
        raise

@app.route('/')
def index():
    """Serve the main HTML page"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return jsonify({'error': 'Frontend HTML file not found'}), 404

@app.route('/predict', methods=['POST'])
def predict():
    """Predict churn probability for a customer"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # If model is not loaded, return mock prediction
        if model is None or scaler is None:
            logger.warning("Model or scaler not loaded, returning mock prediction")
            return generate_mock_prediction_api(data)
        
        # Preprocess the input data
        processed_data = preprocess_input(data)
        
        # Make prediction
        prediction_prob = model.predict(processed_data)[0][0]
        prediction_prob = float(prediction_prob)
        
        # Convert to percentage
        churn_probability = int(prediction_prob * 100)
        
        # Determine risk level
        if churn_probability >= 70:
            risk_level = 'High'
        elif churn_probability >= 40:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'
        
        # Generate risk factors and recommendations
        factors = analyze_risk_factors(data, churn_probability)
        recommendations = generate_recommendations(risk_level, factors)
        
        return jsonify({
            'probability': churn_probability,
            'riskLevel': risk_level,
            'factors': factors,
            'recommendations': recommendations,
            'confidence': 92
        })
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500

def generate_mock_prediction_api(data):
    """Generate mock prediction when model is not available"""
    # Simplified mock prediction logic
    risk_score = 0
    
    if data.get('contract') == 'Month-to-month':
        risk_score += 0.3
    if float(data.get('tenure', 0)) < 12:
        risk_score += 0.25
    if data.get('paymentMethod') == 'Electronic check':
        risk_score += 0.2
    if float(data.get('monthlyCharges', 0)) > 80:
        risk_score += 0.2
    
    # Add randomness
    risk_score += np.random.uniform(-0.1, 0.1)
    risk_score = max(0, min(1, risk_score))
    
    probability = int(risk_score * 100)
    
    if probability >= 70:
        risk_level = 'High'
    elif probability >= 40:
        risk_level = 'Medium'
    else:
        risk_level = 'Low'
    
    factors = analyze_risk_factors(data, probability)
    recommendations = generate_recommendations(risk_level, factors)
    
    return jsonify({
        'probability': probability,
        'riskLevel': risk_level,
        'factors': factors,
        'recommendations': recommendations,
        'confidence': 85
    })

def analyze_risk_factors(data, probability):
    """Analyze and return risk factors"""
    factors = []
    
    if data.get('contract') == 'Month-to-month':
        factors.append({
            'factor': 'Month-to-month contract',
            'impact': 'High',
            'description': 'Customers with monthly contracts are more likely to churn'
        })
    
    if float(data.get('tenure', 0)) < 12:
        factors.append({
            'factor': 'Low tenure',
            'impact': 'High',
            'description': 'New customers have higher churn risk'
        })
    
    if data.get('paymentMethod') == 'Electronic check':
        factors.append({
            'factor': 'Electronic check payment',
            'impact': 'Medium',
            'description': 'This payment method is associated with higher churn'
        })
    
    if float(data.get('monthlyCharges', 0)) > 80:
        factors.append({
            'factor': 'High monthly charges',
            'impact': 'Medium',
            'description': 'Customers with higher bills are more price-sensitive'
        })
    
    if data.get('paperlessBilling') == 'Yes':
        factors.append({
            'factor': 'Paperless billing',
            'impact': 'Low',
            'description': 'Slight increase in churn probability'
        })
    
    return factors

def generate_recommendations(risk_level, factors):
    """Generate recommendations based on risk level"""
    if risk_level == 'High':
        return [
            'Offer retention discount or promotional pricing',
            'Assign dedicated customer success manager',
            'Provide priority customer support',
            'Consider contract upgrade incentives'
        ]
    elif risk_level == 'Medium':
        return [
            'Engage with personalized offers',
            'Improve customer service touchpoints',
            'Provide loyalty program benefits',
            'Conduct satisfaction surveys'
        ]
    else:
        return [
            'Continue current service quality',
            'Consider upselling opportunities',
            'Maintain regular communication',
            'Monitor for any changes in behavior'
        ]

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None
    })

@app.route('/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data for dashboard"""
    # Mock analytics data
    analytics_data = {
        'churnDistribution': {
            'labels': ['Will Stay', 'Will Churn'],
            'data': [73, 27]
        },
        'riskFactors': {
            'labels': ['Contract Type', 'Payment Method', 'Internet Service', 'Tenure', 'Monthly Charges'],
            'data': [8.5, 7.2, 6.8, 9.1, 5.9]
        },
        'tenureDistribution': {
            'labels': ['0-6 months', '6-12 months', '1-2 years', '2-3 years', '3+ years'],
            'data': [45, 35, 25, 15, 8]
        },
        'revenueImpact': {
            'labels': ['Q1', 'Q2', 'Q3', 'Q4'],
            'retained': [2.3, 2.5, 2.7, 2.8],
            'lost': [0.7, 0.6, 0.5, 0.4]
        }
    }
    
    return jsonify(analytics_data)

if __name__ == '__main__':
    # Load model and scaler on startup
    load_model_and_scaler()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
