export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateRegistration = (data) => {
    const errors = {};
    if (!data.username || !emailRegex.test(data.username)) {
        errors.username = "Please enter a valid email address.";
    }
    if (!data.password || !passwordRegex.test(data.password)) {
        errors.password = "Password must be 8+ characters with uppercase, lowercase, a number, and a symbol.";
    }
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
export const validateLogin = (data) => {
    const errors = {};
    if (!data.username) errors.username = "Email is required.";
    if (!data.password) errors.password = "Password is required.";
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
export const validateResetPassword = (password, confirmPassword) => {
    const errors = {};
    if (!password || !passwordRegex.test(password)) {
        errors.password = "Password must be 8+ characters with uppercase, lowercase, a number, and a symbol.";
    }
    if (password !== confirmPassword) {
        errors.confirm = "Passwords do not match.";
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};