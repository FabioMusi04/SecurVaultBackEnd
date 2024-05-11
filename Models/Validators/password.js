export function validatePassword(password) {
    if (password.length < 8 || password.length > 20) {
        return false;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?]).{8,20}$/;
    return regex.test(password);
}