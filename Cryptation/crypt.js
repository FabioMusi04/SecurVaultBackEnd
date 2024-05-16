import crypto from 'crypto';
import bcrypt from 'bcrypt';
const algorithm = 'aes-256-cbc';

function encrypt(text, passedKey) {
    // Create a 32-byte key from the passed key
    const key = crypto.createHash('sha256').update(passedKey).digest();

    // Generate a random IV
    const iv = crypto.randomBytes(16);

    // Create cipher with the key and IV
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Combine IV and encrypted text
    const encryptedText = iv.toString('hex') + ':' + encrypted;

    return encryptedText;
}

// Decryption function
function decrypt(encryptedText, passedKey) {
    // Create a 32-byte key from the passed key
    const key = crypto.createHash('sha256').update(passedKey).digest();

    // Split the IV and encrypted text
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = textParts.join(':');

    // Create decipher with the key and IV
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    // Decrypt the text
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
async function deriveKey(password, salt) {
    return await bcrypt.hash(password, salt);
}


export { encrypt, decrypt, deriveKey };