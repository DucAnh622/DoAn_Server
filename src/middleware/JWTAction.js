import jwt from "jsonwebtoken";
require('dotenv').config();

const CreateJWT = (payload) => {
    try {
        let key = process.env.JWT_Secret_JWT_key
        let token = null
        if (payload) {
            token = jwt.sign(payload,key)
        }
        return token
    }
    catch(err) {
        console.log(err)
    }
}

module.exports = {
    CreateJWT
}