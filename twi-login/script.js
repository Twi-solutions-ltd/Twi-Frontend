// Modal Elements
const signinModal = document.getElementById('signinModal');
const signupModal = document.getElementById('signupModal');
const verifyModal = document.getElementById('verifyModal');

// Links & Buttons
const toSignupLink = document.getElementById('toSignupLink');
const toSigninLink = document.getElementById('toSigninLink');
const closeSigninBtn = document.getElementById('closeSigninBtn');
const closeSignupBtn = document.getElementById('closeSignupBtn');
const closeVerifyBtn = document.getElementById('closeVerifyBtn');

// Google Buttons (from your updated index.html)
const googleBtnSignin = document.getElementById('googleBtnSignin');
const googleBtnSignup = document.getElementById('googleBtnSignup');

// Forms & Field Groups
const signinForm = document.getElementById('signinForm');
const signinEmailGroup = document.getElementById('signinEmailGroup');
const signinEmail = document.getElementById('signinEmail');
const signinPassword = document.getElementById('signinPassword'); // Add password input if present, or handle inline

const signupForm = document.getElementById('signupForm');
const signupPasswordGroup = document.getElementById('signupPasswordGroup');
const passwordInput = document.getElementById('password');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const signupEmailInput = document.getElementById('signupEmail');

// Verification form & dynamic email holder
const verifyForm = document.getElementById('verifyForm');
const userVerifyEmail = document.getElementById('userVerifyEmail');
let registeredEmailContext = ""; // Tracks email being verified

// --- Google Sign-In Handler (Redirects to Render Backend Route) ---
function handleGoogleLogin() {
    if (typeof AuthAPI !== 'undefined' && AuthAPI.loginWithGoogle) {
        AuthAPI.loginWithGoogle();
    } else {
        window.location.href = "https://twi-project.onrender.com/api/auth/google";
    }
}

if (googleBtnSignin) {
    googleBtnSignin.addEventListener('click', handleGoogleLogin);
}

if (googleBtnSignup) {
    googleBtnSignup.addEventListener('click', handleGoogleLogin);
}

// --- Navigation & View Toggles ---
if (toSignupLink && signinModal && signupModal) {
    toSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        signinModal.classList.add('hidden');
        signupModal.classList.remove('hidden');
    });
}

if (toSigninLink && signinModal && signupModal) {
    toSigninLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.add('hidden');
        signinModal.classList.remove('hidden');
    });
}

// --- Fixed Close Buttons (Using .hidden class) ---
if (closeSigninBtn && signinModal) {
    closeSigninBtn.addEventListener('click', () => {
        signinModal.classList.add('hidden');
    });
}

if (closeSignupBtn && signupModal) {
    closeSignupBtn.addEventListener('click', () => {
        signupModal.classList.add('hidden');
    });
}

if (closeVerifyBtn && verifyModal) {
    closeVerifyBtn.addEventListener('click', () => {
        verifyModal.classList.add('hidden');
    });
}

// --- Form Submissions Connected to Render Backend ---

// 1. Sign In Submission
if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailVal = signinEmail.value.trim();
        // Assuming you have a password field on your signin form with id="signinPassword"
        const passwordVal = document.getElementById('signinPassword') ? document.getElementById('signinPassword').value : "";

        const submitBtn = signinForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : "Continue";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Signing in...";
        }

        try {
            const response = await AuthAPI.login(emailVal, passwordVal);
            signinEmailGroup.classList.remove('has-error');
            
            // Check user profile completion from response
            const user = response.user || response.data?.user || {};
            if (user.isProfileComplete || user.hasProfile) {
                window.location.href = "../dashboard.html"; // Adjust path if necessary
            } else {
                window.location.href = "../Profile-setup/profile-setup.html";
            }
        } catch (err) {
            signinEmailGroup.classList.add('has-error');
            const errorMsgEl = document.getElementById('signinError');
            if (errorMsgEl) errorMsgEl.textContent = err.message;
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });
}

// 2. Signup Submission -> Triggers Backend Register & Opens OTP Modal
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (passwordInput.value.length < 8) {
            signupPasswordGroup.classList.add('has-error');
            return;
        }
        signupPasswordGroup.classList.remove('has-error');

        const fName = firstNameInput.value.trim();
        const lName = lastNameInput.value.trim();

        const payload = {
            firstName: fName,
            lastName: lName,
            fullName: `${fName} ${lName}`,
            name: `${fName} ${lName}`,
            email: signupEmailInput.value.trim(),
            password: passwordInput.value
        };

        registeredEmailContext = payload.email;

        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : "Continue";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Creating account...";
        }

        try {
            await AuthAPI.register(payload);

            // Update verification modal email label
            if (userVerifyEmail) userVerifyEmail.textContent = registeredEmailContext;

            // Hide Signup Modal and Show Verification Modal
            if (signupModal) signupModal.classList.add('hidden');
            if (verifyModal) verifyModal.classList.remove('hidden');
            
            startResendTimer();
        } catch (err) {
            alert(err.message || "Registration failed. Please try again.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });
}

// 3. Email Verification (OTP) Submission
const otpInputs = document.querySelectorAll('.otp-input');
if (verifyForm) {
    verifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect OTP digits from the 6 inputs
        let otpCode = "";
        otpInputs.forEach(input => {
            otpCode += input.value.trim();
        });

        if (otpCode.length < 6) {
            alert("Please enter the complete 6-digit verification code.");
            return;
        }

        const submitBtn = verifyForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : "Verify";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Verifying...";
        }

        try {
            await AuthAPI.verifyEmail(registeredEmailContext, otpCode);
            alert("Email verified successfully!");
            
            // Route to Profile Setup step 1
            window.location.href = "../Profile-setup/profile-setup.html";
        } catch (err) {
            alert(err.message || "Invalid verification code.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });
}

// --- OTP Input Auto-Focus Logic ---
if (otpInputs.length > 0) {
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
}

// --- Countdown Timer & Resend OTP Logic ---
let timeLeft = 15;
const timerSpan = document.getElementById('timer');
const resendBtn = document.getElementById('resendBtn');
let timerInterval = null;

function startResendTimer() {
    if (!timerSpan || !resendBtn) return;
    timeLeft = 15;
    resendBtn.disabled = true;
    timerSpan.textContent = timeLeft;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend';
        }
    }, 1000);
}

if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
        if (!resendBtn.disabled && registeredEmailContext) {
            try {
                await AuthAPI.resendOtp(registeredEmailContext);
                alert('Verification code resent!');
                startResendTimer();
            } catch (err) {
                alert(err.message || "Failed to resend OTP.");
            }
        }
    });
}