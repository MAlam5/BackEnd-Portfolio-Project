const db = require("../../db/connection");

exports.removeCommentById = (commentId) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      commentId,
    ])
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return comment.rows
    });
};
