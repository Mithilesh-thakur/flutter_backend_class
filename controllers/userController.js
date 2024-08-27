const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
   
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    
    res.status(200).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const tokenData = { _id: user._id, email: user.email };
    const token = jwt.sign(tokenData, 'your_jwt_secret', { expiresIn: '1h' });
    
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
