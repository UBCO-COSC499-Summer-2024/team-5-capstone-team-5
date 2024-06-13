const { db } = require('./database');

const authUser = async (email, password) => {
    try {
        const user = await db.none(`SELECT id, role FROM users WHERE email=${email} AND password=${password}`)
        console.log(user);
        if(user) {
            return true;
        } else {
            return false;
        }
    } catch(error) {
        console.error("Error occured during authorization: ", error)
    }
}

const verifyUser = async (token) => {
    try {
        
    } catch(error) {
        console.error("Error occured during verification: ", error)
    }
}

module.exports = {
    authUser
}