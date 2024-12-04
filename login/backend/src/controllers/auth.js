const express = require('express');
const bcrypt = require('bcrypt');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

exports.signup = async (req, res) => {
  let { username, email, password, confirmPassword } = req.body;
  username = username.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  if (username === "" || email === "" || password === "" || confirmPassword === "") {
    return res.status(400).json({ status: "FAILED", message: "Empty input fields!" });
  } else if (!/^[a-zA-Z ]*$/.test(username)) {
    return res.status(400).json({ status: "FAILED", message: "Invalid username entered" });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ status: "FAILED", message: "Invalid email entered" });
  } else if (confirmPassword !== password) {
    return res.status(400).json({ status: "FAILED", message: "Password confirmation mismatch" });
  } else if (password.length < 8) {
    return res.status(400).json({ status: "FAILED", message: "Password must be at least 8 characters!" });
  }

  try {
    const userRef = firestore.collection('users').doc(email);
    const doc = await userRef.get();

    if (doc.exists) {
      return res.status(400).json({ status: "FAILED", message: "User with the provided email already exists" });
    }

    // Password handling
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userRef.set({ username, email, password: hashedPassword });
    res.status(201).json({ status: "SUCCESS", message: "Signup successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "FAILED", message: "Error occurred while checking or saving user" });
  }
}

exports.signin = async (req, res) => {
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
      return res.status(400).json({ status: "FAILED", message: "User Not Found" });
    }

    const hashedPassword = doc.data().password;
    const validPassword = await bcrypt.compare(password, hashedPassword);
    if (validPassword) {
      res.status(200).json({ status: "SUCCESS", message: "Signin successfull", data: doc.data() });
    } else {
      res.status(400).json({ status: "FAILED", message: "Invalid password entered!" });
    }
  } catch (err) {
    res.status(500).json({ status: "FAILED", message: "An error occurred while checking user credentials" });
  }
};

exports.testConnection = async (req, res) => {
  res.status(200).send("Backend Successfully Connected !!");
}

exports.getAllusers = async (req, res) => {
  try {
    const snapshot = await firestore.collection('users').get();
    let data = [];
    snapshot.forEach(doc => data.push(doc.data()));
    res.status(200).json({ status: "SUCCESS", data });
  } catch (err) {
    res.status(500).json({ status: "FAILED", message: "An error occurred while fetching user data" });
  }
}

exports.getUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ status: "FAILED", message: "User not found" });
    }
    res.status(200).json({ status: "SUCCESS", data: doc.data() });
  } catch (err) {
    res.status(500).json({ status: "FAILED", message: "An error occurred while fetching user data" });
  }
}

exports.editUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ status: "FAILED", message: "User not found" });
    }
    const { username, email, password } = req.body;
    const data = { username, email };
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      data.password = hashedPassword;
    }

    await firestore.collection('users').doc(id).set(data, { merge: true });
    res.status(200).json({ status: "SUCCESS", message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ status: "FAILED", message: "An error occurred while updating user data" });
  }
}

exports.deleteUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ status: "FAILED", message: "User not found" });
    }
    await firestore.collection('users').doc(id).delete();
    res.status(200).json({ status: "SUCCESS", message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "FAILED", message: "An error occurred while deleting user data" });
  }
}

exports.signout = (req, res) => {
  res.status(200).json({ status: "SUCCESS", message: "Signout successful" });
}

