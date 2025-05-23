// Mock student database - updated with shorter admit card format
const mockDatabase = [
    {
        name: "Adarsh Dubey",
        rollNumber: "2311200171",
        admitCard: "AXU723",
        subjects: {
            "Trolley Handling": 98,
            "Billing Counter Etiquette": 89,
            "Store Surveillance": 76,
            "Aisle Navigation": 92,
            "Mega Mart Code of Conduct": 85
        }
    },
    {
        name: "Prachi Jethwa",
        rollNumber: "2311200183",
        admitCard: "JKL901",
        subjects: {
            "Trolley Handling": 88,
            "Billing Counter Etiquette": 91,
            "Store Surveillance": 84,
            "Aisle Navigation": 87,
            "Mega Mart Code of Conduct": 93
        }
    },
    {
        name: "Sneha Pathak",
        rollNumber: "2311200195",
        admitCard: "RST556",
        subjects: {
            "Trolley Handling": 78,
            "Billing Counter Etiquette": 82,
            "Store Surveillance": 69,
            "Aisle Navigation": 74,
            "Mega Mart Code of Conduct": 80
        }
    },
    {
        name: "Rahul Meena",
        rollNumber: "2311200202",
        admitCard: "QWE341",
        subjects: {
            "Trolley Handling": 67,
            "Billing Counter Etiquette": 72,
            "Store Surveillance": 58,
            "Aisle Navigation": 63,
            "Mega Mart Code of Conduct": 70
        }
    }
];

// Current CAPTCHA code
let currentCaptcha = '';

// DOM Elements
const loginSection = document.getElementById('login-section');
const resultsSection = document.getElementById('results-section');
const resultForm = document.getElementById('result-form');
const errorMessage = document.getElementById('error-message');
const captchaDisplay = document.getElementById('captcha-display');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    generateCaptcha();
    setupEventListeners();
});

// Generate random CAPTCHA code
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    
    for (let i = 0; i < 5; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    currentCaptcha = captcha;
    captchaDisplay.textContent = captcha;
}

// Refresh CAPTCHA when clicked
function refreshCaptcha() {
    generateCaptcha();
    document.getElementById('captcha-input').value = '';
}

// Setup event listeners
function setupEventListeners() {
    resultForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const rollNumber = document.getElementById('roll-number').value.trim();
    const admitCard = document.getElementById('admit-card').value.trim();
    const captchaInput = document.getElementById('captcha-input').value.trim();
    
    // Clear previous error messages
    hideError();
    
    // Validate all fields are filled
    if (!rollNumber || !admitCard || !captchaInput) {
        showError('Please fill in all required fields.');
        return;
    }
    
    // Validate CAPTCHA
    if (captchaInput.toUpperCase() !== currentCaptcha.toUpperCase()) {
        showError('Invalid security code. Please try again.');
        refreshCaptcha();
        return;
    }
    
    // Validate student credentials
    const student = mockDatabase.find(s => s.rollNumber === rollNumber && s.admitCard === admitCard);
    if (!student) {
        showError('Invalid credentials. Please try again.');
        refreshCaptcha();
        return;
    }
    
    // Display results
    displayResults(student);
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    errorMessage.style.display = 'block';
    
    // Scroll to error message
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
    errorMessage.style.display = 'none';
}

// Display student results
function displayResults(student) {
    // Hide login section and show results
    loginSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Populate student information
    document.getElementById('student-name').textContent = student.name;
    document.getElementById('student-roll').textContent = student.rollNumber;
    document.getElementById('student-admit').textContent = student.admitCard;
    
    // Calculate totals
    let totalObtained = 0;
    const totalMaximum = 500; // 5 subjects × 100 marks each
    
    // Populate marks table
    const marksTableBody = document.getElementById('marks-tbody');
    marksTableBody.innerHTML = '';
    
    Object.entries(student.subjects).forEach(([subject, marks]) => {
        totalObtained += marks;
        
        const row = document.createElement('tr');
        const grade = calculateGrade(marks);
        
        row.innerHTML = `
            <td>${subject}</td>
            <td>${marks}</td>
            <td>${grade}</td>
        `;
        
        marksTableBody.appendChild(row);
    });
    
    // Update totals
    document.getElementById('total-obtained').textContent = `${totalObtained}/500`;
    
    // Determine final result (pass if total >= 165/500)
    const finalResult = totalObtained >= 165 ? 'Pass ✅' : 'Fail';
    const resultStatus = document.getElementById('result-status');
    const finalResultElement = document.getElementById('final-result');
    
    resultStatus.textContent = finalResult;
    finalResultElement.textContent = finalResult;
    
    if (totalObtained < 165) {
        resultStatus.classList.add('failed');
        finalResultElement.className = 'fail-status';
    } else {
        resultStatus.classList.remove('failed');
        finalResultElement.className = 'pass-status';
    }
    
    // Scroll to top of results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Print results
function printResult() {
    // Create watermark container
    const watermarkContainer = document.createElement('div');
    watermarkContainer.style.position = 'fixed';
    watermarkContainer.style.top = '50%';
    watermarkContainer.style.left = '50%';
    watermarkContainer.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
    watermarkContainer.style.zIndex = '1000';
    watermarkContainer.style.pointerEvents = 'none';
    watermarkContainer.style.opacity = '0.1';
    watermarkContainer.style.width = '100%';
    watermarkContainer.style.textAlign = 'center';
    
    // Create watermark text
    const watermarkText = document.createElement('div');
    watermarkText.style.fontSize = '48px';
    watermarkText.style.fontWeight = 'bold';
    watermarkText.style.color = '#1565c0';
    watermarkText.textContent = 'VISHAL MEGA MART™';
    
    // Create developer credit
    const developerCredit = document.createElement('div');
    developerCredit.style.fontSize = '24px';
    developerCredit.style.marginTop = '10px';
    developerCredit.style.color = '#1565c0';
    developerCredit.textContent = 'Developed by Adarsh Dubey';
    
    // Add watermark elements to container
    watermarkContainer.appendChild(watermarkText);
    watermarkContainer.appendChild(developerCredit);
    
    // Clone the results container
    const resultsContainer = document.querySelector('.results-container').cloneNode(true);
    
    // Add watermark to the cloned container
    resultsContainer.appendChild(watermarkContainer);
    
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.appendChild(resultsContainer);
    document.body.appendChild(tempContainer);
    
    // Configure PDF options
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'VMMSET_2025_Results.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };
    
    // Generate PDF with error handling
    try {
        html2pdf().set(opt).from(tempContainer).save().then(() => {
            // Clean up temporary container
            document.body.removeChild(tempContainer);
        }).catch(error => {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
            document.body.removeChild(tempContainer);
        });
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
        document.body.removeChild(tempContainer);
    }
}

// Check another result
function checkAnother() {
    // Reset form
    resultForm.reset();
    hideError();
    generateCaptcha();
    
    // Show login section and hide results
    loginSection.style.display = 'block';
    resultsSection.style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Calculate grade based on marks
function calculateGrade(marks) {
    if (marks >= 91) return 'A1';
    if (marks >= 81) return 'A2';
    if (marks >= 71) return 'B1';
    if (marks >= 61) return 'B2';
    if (marks >= 51) return 'C1';
    return 'Fail';
}

// Utility function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add loading animation for form submission
function showLoading() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Loading...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Enhanced form validation with real-time feedback
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        field.classList.add('error');
        return false;
    } else {
        field.classList.remove('error');
        return true;
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setupRealTimeValidation();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl + Enter to submit form
    if (event.ctrlKey && event.key === 'Enter') {
        if (loginSection.style.display !== 'none') {
            resultForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape key to go back to login
    if (event.key === 'Escape') {
        if (resultsSection.style.display !== 'none') {
            checkAnother();
        }
    }
});

// Add smooth transitions
function addSmoothTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Initialize smooth transitions
document.addEventListener('DOMContentLoaded', addSmoothTransitions);
