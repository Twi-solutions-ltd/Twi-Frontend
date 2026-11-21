const API_BASE_URL = "https://twi-project.onrender.com";

/**
 * Helper to parse JSON safely and throw readable API errors
 */
async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        // Handles standard Express/Node error keys (message or error)
        throw new Error(data.message || data.error || `Request failed (${response.status})`);
    }

    return data;
}

const AuthAPI = {
    // 1. POST: /api/auth/login
    async login(email, password) {
        const data = await apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        // Extract token flexibly across common backend response shapes
        const token = data.token || data.accessToken || data.data?.token || data.data?.accessToken;
        if (token) {
            localStorage.setItem("twi_token", token);
        }

        const user = data.user || data.data?.user || data.data;
        if (user) {
            localStorage.setItem("twi_user", JSON.stringify(user));
        }

        return data;
    },

    // 2. POST: /api/auth/register
    async register(payload) {
        // payload e.g. { fullName, email, password } or { firstName, lastName, email, password }
        return await apiRequest("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    // 3. POST: /api/auth/verify-email
    async verifyEmail(email, otp) {
        return await apiRequest("/api/auth/verify-email", {
            method: "POST",
            body: JSON.stringify({ email, otp }),
        });
    },

    // 4. POST: /api/auth/resend-otp
    async resendOtp(email) {
        return await apiRequest("/api/auth/resend-otp", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    },

    // 5. GET: /api/auth/google (Server-side OAuth redirect)
    loginWithGoogle() {
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    }
};