

const { UnauthorizedError} = require('../expressError');

function isAdminOrSelf(re,res, next) {
 try{
  const isAdmin = req.user.isAdmin;
  const userUsername = req.params.username;
  if(isAdmin || res.user.username == userUsername){
   return next();
  }else{
   throw new UnauthorizedError(
     'You do not have permission to access this resource.'
   );
  }

 }catch(e){
  return next(e)
 }
}
module.exports = isAdminOrSelf