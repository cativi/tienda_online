// IMPORTS
const jwt = require('jsonwebtoken');

const createToken = (user) => {
    const obj = {
        // El id con _id porque esta base de datos es de MongoDB.
        id: user._id,
        role: user.role
    }
    return jwt.sign(obj, process.env.SECRET_KEY);
}

module.exports = { createToken };