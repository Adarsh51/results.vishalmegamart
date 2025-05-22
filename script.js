// VMMSET Results Portal JavaScript

// Mock student data - predefined fake data for the parody exam
const studentDatabase = {
    "2211900150": {
        name: "Rajesh Kumar Singh",
        admitCard: "VMMSET2025-AXU723",
        marks: {
            "Trolley Handling": { obtained: 98, maximum: 100 },
            "Billing Counter Etiquette": { obtained: 89, maximum: 100 },
            "Store Surveillance": { obtained: 76, maximum: 100 },
            "Aisle Navigation": { obtained: 92, maximum: 100 },
            "Mega Mart Code of Conduct": { obtained: 85, maximum: 100 }
        }
    },
    "2211900151": {
        name: "Priya Sharma",
        admitCard: "VMMSET2025-BYV824",
        marks: {
            "Trolley Handling": { obtained: 94, maximum: 100 },
            "Billing Counter Etiquette": { obtained: 96, maximum: 100 },
            "Store Surveillance": { obtained: 88, maximum: 100 },
            "Aisle Navigation": { obtained: 91, maximum: 100 },
            "Mega Mart Code of Conduct": { obtained: 93, maximum: 100 }
        }
    },
    "2211900152": {
        name: "Mohammed Abdul Rahman",
        admitCard: "VMMSET2025-CZW925",
        marks: {
            "Trolley Handling": { obtained: 87, maximum: 100 },
            "Billing Counter Etiquette": { obtained: 92, maximum: 100 },
            "Store Surveillance": { obtained: 85, maximum: 100 },
            "Aisle Navigation": { obtained: 89, maximum: 100 },
            "Mega Mart Code of Conduct": { obtained: 88, maximum: 100 }
        }
    },
    "2211900153": {
        name: "Sunita Devi",
        admitCard: "VMMSET2025-DAX026",
        marks: {
            "Trolley Handling": { obtained: 91, maximum: 100 },
            "Billing Counter Etiquette": { obtained: 88, maximum: 100 },
            "Store Surveillance": { obtained: 94, maximum: 100 },
            "Aisle Navigation": { obtained: 87, maximum: 100 },
            "Mega Mart Code of Conduct": { obtained: 90, maximum: 100 }
        }
    },
    "2211900154": {
        name: "Amit Patel",
        admitCard: "VMMSET2025-EBY127",
        marks: {
            "Trolley Handling": { obtained: 79, maximum: 100 },
            "Billing Counter Etiquette": { obtained: 83, maximum: 100 },
            "Store Surveillance": { obtained: 91, maximum: 100 },
            "Aisle Navigation": { obtained: 86, maximum: 100 },
            "Mega Mart Code of Conduct": { obtained: 81, maximum: 100 }
        }
    },
    "2211900155": {
        name: "Kavitha Reddy",
        admitCard: "VMMSET2025-FCZ228",
        marks: {
            "Trolley Handling": { obtained: 96, maximum: 100 },
            "Billing Counter Etiquette": { obtained: 94, maximum: 100 },
            "Store Surveillance": { obtained: 89, maximum: 100 },
            "Aisle Navigation": { obtained: 95, maximum: 100 },
            "Mega Mart Code of Conduct": { obtained: 92, maximum: 100 }
        }
    }
};

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
    const student = studentDatabase[rollNumber];
    if (!student || student.admitCard !== admitCard) {
        showError('Invalid credentials. Please check your Roll Number and Admit Card ID.');
        refreshCaptcha();
        return;
    }
    
    // Display results
    displayResults(rollNumber, student);
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
function displayResults(rollNumber, student) {
    // Hide login section and show results
    loginSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Populate student information
    document.getElementById('student-name').textContent = student.name;
    document.getElementById('student-roll').textContent = rollNumber;
    document.getElementById('student-admit').textContent = student.admitCard;
    
    // Calculate totals
    let totalObtained = 0;
    let totalMaximum = 0;
    
    // Populate marks table
    const marksTableBody = document.getElementById('marks-tbody');
    marksTableBody.innerHTML = '';
    
    Object.entries(student.marks).forEach(([subject, marks]) => {
        totalObtained += marks.obtained;
        totalMaximum += marks.maximum;
        
        const row = document.createElement('tr');
        const status = marks.obtained >= 35 ? 'PASS' : 'FAIL';
        const statusClass = marks.obtained >= 35 ? 'pass-status' : 'fail-status';
        
        row.innerHTML = `
            <td>${subject}</td>
            <td>${marks.obtained}</td>
            <td>${marks.maximum}</td>
            <td class="${statusClass}">${status}</td>
        `;
        
        marksTableBody.appendChild(row);
    });
    
    // Update totals
    document.getElementById('total-obtained').textContent = totalObtained;
    document.getElementById('total-maximum').textContent = totalMaximum;
    
    // Determine final result
    const percentage = (totalObtained / totalMaximum) * 100;
    const finalResult = percentage >= 40 ? 'PASSED' : 'FAILED';
    const resultStatus = document.getElementById('result-status');
    const finalResultElement = document.getElementById('final-result');
    
    resultStatus.textContent = finalResult;
    finalResultElement.textContent = finalResult;
    
    if (finalResult === 'FAILED') {
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
    window.print();
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
