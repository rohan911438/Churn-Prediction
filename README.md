# Bank Customer Churn Prediction

This project is a comprehensive solution for predicting bank customer churn. It includes a data analysis notebook, a trained machine learning model, and a user-friendly web application for real-time predictions.

## 🚀 Key Features

*   **Interactive Web Application:** A Streamlit-based web app that allows for easy, on-the-fly churn predictions.
*   **High-Performance Machine Learning Model:** A classification model that has been trained and evaluated for high accuracy in predicting customer churn.
*   **In-Depth Data Analysis:** A Jupyter Notebook that provides a detailed walkthrough of the data exploration, preprocessing, and model training process.
*   **Scalable and Reproducible:** The project is structured to be easily scalable and reproducible, with all dependencies and required files included.

## 📂 Project Structure

```
├── data
│   └── customer_churn.csv
├── models
│   ├── churn_model.h5
│   └── scaler.pkl
├── notebooks
│   └── churn-prediction.ipynb
├── src
│   └── app.py
├── .gitignore
├── requirements.txt
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

To run this project, you will need:

*   Python 3.7 or later
*   The Python libraries listed in the `requirements.txt` file.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/churn-prediction.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd churn-prediction
    ```

3.  **Create and activate a virtual environment (recommended):**

    ```bash
    python -m venv churn_env
    source churn_env/bin/activate  # On Windows, use `churn_env\Scripts\activate`
    ```

4.  **Install the required libraries:**

    ```bash
    pip install -r requirements.txt
    ```

### Usage

1.  **Run the Streamlit application:**

    ```bash
    streamlit run app.py
    ```

2.  **Open your web browser and navigate to the URL provided by Streamlit (usually `http://localhost:8501`).**

3.  **Use the sidebar to input the customer's information.** The input fields include:

    *   Gender
    *   Senior Citizen status
    *   Tenure (in months)
    *   Monthly and Total Charges
    *   And other account-related details.

4.  **The application will display the churn prediction (Churn or Will Stay) and the confidence score.**

## 📊 The Data

The `customer_churn.csv` dataset is a comprehensive collection of customer data, including:

*   **Customer Demographics:** `gender`, `SeniorCitizen`, `Partner`, `Dependents`
*   **Account Information:** `tenure`, `PhoneService`, `PaperlessBilling`, `MonthlyCharges`, `TotalCharges`
*   **Subscribed Services:** `InternetService`, `Contract`, `PaymentMethod`
*   **Target Variable:** `Churn` (Yes/No)

## 🤖 The Model

The machine learning model is a classification algorithm trained on the `customer_churn.csv` dataset. The complete process of data analysis, preprocessing, and model training is documented in the `churn-prediction (1).ipynb` notebook.

### Data Preprocessing

The following preprocessing steps were applied to the data:

*   **Handling Missing Values:** Any missing values in the dataset were imputed.
*   **Encoding Categorical Variables:** Categorical features were converted into a numerical format using one-hot encoding.
*   **Feature Scaling:** Numerical features were scaled to a common range to ensure that no single feature dominates the model.

### Model Training and Evaluation

The notebook details the process of splitting the data into training and testing sets, training a classification model, and evaluating its performance using metrics such as:

*   **Accuracy:** The proportion of correctly classified instances.
*   **Precision:** The ability of the model to identify only the relevant instances.
*   **Recall:** The ability of the model to find all the relevant cases within a dataset.
*   **F1-Score:** A weighted average of precision and recall.
*   **ROC Curve and AUC:** A graphical representation of the model's performance across all classification thresholds.

The trained model and the scaler used for preprocessing are saved as `churn_model.pkl` and `scaler.pkl`, respectively.

## 🤝 Contributing

Contributions to this project are welcome. If you have any suggestions for improvement or find any bugs, please feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.