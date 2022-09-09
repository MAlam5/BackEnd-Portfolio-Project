const { removeCommentById } = require("../models/api.comments.model");

exports.deleteCommentById = async (req, res, next) => {
  try {
    const commentId = req.params.comment_id;
    await removeCommentById(commentId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
