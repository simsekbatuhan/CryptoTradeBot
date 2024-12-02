const express = require('express');
const router = express.Router();

const controllers = {
  user: require('../controllers/userController'),
  token: require('../controllers/loginController')
};

function addRoutes(controllerName, routes) {
  const controller = controllers[controllerName];
  routes.forEach(({ method, path, action }) => {
    if (controller[action]) {
      router[method](path, controller[action]);
    } else {
      console.warn(`Action ${action} not found in ${controllerName} controller`);
    }
  });
}

router.get('/', (req, res) => {
  res.json({ error: "You are not authorized to access this page." });
});

addRoutes('user', [
  { method: 'get', path: '/admin/user/findByUserId', action: 'findByUserId' },
  { method: 'get', path: '/admin/user/getAll', action: 'getAll' },
  { method: 'get', path: '/admin/user/findChars', action: 'findChars' },
  { method: 'get', path: '/admin/user/getUserStatics', action: 'getUserStatics' },
  { method: 'get', path: '/admin/user/getStatics', action: 'getStatics' },
  { method: 'get', path: '/admin/user/updateBalanceAndMainBalance', action: 'updateBalanceAndMainBalance' }
]);

addRoutes('token',[
  { method: 'get', path: '/token/login', action: 'login' },
  { method: 'get', path: '/token/loginByCode', action: 'loginByCode' },
])

module.exports = router;
