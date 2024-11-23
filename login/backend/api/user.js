const express = require('express');
const router = express.Router();


// password handler
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  let { name, email, password, confirmPassword } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  // Validate input
  if (name === "" || email === "" || password === "" || confirmPassword === "") {
    return res.json({ status: "FAILED", message: "Empty input fields!" });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    return res.json({ status: "FAILED", message: "Invalid name entered" });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.json({ status: "FAILED", message: "Invalid email entered" });
  } else if (confirmPassword !== password) {
    return res.json({ status: "FAILED", message: "Password confirmation mismatch" });
  } else if (password.length < 8) {
    return res.json({ status: "FAILED", message: "Password must be at least 8 characters!" });
  }

  try {
    const userRef = firestore.collection('users').doc(email);
    const doc = await userRef.get();

    if (doc.exists) {
      return res.json({ status: "FAILED", message: "User with the provided email already exists" });
    }

    // Password handling
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds).then(async (hashedPassword) => {
      await userRef.set({ name, email, password: hashedPassword });
      res.json({ status: "SUCCESS", message: "Signup successful" });
    });

  } catch (err) {
    res.json({ status: "FAILED", message: "Error occurred while checking or saving user" });
  }
};


// 
const login = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email === "" || password === "") {
    return res.json({ status: "FAILED", message: "Empty credentials supplied" });
  }

  try {
    const userRef = firestore.collection('users').doc(email);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.json({ status: "FAILED", message: "Invalid credentials entered!" });
    }

    const hashedPassword = doc.data().password;
    bcrypt.compare(password, hashedPassword).then((result) => {
      if (result) {
        res.json({ status: "SUCCESS", message: "Signin successful", data: doc.data() });
      } else {
        res.json({ status: "FAILED", message: "Invalid password entered!" });
      }
    }).catch(err => {
      res.json({ status: "FAILED", message: "An error occurred while comparing password" });
    });

  } catch (err) {
    res.json({ status: "FAILED", message: "An error occurred while checking user credentials" });
  }
};


module.exports = { register, login };