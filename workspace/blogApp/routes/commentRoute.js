/* comment 라우팅 API 모듈화 */
const { Router } = require("express");
/* commentRouter 생성
   - 부모(blogRouter)의 'req.params'에 접근하기 위해 'mergeParams: true' 옵션 설정
   - 기본값: 'Router({ mergeParams: false })' 
   - API: POST http://localhost:3000/blog/:blogId/comment/commentId
   - mergeParams: true 로 설정하면 부모(blogRouter)의 
     req.params에서 blog/:blogId를 가져올 수 있음
*/
const commentRouter = Router({ mergeParams: true });

//model 참조
const { Comment } = require("../models/Comment");
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");

//TODO: blog에 comment(후기) 달기
commentRouter.post("/", async (req, res) => {
    try {
        //부모의 blogId 가져오기
        const { blogId } = req.params;
        console.log({ blogId });
        //content, userId 가져오기
        const { content, userId } = req.body;

        //blogId, userId, content type validation
        if (!isValidObjectId(blogId))
            return res.status(400).send({ error: "blogId is invalid" });
        if (!isValidObjectId(userId))
            return res.status(400).send({ error: "userId is invalid" });
        if (typeof content !== "string")
            return res.status(400).send({ error: "content is required" });

    //DB에서 blogId, userId 가져오기(비동기 처리를 병렬로)
    const [blog, user] = await Promise.all([
        Blog.findById(blogId),
        User.findById(userId),
      ]);
        //blog, user validation
        if (!blog || !user)
            return res.status(400).send({ error: "blog or user does not exist" });
        //blog의 상태(isOpen)가 false인경우 후기 생성 안되도록
        if (!blog.isOpen)
            return res.status(400).send({ error: "blog is not available" });
        //comment(후기) 객체 생성
        const comment = new Comment({ content, user, blog });
        await comment.save(); //comment DB에 저장
            return res.send({ comment });
        } catch (error) {
        console.log(error);
            return res.status(400).send({ error: error.message });
        }
    });

//TODO: blogId로 해당 blog의 comment 전체 조회
commentRouter.get("/", async (req, res) => {
    try {
      //blogId 가져오기
      const { blogId } = req.params;
      //blogId validation
      if (!isValidObjectId(blogId))
        return res.status(400).send({ error: "blogId is invalid" });
      //특정 blog의 comment 조회
      const comments = await Comment.find({ blog: blogId });
      return res.send({ comments });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  });

//commentRouter 모듈화
module.exports = {
    commentRouter,
  };