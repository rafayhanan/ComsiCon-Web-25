import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Generate JWT token
export const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET;

    // Add a check to ensure the secret is available
    if (!secret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined!");
        // In a real app, you might want to throw a specific error or handle this more gracefully
        throw new Error("JWT secret is not configured.");
    }

  return jwt.sign(
    { id: userId, role },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;

    // Add a check to ensure the secret is available
     if (!secret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined!");
        return null;
    }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate random password for new team members
export const generateRandomPassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
};