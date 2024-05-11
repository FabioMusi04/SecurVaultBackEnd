export function validateEmail(email) {
    // Regular expression for email validation
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}