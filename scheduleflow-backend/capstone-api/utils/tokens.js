const jwt = require("jsonwebtoken");
const {BadRequestError, UnauthorizedError} = require("./errors");
require("dotenv").config();

function generateToken(user) {
  const payload = {
    id: user.id,
    userName: user.userName,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    school: user.school,
  };
  return "Bearer " + jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600});
}

function verifyToken(token) {
  if (typeof token !== "string") throw new BadRequestError(`token not a string, its a ${typeof token}`)
  if (!token) throw new UnauthorizedError("user is not authorized", 403);

  jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
    if (error) {
      throw new UnauthorizedError("user is not authorized", 403);
    }
  });
  return jwt.decode(token);
}


module.exports = { generateToken, verifyToken };