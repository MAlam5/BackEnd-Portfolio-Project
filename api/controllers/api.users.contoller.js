const {
  fetchUsers,
  fetchUserByUsername,
} = require("../models/api.users.models");

exports.getUsers = async(req, res, next) => {
  try{
  const users = await fetchUsers()
  res.status(200).send({ users });
  }catch(next){
    next(err)
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await fetchUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
