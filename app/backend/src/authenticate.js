const { db } = require('./database');

const jwt = require('jsonwebtoken');

const authUser = async (email, password) => {
    try {
       const user = await db.oneOrNone("SELECT id, role, password FROM users WHERE email = $1", [email]);
        console.log(user)
        if(user.password == password) {
            const token = jwt.sign({userId: user.id}, "coscrules", {expiresIn: "12h"});
            return { "id" : user.id, "role" : user.role, "token" : token };
        } else {
            return;
        }   
    } catch(error) {
        console.error("Error occured during authorization: ", error)
    }
}

const verifyUser = async (token) => {
    try {
        jwt.verify(token, "coscrules", (err, decoded) => {
            if(err) {
                console.log("Invalid JWT")
                // Handle invalid token
            } else {
                // Handle user information
            }
        })
    } catch(error) {
        console.error("Error occured during verification: ", error)
        return;
    }
}

module.exports = {
    authUser
}