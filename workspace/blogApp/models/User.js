// User schema 선선
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        info: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            email: String,
            age: Number,
        },
    },
    { timestamps: true }
);

// model 정의
const User = mongoose.model("user", UserSchema);

// User model 모듈화
module.exports = {
    User,
};