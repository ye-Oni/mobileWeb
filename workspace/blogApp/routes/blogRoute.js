// Blog 라우팅 API 모듈화

const Router = require("express");
// blogRouter 생성
const blogRouter = Router();
// Blog model 참조
const { Blog } = require("../models/Blog");
// user model 참조
const { User } = require("../models/User");
// ObjectId 유효성 검증을 위한 isValidObjectId 참조
const { isValidObjectId } = require("mongoose");

//commentRouter 참조
const { commentRouter } = require("./commentRoute");
/* blogRouter에 commentRouter 미들웨어 등록 
   - comment는 blog의 하위 개념이기 때문에 commentRouter를 부모인 blogRouter.js에 등록
*/
blogRouter.use("/:blogId/comment", commentRouter);

// blog 생성 API
blogRouter.post("/", async (req, res) => {
    try {
        //요청 파라미터 가져오기
        const { title, content, isOpen, userId } = req.body;
        //field validation
        if (typeof title !== "string")
          return res.status(400).send({ error: "title은 필수 항목입니다." });
        if (typeof content !== "string")
          return res.status(400).send({ error: "content은 필수 항목입니다." });
        if (isOpen && typeof isOpen !== "boolean")
          return res
            .status(400)
            .send({ error: "isOpen은 boolean type이어야 합니다." });
        if (!isValidObjectId(userId))
          return res.status(400).send({ error: "userId is invalid." });
        //DB에서 userId로 user 조회(user check(user가 존재하지 않으면 null))
        const user = await User.findById(userId);
        if (!user)
          return res.status(400).send({ error: "user가 존재하지 않습니다." });
        /* blog 작성(title, content, isOpen, user)
           - req.body: body에 있는 요청파라미터(title, content, isOpen)
           - user: user(document)
           (...req.body: 전개(spread) 연산자: 연산자의 대상 배열, 객체를 "개별요소"로 분리)      
        */
        let blog = new Blog({ ...req.body, user });
        //blog에 저장할 때는 mongoose가 schema에 맞춰 user(document) 아닌 userId로 저장
        await blog.save();
        return res.send({ blog });
        } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
        }
    });
// 전체 blog 조회 API
blogRouter.get("/", async (req, res) => {
    try {
        //전체 blog 조회(15개)
        let blogs = await Blog.find({}).limit(15);
        return res.send({ blogs });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
      }
});
// 특정 blogId로 blog 조회 API
blogRouter.get("/:blogId", async (req, res) => {
    try {
        //blogId를 가져와서 validation
        const { blogId } = req.params;
        if (!isValidObjectId(blogId))
          return res.status(400).send({ error: "blogId is invalid" });
        //blogId로 blog 조회
        const blog = await Blog.findOne({ _id: blogId });
        return res.send({ blog });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
      }
});
// 특정 blogId로 blog {title, content} 수정
blogRouter.put("/:blogId", async (req, res) => {
    try {
        //blogId를 가져와서 validation
        const { blogId } = req.params;
        if (!isValidObjectId(blogId))
          return res.status(400).send({ error: "blogId is invalid" });

        //title, content 가져오기
        const { title, content } = req.body;

        //title. content validation
        if (typeof title !== "string")
            return res.status(400).send({ error: "title is required" });
        if (typeof content !== "string")
            return res.status(400).send({ error: "content is required" });
        /* blogId로 수정할 blog를 찾아서 title, content를 update하고, 
            수정된 결과를 보여줌(new: true) */
        const blog = await Blog.findOneAndUpdate(
            { _id: blogId },
            { title, content },
            { new: true }
        );
        return res.send({ blog });
        } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
        }
});
// blogId로 blog 부분 수정(isOpen 수정(true, false))
blogRouter.patch("/:blogId/open", async (req, res) => {
    try {
        //blogId를 가져와서 validation
        const { blogId } = req.params;
        if (!isValidObjectId(blogId))
          return res.status(400).send({ error: "blogId is invalid" });
        //isOpen 가져와서 validation
        const { isOpen } = req.body;
        if (typeof isOpen !== "boolean")
          return res.status(400).send({ error: "boolean isOpen is required" });
        /* blogId로 수정할 blog를 찾아서 isOpen을 update하고, 
            수정된 결과를 보여줌(new: true) */
        const blog = await Blog.findByIdAndUpdate(
          { _id: blogId },
          { isOpen },
          { new: true }
        );
        return res.send({ blog });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
      }
});
// blogRouter 모듈화
module.exports = {
    blogRouter,
};