const { db } = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authUser = async (email, password) => {
    try {
        const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ userId: user.id }, "coscrules", { expiresIn: "12h" });
                return { 
                    id: user.id, 
                    role: user.role, 
                    name: `${user.first_name} ${user.last_name}`, 
                    token: token 
                };
            } else {
                console.log("Incorrect Credentials");
                return { error: "Incorrect Credentials" };
            }
        } else {
            console.log("User not found");
            return { error: "User not found" };
        }
    } catch (error) {
        console.error("Error occurred during authorization: ", error);
        return { error: "Internal Server Error" };
    }
}

const verifyUser = async (token) => {
    try {
        const decoded = jwt.verify(token, "coscrules");
        return { userId: decoded.userId };
    } catch (error) {
        console.error("Error occurred during verification: ", error);
        return { error: "Invalid Token" };
    }
}

module.exports = {
    authUser,
    verifyUser
}
