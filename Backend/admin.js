import bcrypt from 'bcryptjs';

const generateHash = async (password) => {
    // 1. Generate a strong salt
    const salt = await bcrypt.genSalt(10);
    // 2. Hash the password using the salt
    const securePassword = await bcrypt.hash(password, salt);
    
    console.log("Your Hashed Password (Store this in DB):", securePassword);
    console.log("Password generation complete.");
};

// CHANGE THIS to your secure, strong admin password
const adminPassword = "Tour#321@";

generateHash(adminPassword);