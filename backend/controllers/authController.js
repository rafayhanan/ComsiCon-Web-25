import User from '../models/User.js';
import {
  generateToken,
  hashPassword,
  comparePassword
} from '../utils/authUtils.js';

// Register a new manager
export const registerManager = async (req, res) => {
  try {
    // Updated: Expect fullName instead of firstName and lastName
    const { email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new manager
    const user = new User({
      email,
      password: hashedPassword,
      // Updated: Use fullName
      fullName,
      role: 'manager'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Manager registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        // Updated: Use fullName
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login user (manager or team member) - No changes needed here
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        // Updated: Use fullName in login response
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    // Select everything except password
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // The user object fetched already reflects the schema (with fullName)
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};
