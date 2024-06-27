const User = require('../models/user'); 
const bcrypt = require('bcrypt'); 
const Database = require('../models/database');
const jwt = require('jsonwebtoken');
const db = new Database();

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, role, position, department } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      role,
      position,
      department,
    });

    console.log(newUser);

    if (!db.isConnected()) {
      await db.connect();
    }

    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User created successfully!', user: savedUser });
  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.keyValue.email) {
      res.status(400).json({ message: 'Email already exists!' });
    } else {
      res.status(500).json({ message: 'Error creating user' });
    }
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        throw err;
      }
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
      });
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    if (!users.length) {
      return res.status(204).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting user' });
  }
};

exports.updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, firstname, lastname} = req.body; 
  
      const updatedUser = await User.findByIdAndUpdate(userId, {
        username,
        email,
        firstname,
        lastname,
      }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating user' });
    }
  };

exports.adminUpdateUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const { username, email, firstname, lastname, role, position, department } = req.body; 

    const updatedUser = await User.findByIdAndUpdate(userId, {
      username,
      email,
      firstname,
      lastname,
      role,
      position,
      department,
    }, { new: true }); // Return the updated document

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(updatedUser)

    res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
};