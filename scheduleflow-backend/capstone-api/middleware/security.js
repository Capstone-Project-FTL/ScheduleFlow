const { verifyToken } = require("../utils/tokens");

function authenticateToken(req, res, next) {
  /*
      this extracts the token from the request header
      Note: we directly set the headder to include the specific field "authorization"
  */
  const token = req.headers.authorization?.split(" ")[1];
  try{
    res.locals.payload = verifyToken(token)
  }catch(error){
    res.locals.payload = {}
  }finally{
    next()
  }
}

module.exports = { authenticateToken }
