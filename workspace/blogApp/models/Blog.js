// BlogSchema 선언

const { Schema, model, Types } = require("mongoose");

const BlogSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        isOpen: { type: Boolean, required: true, default: false },
        user: { type: Types.ObjectId, required: true, ref: "user" },
    },
    { timestamps: true }
);

// model 정의
const Blog = model("blog", BlogSchema);

// Blog 모델 모듈화
module.exports = {
    Blog,
};