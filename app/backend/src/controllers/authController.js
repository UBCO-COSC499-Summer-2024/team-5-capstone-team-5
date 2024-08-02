const { db } = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authUser = async (email, password) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          {
            userId: user.id,
            role: user.role,
            name: user.first_name + " " + user.last_name,
            userEmail: user.email
          },
          "coscrules",
          { expiresIn: "12h" }
        );
        return { token };
      } else {
        console.log("Incorrect Credentials");
        return { message: "Incorrect Credentials" };
      }
    } else {
      return { message: "User not found" };
    }
  } catch (error) {
    console.error("Error occurred during authorization:", error);
    throw new Error("Internal Server Error");
  }
};

const verifyUser = async (token) => {
  if (token === 'null') {
    console.log("Token is null");
    return null;
  }
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, "coscrules", (err, decoded) => {
        if (err) {
          reject(new Error("Invalid JWT"));
        } else {
          resolve(decoded);
        }
      });
    });

    console.log("User ID from token:", decoded.userId);
    return decoded;
  } catch (error) {
    console.error("Error occurred during verification:", error.message);
    return null;
  }
};

const verifyPass = async (userId, oldPass, newPass) => {
  try {
    const data = await db.oneOrNone('SELECT password FROM users WHERE id = $1', [userId]);

    if (data) {
      const match = await bcrypt.compare(oldPass, data.password);
      if (match) {
        const hashedNewPass = await bcrypt.hash(newPass, 10);
        await db.none('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPass, userId]);
        return { message: "Password updated successfully" };
      } else {
        console.log("Incorrect Old Password");
        return { message: "Incorrect Old Password" };
      }
    } else {
      console.log("User not found");
      return { message: "User not found" };
    }
  } catch (error) {
    console.error("Error occurred verifying password:", error);
    throw new Error("Internal Server Error");
  }
};

module.exports = {
  authUser,
  verifyUser,
  verifyPass
};