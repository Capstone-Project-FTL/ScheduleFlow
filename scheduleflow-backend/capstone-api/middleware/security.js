const { verifyToken } = require("../utils/tokens");

function authenticateToken(req, res, next) {
  /*
      this extracts the token from the request header
      Note: we directly set the headder to include the specific field "Authorization"
  */
  const token = req.headers.authorization?.split(" ")[1];
  try{
    res.locals.payload = verifyToken(token)
    res.locals.error = null
  }catch(error){
    res.locals.payload = {}
    res.locals.error = {message: "Invalid token. Please sign up or log in"}
  }finally{
    next()
  }
}

module.exports = { authenticateToken }
