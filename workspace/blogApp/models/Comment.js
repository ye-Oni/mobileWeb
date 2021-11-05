// CommentSchema 선언
const { Schema, model, Types: { ObjectId },} = require("mongoose");

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        user: { type: ObjectId, required: true, ref: "user" }, // userId
        blog: { type: ObjectId, required: true, ref: "blog" }, // blogId
    },
    { timestamps: true }
);

// model 정의
const Comment = model("comment", CommentSchema);
// Comment 모델 모듈화
module.exports = {
    Comment, 
};