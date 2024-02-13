import mongoose from 'mongoose';
import modelOptions from "./model.options.js"
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        unique: true,
    },
    displayName: {
    type: 'string',
        required: true,
    },
    password: {
    type: 'string',
        required: true,
        select:false,
    },
    salt: {
    type: 'string',
        required: true,
    },
}, modelOptions);

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).tostring("hex");
    this.password = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        "sha512"
    ).toString("hex");
}

userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        "sha512"
    ).toString("hex");

    return this.password === hash
};

const userModel = mongoose.model("User", userSchema);

export default userModel