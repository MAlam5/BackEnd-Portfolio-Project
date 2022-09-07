const { removeCommentById } = require("../models/api.comments.model")

exports.deleteCommentById = (req,res,next)=>{
    const commentId = req.params.comment_id
    return removeCommentById(commentId).then(()=>{
        res.status(204).send()
    }).catch(next)
}