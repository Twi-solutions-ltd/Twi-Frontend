const completeBtn = document.getElementById('completeBtn');
const termsCheck = document.getElementById('termsCheck');
const loaderScreen = document.getElementById('loaderScreen');
const successModal = document.getElementById('successModal');

if (completeBtn) {
    completeBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (!termsCheck.checked) {
            alert('Please accept the Privacy Policy and Terms of Service to complete your registration.');
            return;
        }

        // 1. Show Loader Screen
        loaderScreen.classList.remove('hidden');

        // 2. After 1.8 seconds, hide loader and show Success Modal (Frame 196)
        setTimeout(() => {
            loaderScreen.classList.add('hidden');
            successModal.classList.remove('hidden');
        }, 1800);
    });
}