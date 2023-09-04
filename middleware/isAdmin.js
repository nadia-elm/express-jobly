

const { UnauthorizedError } = require('../expressError');

function isAdmin(req,res,next) {
 // check if the user is authenticated and is admin
 if(!req.user || !req.user.isAdmin){

 throw new UnauthorizedError("You do not have permission to access this resource")
 }
 next();
}

module.exports = isAdmin