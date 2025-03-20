let jwt = require("jsonwebtoken");
let constants = require("../utils/constants");
let userController = require("../controllers/users");

module.exports = {
  check_authentication: async function (req, res, next) {
    try {
      if (!req.headers || !req.headers.authorization) {
        throw new Error("ban chua dang nhap");
      }

      let authorization = req.headers.authorization;
      if (authorization.startsWith("Bearer")) {
        let token = authorization.split(" ")[1];
        let result = jwt.verify(token, constants.SECRET_KEY);
        if (result) {
          let id = result.id;
          let user = await userController.GetUserById(id);
          req.user = user;
          next();
        } else {
          throw new Error("token khong hop le");
        }
      } else {
        throw new Error("ban chua dang nhap");
      }
    } catch (error) {
      next(error);
    }
  },

  check_authorization: function (requiredRoles) {
    return function (req, res, next) {
      try {
        let role = req.user.role.name;
        if (requiredRoles.includes(role)) {
          next();
        } else {
          throw new Error("ban khong co quyen");
        }
      } catch (error) {
        next(error);
      }
    };
  },
};
