// Global variables
let currentTab = 'demographics';
let predictionResults = {};
let charts = {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupNavigation();
    setupTabs();
    setupForms();
    setupCharts();
    setupScrollEffects();
    
    // Show initial tab
    showTab('demographics');
    
    console.log('Churn Prediction App initialized successfully');
}

// Navigation setup
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Close mobile menu
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Tab setup
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            showTab(tabId);
        });
    });
}

// Show specific tab
function showTab(tabId) {
    // Update buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });
    
    // Update content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.getAttribute('id') === tabId) {
            content.classList.add('active');
        }
    });
    
    currentTab = tabId;
}

// Form setup
function setupForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
    });
    
    // Clear and predict buttons
    const clearButtons = document.querySelectorAll('.btn-clear');
    const predictButtons = document.querySelectorAll('.btn-predict');
    
    clearButtons.forEach(btn => {
        btn.addEventListener('click', clearCurrentForm);
    });
    
    predictButtons.forEach(btn => {
        btn.addEventListener('click', predictChurn);
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (validateForm(form)) {
        predictChurn();
    }
}

// Validate form
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Clear previous errors
    field.classList.remove('error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    // Validate email format
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
    }
    
    // Validate number ranges
    if (field.type === 'number' && value) {
        const min = parseFloat(field.min) || 0;
        const max = parseFloat(field.max) || Infinity;
        const numValue = parseFloat(value);
        
        if (numValue < min || numValue > max) {
            field.classList.add('error');
            showNotification(`Value must be between ${min} and ${max}`, 'error');
            return false;
        }
    }
    
    return true;
}

// Clear field errors
function clearErrors(e) {
    e.target.classList.remove('error');
}

// Clear current form
function clearCurrentForm() {
    const activeTab = document.querySelector(`#${currentTab}-tab`);
    if (activeTab) {
        const form = activeTab.querySelector('form');
        if (form) {
            form.reset();
            
            // Clear all error states
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.classList.remove('error');
            });
            
            showNotification('Form cleared successfully', 'success');
        }
    }
}

// Predict churn
function predictChurn() {
    console.log('predictChurn called');
    
    if (!validateAllForms()) {
        console.log('Form validation failed');
        showNotification('Please complete all required fields in all tabs', 'error');
        return;
    }
    
    const data = collectFormData();
    console.log('Collected form data:', data);
    
    // Show loading spinner
    showLoadingSpinner();
    
    // Simulate API call
    setTimeout(() => {
        console.log('Generating prediction...');
        const prediction = generatePrediction(data);
        console.log('Prediction generated:', prediction);
        displayResults(prediction);
        hideLoadingSpinner();
        showNotification('Prediction completed successfully!', 'success');
    }, 2000);
}

// Validate all forms
function validateAllForms() {
    const form = document.querySelector('#churnForm');
    if (!form) {
        console.error('Form not found');
        return false;
    }
    
    return validateForm(form);
}

// Collect form data
function collectFormData() {
    const data = {};
    
    // Collect from the main form
    const form = document.querySelector('#churnForm');
    if (form) {
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
    }
    
    return data;
}

// Generate prediction (mock algorithm)
function generatePrediction(data) {
    // Mock prediction algorithm based on input data
    let riskScore = 0;
    const factors = [];
    const recommendations = [];
    
    // Demographics factors
    if (data.age && parseInt(data.age) > 65) {
        riskScore += 0.1;
        factors.push('Senior age group');
    }
    
    if (data.gender === 'female') {
        riskScore += 0.05;
    }
    
    // Service factors
    if (data.internetService === 'fiber-optic') {
        riskScore += 0.15;
        factors.push('High-cost internet service');
    }
    
    if (data.contract === 'month-to-month') {
        riskScore += 0.2;
        factors.push('Month-to-month contract');
        recommendations.push('Offer annual contract discount');
    }
    
    if (data.phoneService === 'no') {
        riskScore += 0.1;
        factors.push('No phone service');
    }
    
    // Billing factors
    if (data.monthlyCharges && parseFloat(data.monthlyCharges) > 80) {
        riskScore += 0.15;
        factors.push('High monthly charges');
        recommendations.push('Consider offering discount packages');
    }
    
    if (data.totalCharges && parseFloat(data.totalCharges) < 500) {
        riskScore += 0.1;
        factors.push('Low lifetime value');
    }
    
    if (data.paymentMethod === 'electronic-check') {
        riskScore += 0.1;
        factors.push('Electronic check payment');
        recommendations.push('Promote automatic payment methods');
    }
    
    // Normalize risk score
    riskScore = Math.min(riskScore, 0.95);
    riskScore = Math.max(riskScore, 0.05);
    
    // Add some randomness
    riskScore += (Math.random() - 0.5) * 0.1;
    riskScore = Math.max(0, Math.min(1, riskScore));
    
    // Determine risk level
    let riskLevel, riskClass, message;
    if (riskScore > 0.7) {
        riskLevel = 'High Risk';
        riskClass = 'high';
        message = 'This customer has a high probability of churning. Immediate action recommended.';
        recommendations.push('Priority customer retention program');
        recommendations.push('Personal account manager assignment');
    } else if (riskScore > 0.4) {
        riskLevel = 'Medium Risk';
        riskClass = 'medium';
        message = 'This customer shows moderate churn risk. Proactive engagement suggested.';
        recommendations.push('Targeted retention campaigns');
        recommendations.push('Service quality improvements');
    } else {
        riskLevel = 'Low Risk';
        riskClass = 'low';
        message = 'This customer has a low probability of churning. Continue excellent service.';
        recommendations.push('Maintain service quality');
        recommendations.push('Consider upselling opportunities');
    }
    
    // Add default factors if none found
    if (factors.length === 0) {
        factors.push('Standard customer profile');
    }
    
    // Add default recommendations if none found
    if (recommendations.length === 0) {
        recommendations.push('Continue monitoring customer satisfaction');
        recommendations.push('Regular service quality assessments');
    }
    
    return {
        probability: riskScore,
        riskLevel,
        riskClass,
        message,
        factors,
        recommendations
    };
}

// Display results
function displayResults(prediction) {
    console.log('displayResults called with:', prediction);
    
    const resultsContainer = document.querySelector('.results-container');
    console.log('Results container found:', !!resultsContainer);
    
    if (!resultsContainer) {
        console.error('Results container not found');
        return;
    }
    
    // Update prediction result
    const resultElement = document.querySelector('.prediction-result');
    if (resultElement) {
        const resultContent = resultElement.querySelector('#resultContent') || resultElement.querySelector('.result-content');
        const iconElement = resultElement.querySelector('.result-icon');
        
        if (resultContent) {
            resultContent.innerHTML = `
                <div class="result-message">${prediction.message}</div>
                <div class="churn-probability probability-${prediction.riskClass}">
                    ${(prediction.probability * 100).toFixed(1)}%
                </div>
                <div class="risk-status risk-${prediction.riskClass}">
                    ${prediction.riskLevel}
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-secondary" onclick="scrollToSection('analytics')" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                        <i class="fas fa-chart-line"></i>
                        View in Analytics Dashboard
                    </button>
                </div>
            `;
        }
        
        if (iconElement) {
            iconElement.innerHTML = prediction.riskClass === 'high' ? '<i class="fas fa-exclamation-triangle"></i>' :
                                   prediction.riskClass === 'medium' ? '<i class="fas fa-exclamation-circle"></i>' :
                                   '<i class="fas fa-check-circle"></i>';
        }
    }
    
    // Update risk factors
    const factorsElement = document.querySelector('.factors-list');
    const riskFactorsSection = document.getElementById('riskFactors');
    if (factorsElement && riskFactorsSection) {
        factorsElement.innerHTML = prediction.factors.map(factor => 
            `<li class="factor-item"><i class="fas fa-info-circle"></i> ${factor}</li>`
        ).join('');
        riskFactorsSection.style.display = 'block';
    }
    
    // Update recommendations
    const recommendationsElement = document.querySelector('.recommendations-list');
    const recommendationsSection = document.getElementById('recommendations');
    if (recommendationsElement && recommendationsSection) {
        recommendationsElement.innerHTML = prediction.recommendations.map(rec => 
            `<li class="recommendation-item"><i class="fas fa-lightbulb"></i> ${rec}</li>`
        ).join('');
        recommendationsSection.style.display = 'block';
    }
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Store results for analytics
    predictionResults = prediction;
    updateAnalytics();
}

// Setup charts
function setupCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, using mock charts');
        createMockCharts();
        return;
    }
    
    createChurnDistributionChart();
    createRiskFactorsChart();
    createTenureChart();
    createRevenueChart();
}

// Create mock charts if Chart.js is not available
function createMockCharts() {
    const chartContainers = document.querySelectorAll('.chart-container canvas');
    
    chartContainers.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#6366f1';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Chart will load with data', canvas.width / 2, canvas.height / 2);
    });
}

// Create churn distribution chart
function createChurnDistributionChart() {
    const ctx = document.getElementById('churnChart');
    if (!ctx) return;
    
    if (typeof Chart !== 'undefined') {
        charts.churnDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low Risk', 'Medium Risk', 'High Risk'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Create risk factors chart
function createRiskFactorsChart() {
    const ctx = document.getElementById('factorsChart');
    if (!ctx) return;
    
    if (typeof Chart !== 'undefined') {
        charts.riskFactors = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Contract Type', 'Monthly Charges', 'Payment Method', 'Service Type'],
                datasets: [{
                    label: 'Risk Impact',
                    data: [0.3, 0.25, 0.2, 0.15],
                    backgroundColor: '#6366f1',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 0.4
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Create tenure distribution chart
function createTenureChart() {
    const ctx = document.getElementById('tenureChart');
    if (!ctx) return;
    
    if (typeof Chart !== 'undefined') {
        charts.tenure = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0-12 months', '12-24 months', '24-36 months', '36+ months'],
                datasets: [{
                    label: 'Customer Count',
                    data: [1200, 850, 650, 300],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#6366f1'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Create revenue impact chart
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    if (typeof Chart !== 'undefined') {
        charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Revenue ($)',
                    data: [125000, 132000, 128000, 140000, 135000, 138000],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Update analytics with current prediction
function updateAnalytics() {
    if (!predictionResults) return;
    
    console.log('Updating analytics with prediction:', predictionResults);
    
    // Update prediction summary widget
    updatePredictionSummary();
    
    // Update churn distribution chart with new prediction
    if (charts.churnDistribution && predictionResults.riskClass) {
        const currentData = charts.churnDistribution.data.datasets[0].data;
        
        // Simulate updating the distribution based on the new prediction
        if (predictionResults.riskClass === 'high') {
            currentData[2] += 1; // High risk
        } else if (predictionResults.riskClass === 'medium') {
            currentData[1] += 1; // Medium risk
        } else {
            currentData[0] += 1; // Low risk
        }
        
        charts.churnDistribution.update();
    }
    
    // Update risk factors chart with prediction factors
    if (charts.riskFactors && predictionResults.factors) {
        // Update with actual risk factor weights from the prediction
        const factorWeights = calculateFactorWeights(predictionResults.factors);
        charts.riskFactors.data.datasets[0].data = factorWeights;
        charts.riskFactors.update();
    }
    
    // Update tenure chart if tenure data is available
    if (charts.tenure && predictionResults.tenure) {
        // This would update tenure distribution in a real app
        console.log('Tenure data available for analytics update');
    }
    
    // Update revenue chart with potential revenue impact
    if (charts.revenue && predictionResults.probability) {
        // Calculate potential revenue impact
        const revenueLoss = predictionResults.probability * 1000; // Simulated monthly revenue per customer
        console.log(`Potential revenue impact: $${revenueLoss.toFixed(2)}`);
    }
}

// Update prediction summary widget
function updatePredictionSummary() {
    const summaryWidget = document.getElementById('predictionSummary');
    const riskLevelElement = document.getElementById('summaryRiskLevel');
    const probabilityElement = document.getElementById('summaryProbability');
    const topFactorElement = document.getElementById('summaryTopFactor');
    
    if (summaryWidget && predictionResults) {
        // Show the summary widget
        summaryWidget.style.display = 'block';
        
        // Update values
        if (riskLevelElement) {
            riskLevelElement.textContent = predictionResults.riskLevel;
            riskLevelElement.className = `summary-value risk-${predictionResults.riskClass}`;
        }
        
        if (probabilityElement) {
            probabilityElement.textContent = `${(predictionResults.probability * 100).toFixed(1)}%`;
            probabilityElement.className = `summary-value probability-${predictionResults.riskClass}`;
        }
        
        if (topFactorElement && predictionResults.factors && predictionResults.factors.length > 0) {
            topFactorElement.textContent = predictionResults.factors[0];
        }
        
        // Scroll to analytics section to show the update
        setTimeout(() => {
            const analyticsSection = document.getElementById('analytics');
            if (analyticsSection) {
                analyticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 1000);
    }
}

// Calculate factor weights for chart update
function calculateFactorWeights(factors) {
    const weights = [0.2, 0.2, 0.2, 0.2]; // Default weights
    
    factors.forEach(factor => {
        if (factor.includes('contract')) weights[0] += 0.1;
        if (factor.includes('charges')) weights[1] += 0.1;
        if (factor.includes('payment')) weights[2] += 0.1;
        if (factor.includes('service')) weights[3] += 0.1;
    });
    
    return weights;
}

// Loading spinner functions
function showLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll effects
function setupScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .chart-container, .tech-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatPercentage(value) {
    return `${(value * 100).toFixed(1)}%`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll to section function for hero buttons
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Reset form function
function resetForm() {
    const activeTab = document.querySelector(`#${currentTab}`);
    if (activeTab) {
        const form = activeTab.closest('form') || document.querySelector('#churnForm');
        if (form) {
            form.reset();
            
            // Clear all error states
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.classList.remove('error');
            });
            
            // Hide results
            const resultsContainer = document.querySelector('.results-container');
            const riskFactors = document.getElementById('riskFactors');
            const recommendations = document.getElementById('recommendations');
            
            if (riskFactors) riskFactors.style.display = 'none';
            if (recommendations) recommendations.style.display = 'none';
            
            // Reset result content
            const resultContent = document.getElementById('resultContent');
            const resultIcon = document.getElementById('resultIcon');
            
            if (resultContent) {
                resultContent.innerHTML = '<p class="result-message">Fill out the form to get a churn prediction</p>';
            }
            
            if (resultIcon) {
                resultIcon.innerHTML = '<i class="fas fa-chart-pie"></i>';
            }
            
            showNotification('Form reset successfully', 'success');
        }
    }
}

// Test prediction function with sample data
function testPrediction() {
    console.log('🧪 Running test prediction...');
    
    // Create sample prediction data
    const samplePrediction = {
        probability: 0.75,
        riskLevel: 'High Risk',
        riskClass: 'high',
        message: 'This is a test prediction. Customer has high churn probability.',
        factors: ['Month-to-month contract', 'High monthly charges', 'Electronic check payment'],
        recommendations: ['Offer annual contract discount', 'Provide customer support', 'Promote automatic payment methods']
    };
    
    console.log('📊 Sample prediction data:', samplePrediction);
    
    // Show loading spinner briefly
    showLoadingSpinner();
    
    setTimeout(() => {
        console.log('📺 Displaying test results...');
        displayResults(samplePrediction);
        hideLoadingSpinner();
        showNotification('Test prediction completed!', 'success');
    }, 1000);
}

// Export functions for global access if needed
window.ChurnPredictionApp = {
    showTab,
    predictChurn,
    clearCurrentForm,
    showNotification,
    scrollToSection,
    resetForm,
    testPrediction
};
