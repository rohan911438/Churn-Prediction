import streamlit as st
import pandas as pd
import numpy as np
import pickle

# Load scikit-learn model and scaler
with open("../churn_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("../models/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

st.set_page_config(page_title="Bank Churn Prediction", layout="centered")
st.title("🏦 Bank Customer Churn Prediction App")

st.markdown("Predict whether a customer will churn using a trained ML model (non-TensorFlow).")

# --- Sidebar inputs ---
st.sidebar.header("🔧 Input Customer Info")

def get_input():
    gender = st.sidebar.selectbox("Gender", ["Male", "Female"])
    SeniorCitizen = st.sidebar.selectbox("Senior Citizen", [0, 1])
    tenure = st.sidebar.slider("Tenure (months)", 0, 72, 12)
    MonthlyCharges = st.sidebar.number_input("Monthly Charges", 0.0)
    TotalCharges = st.sidebar.number_input("Total Charges", 0.0)
    Partner = st.sidebar.selectbox("Partner", ["Yes", "No"])
    Dependents = st.sidebar.selectbox("Dependents", ["Yes", "No"])
    PhoneService = st.sidebar.selectbox("Phone Service", ["Yes", "No"])
    PaperlessBilling = st.sidebar.selectbox("Paperless Billing", ["Yes", "No"])

    InternetService = st.sidebar.selectbox("Internet Service", ["DSL", "Fiber optic", "No"])
    Contract = st.sidebar.selectbox("Contract", ["Month-to-month", "One year", "Two year"])
    PaymentMethod = st.sidebar.selectbox("Payment Method", [
        "Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"
    ])

    gender = 1 if gender == "Female" else 0
    yn = lambda x: 1 if x == "Yes" else 0

    input_data = {
        'gender': gender,
        'SeniorCitizen': SeniorCitizen,
        'Partner': yn(Partner),
        'Dependents': yn(Dependents),
        'tenure': tenure,
        'PhoneService': yn(PhoneService),
        'PaperlessBilling': yn(PaperlessBilling),
        'MonthlyCharges': MonthlyCharges,
        'TotalCharges': TotalCharges,
        'InternetService_DSL': 1 if InternetService == 'DSL' else 0,
        'InternetService_Fiber optic': 1 if InternetService == 'Fiber optic' else 0,
        'InternetService_No': 1 if InternetService == 'No' else 0,
        'Contract_Month-to-month': 1 if Contract == 'Month-to-month' else 0,
        'Contract_One year': 1 if Contract == 'One year' else 0,
        'Contract_Two year': 1 if Contract == 'Two year' else 0,
        'PaymentMethod_Electronic check': 1 if PaymentMethod == 'Electronic check' else 0,
        'PaymentMethod_Mailed check': 1 if PaymentMethod == 'Mailed check' else 0,
        'PaymentMethod_Bank transfer (automatic)': 1 if PaymentMethod == 'Bank transfer (automatic)' else 0,
        'PaymentMethod_Credit card (automatic)': 1 if PaymentMethod == 'Credit card (automatic)' else 0
    }

    return pd.DataFrame([input_data])

df = get_input()

st.subheader("📋 Input Summary")
st.write(df)

# --- Prediction ---
scaled = scaler.transform(df)
prediction = model.predict_proba(scaled)[0][1]

label = "⚠️ Churn" if prediction > 0.5 else "✅ Will Stay"
confidence = round(prediction * 100, 2) if prediction > 0.5 else round((1 - prediction) * 100, 2)

st.subheader("🎯 Prediction")
st.markdown(f"### **{label}**")
st.markdown(f"Confidence: **{confidence}%**")
