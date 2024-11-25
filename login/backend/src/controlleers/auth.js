const express = require('express');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  let { username, email, password, confirmPassword } = req.body;
  username = username.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  if (username === "" || email === "" || password === "" || confirmPassword === "") {
    return res.json({ status: "FAILED", message: "Empty input fields!" });
  } else if (!/^[a-zA-Z ]*$/.test(username)) {
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
      await userRef.set({ username, email, password: hashedPassword });
      res.json({ status: "SUCCESS", message: "Signup successful" });
    });

  } catch (err) {
    res.json({ status: "FAILED", message: "Error occurred while checking or saving user" });
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

exports.getAllusers = async (req, res) => {
  try {
    const snapshot = await firestore.collection('users').get();
    let data = [];
    snapshot.forEach(doc => data.push(doc.data()));
    res.json({ status: "SUCCESS", data });
  } catch (err) {
    res.json({ status: "FAILED", message: "An error occurred while fetching user data" });
  }
}

exports.getUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      return res.json({ status: "FAILED", message: "User with the provided ID does not exist" });
    }
    res.json({ status: "SUCCESS", data: doc.data() });
  } catch (err) {
    res.json({ status: "FAILED", message: "An error occurred while fetching user data" });
  }
}

exports.editUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      return res.json({ status: "FAILED", message: "User with the provided ID does not exist" });
    }
    const { username, email, password } = req.body;
    const data = { username, email, password };
    await firestore.collection('users').doc(id).set(data);
    res.json({ status: "SUCCESS", message: "User updated successfully" });
  } catch (err) {
    res.json({ status: "FAILED", message: "An error occurred while updating user data" });
  }
}

exports.deleteUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await firestore.collection('users').doc(id).get();
    if (!doc.exists) {
      return res.json({ status: "FAILED", message: "User with the provided ID does not exist" });
    }
    await firestore.collection('users').doc(id).delete();
    res.json({ status: "SUCCESS", message: "User deleted successfully" });
  } catch (err) {
    res.json({ status: "FAILED", message: "An error occurred while deleting user data" });
  }
}

exports.signout = (req, res) => {
  res.json({ status: "SUCCESS", message: "Signout successful" });
}

