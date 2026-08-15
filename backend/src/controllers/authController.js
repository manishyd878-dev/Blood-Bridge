import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user (patient or hospital)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'patient', phone, bloodGroup, hospitalDetails } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const validBloodGroup =
    role === 'patient' && bloodGroup && bloodGroup.trim() !== '' ? bloodGroup.trim() : null;

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'hospital' ? 'hospital' : 'patient',
    phone: phone || undefined,
    bloodGroup: validBloodGroup,
  });

  // If registering as a hospital, create a linked Hospital record so the
  // account immediately has a dashboard/inventory to manage.
  if (user.role === 'hospital') {
    const hospital = await Hospital.create({
      name: hospitalDetails?.name || name,
      owner: user._id,
      address: hospitalDetails?.address || 'Address not yet provided',
      city: hospitalDetails?.city || '',
      phone: phone || hospitalDetails?.phone || '',
      email,
      verified: false,
    });
    user.hospital = hospital._id;
    await user.save();
  }

  const populatedUser = await User.findById(user._id).populate('hospital');

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: populatedUser ? populatedUser.toSafeObject() : user.toSafeObject(),
  });
});

// @desc    Login with email + password
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password').populate('hospital');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});

// @desc    Get the logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('hospital');
  res.json({ success: true, user });
});

// @desc    Update the logged-in user's profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, bloodGroup } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;

  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});
