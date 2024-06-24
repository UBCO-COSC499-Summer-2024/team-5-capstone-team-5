const { db } = require('../database');

const jwt = require('jsonwebtoken');

const authUser = async (email, password) => {
    try {
       const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
       if(user) {
            if(user.password == password) {
                const token = jwt.sign({userId: user.id, role: user.role, name: user.first_name+" "+user.last_name}, "coscrules", {expiresIn: "12h"});
                return { "token" : token };
            } else {
                console.log("Incorrect Credentials");
                return;
            }
        } else {
            return;
        }
    } catch(error) {
        console.error("Error occured during authorization: ", error)
    }
}

const verifyUser = async (token) => {
    if(token === 'null') {return;}
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
  
      console.log(decoded.id);
      return decoded;
    } catch (error) {
      console.error("Error occurred during verification: ", error.message);
      return null;
    }
  };

  const verifyPass = async (userId, oldPass, newPass) => {
    try {
      const data = await db.oneOrNone(
        'SELECT password FROM users WHERE id = $1', [userId]
      )
      console.log(data);
      if(data.password === oldPass) {
        console.log(newPass, userId)
        await db.none(
          'UPDATE users SET password = $1 WHERE id = $2', [newPass, userId]
        )
      }
    } catch(error) {
      console.error("Error occured verifying password");
      return null;
    }
  }

module.exports = {
    authUser,
    verifyUser,
    verifyPass
}