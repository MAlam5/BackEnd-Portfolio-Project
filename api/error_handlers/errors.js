exports.handleServerError = (err, req, res, next) => {
  console.log(err);
  res.send(500).send({ msg: "Internal Sever Error" });
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else {
    next(err);
  }
};

exports.handleSqlError = (err, req, res, next) => {
  const sqlErrrors = ['22P02'];
  if (sqlErrrors.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};
