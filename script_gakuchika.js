    function scrollToId(id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('inquiryForm');
        const submitButton = document.getElementById('submitButton');
        
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';

            const formData = new FormData(form);
            const dataObject = {};
            formData.forEach((value, key) => {
                // For checkboxes, we want to collect all selected values
                if (form.elements[key].type === 'checkbox') {
                    if (!dataObject[key]) dataObject[key] = [];
                    dataObject[key].push(value);
                } else {
                    dataObject[key] = value;
                }
            });
            
            // Convert checkbox arrays to strings
            for (const key in dataObject) {
                if (Array.isArray(dataObject[key])) {
                    dataObject[key] = dataObject[key].join(', ');
                }
            }

            // Manually map form fields to the unified sheet structure
            const payload = {
                landingPageID: dataObject.landingPageID,
                inquiryType: dataObject.inquiryType,
                fullName: dataObject.fullName,
                furigana: "", // No furigana field in this form
                companyName: dataObject.companyName,
                departmentName: dataObject.departmentName,
                email: dataObject.email,
                phoneNumber: dataObject.phoneNumber,
                detailType: "", // No detailType field in this form
                message: dataObject.message,
                secret: '8qZ$p#vT2@nK*wG7hB5!sF8aU' // The secret token
            };

            const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwHQAbqL7R4WWmvuWrZGFg96V4zW7QA0tBBDY9HVygFfgN0nLMJ_Ds3n6Pzg3seguqa/exec";

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload)
            })
            .then(() => {
                 window.top.location.href = 'thankyou_gakuchika.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('送信に失敗しました。時間をおいて再度お試しください。');
                submitButton.disabled = false;
                submitButton.textContent = '資料を請求する';
            });
        });
    });