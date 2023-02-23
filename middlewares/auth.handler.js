const boom = require('@hapi/boom');
const { config } = require('../config/config');


function checkApiKey(request, repsonse, next) {

  const apiKey = request.headers['api'];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}


function checkAdminRole(req, rep, next) {

  const user = req.user;
  if (user.role === 'admin') {
    next();
  } else {
    next(boom.forbidden());
  }
}

function checkRoles(...roles) {

  return (req, rep, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.forbidden());
    }
  }

}

module.exports = { checkApiKey, checkAdminRole, checkRoles };
