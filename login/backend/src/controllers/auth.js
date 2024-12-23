const express = require('express');
const bcrypt = require('bcrypt');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

exports.signUp = async (req, res) => {
  let { userName, email, password, confirmPassword } = req.body;
  userName = userName.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  if (userName === "" || email === "" || password === "" || confirmPassword === "") {
    return res.status(400).json({ status: "FAILED", message: "Empty input fields!" });
  } else if (!/^[a-zA-Z ]*$/.test(userName)) {
    return res.status(400).json({ status: "FAILED", message: "Invalid userName entered" });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ status: "FAILED", message: "Invalid email entered" });
  } else if (password.length < 8) {
    return res.status(400).json({ status: "FAILED", message: "Password must be at least 8 characters!" });
  } else if (confirmPassword !== password) {
    return res.status(400).json({ status: "FAILED", message: "Password confirmation mismatch" });
  }
  

  try {
    const snapshot = await firestore.collection('users').where( 'email', '==', email).get();

    if (!snapshot.empty) {
      return res.status(400).json({ status: "FAILED", message: "User with the provided email already exists" });
    }

    // Password handling
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userRef = await firestore.collection('users').add({
      userName,
      email,
      password: hashedPassword,
    })

    

    res.status(201).json({ 
      status: "SUCCESS",
      message: "SignUp successfull",
      data: {
        userId: userRef.id,
        userName,
        email,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "FAILED", message: "Error occurred while checking or saving user" });
  }
}

exports.signIn = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email === "" || password === "") {
    return res.json({ status: "FAILED", message: "Empty credentials supplied" });
  }

  try {
    const snapshot =await firestore.collection('users').where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(400).json({ status: "FAILED", message: "User Not Found" });
    }

    // Get user
    const userRef = snapshot.docs[0];
    const userData = userRef.data();

    const validPassword = await bcrypt.compare(password, userData.password);
    if (validPassword) {
      res.status(200).json({
        status: "SUCCESS",
        message: "SignIn successfull",
        data:{ 
          userId: userRef.id,
          userName: userData.userName,
          email: userData.email
         } });
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
    const data = [];
    snapshot.forEach(doc => {
      const user = doc.data();
      data.push({
        userId: doc.id,
        userName: user.userName,
        email: user.email
      })
    });
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
    res.status(200).json({ status: "SUCCESS", data: {
      userId: doc.id,
      userName: doc.data().userName,
      email: doc.data().email
    } });
  } catch (err) {
    res.status(500).json({ status: "FAILED", message: "An error occurred while fetching user data" });
  }
}

exports.updateUsersById = async (req, res) => {
  const { id } = req.params;
  try {
    const userRef = await firestore.collection('users').doc(id);
    const doc = await userRef.get();

    // check user
    if (!doc.exists) {
      return res.status(404).json({ status: "FAILED", message: "User not found" });
    }

    const existingData = doc.data();

    // Jika tidak ada data di body, kirim data user yang sudah ada untuk diedit
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(200).json({
        status: "SUCCESS",
        message: "Existing user data retrieved for editing",
        data: {
          userId: doc.id,
          userName: existingData.userName,
          email: existingData.email
        },
      });
    }

    const { userName, email, password } = req.body;

    // update data
    const updatedData = { ...existingData }; // copy existing data

    if (userName !== undefined) updatedData.userName = userName;
    if (email !== undefined) updatedData.email = email;
    if (password !== undefined) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(password, saltRounds);
    }

    // Update data in Firestore
    await userRef.set(updatedData, { merge: true });

    res.status(200).json({
      status: "SUCCESS",
      message: "User updated successfully",
      data: {
        userId: doc.id,
        userName: updatedData.userName,
        email: updatedData.email,
      },
    });
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

