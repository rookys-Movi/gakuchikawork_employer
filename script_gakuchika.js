// Initialize Animate On Scroll (AOS)
AOS.init({
    duration: 800, // animation duration in milliseconds
    once: true,    // whether animation should happen only once - while scrolling down
});

// Smooth scroll to an element by its ID
function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// --- Popup Modal Logic ---
const popup = document.getElementById('concerns-popup');

function openPopup() {
    if (popup) {
        popup.classList.remove('hidden');
        // Trigger AOS animations inside the popup if needed
        AOS.refresh();
    }
}

function closePopup() {
    if (popup) {
        popup.classList.add('hidden');
    }
}

// Close popup if user clicks on the overlay
popup.addEventListener('click', function(event) {
    if (event.target === popup) {
        closePopup();
    }
});


// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('inquiryForm');
    const submitButton = document.getElementById('submitButton');
    
    // Handle the form submission process
    form.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Disable the button and show a "sending" message to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';

        // Collect form data
        const formData = new FormData(form);
        const dataObject = {};
        formData.forEach((value, key) => {
            if (form.elements[key].type === 'checkbox') {
                if (!dataObject[key]) dataObject[key] = [];
                dataObject[key].push(value);
            } else {
                dataObject[key] = value;
            }
        });
        
        // Convert checkbox arrays to strings if necessary
        for (const key in dataObject) {
            if (Array.isArray(dataObject[key])) {
                dataObject[key] = dataObject[key].join(', ');
            }
        }

        // Manually map form fields to the final payload structure for the backend
        const payload = {
            landingPageID: dataObject.landingPageID,
            inquiryType: dataObject.inquiryType,
            fullName: dataObject.fullName,
            furigana: "", // No furigana field in this form
            companyName: dataObject.companyName,
            departmentName: dataObject.departmentName,
            email: dataObject.email,
            phoneNumber: dataObject.phoneNumber || "", // Use empty string if no phone number
            detailType: "", // No detailType field in this form
            message: dataObject.message,
            secret: '8qZ$p#vT2@nK*wG7hB5!sF8aU' // The secret token
        };

        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwHQAbqL7R4WWmvuWrZGFg96V4zW7QA0tBBDY9HVygFfgN0nLMJ_Ds3n6Pzg3seguqa/exec";

        // Send the data using the Fetch API
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for sending to Google Apps Script from a browser
            body: JSON.stringify(payload)
        })
        .then(() => {
            // On success, redirect to the thank you page
            window.top.location.href = 'thankyou_gakuchika.html';
        })
        .catch(error => {
            // If an error occurs, log it and inform the user
            console.error('Error:', error);
            alert('送信に失敗しました。時間をおいて再度お試しください。');
            
            // Re-enable the submit button so the user can try again
            submitButton.disabled = false;
            submitButton.textContent = '資料を請求する';
        });
    });
});
