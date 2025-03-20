var express = require("express");
var router = express.Router();
let userController = require("../controllers/users");
var { CreateSuccessRes, CreateErrorRes } = require("../utils/ResHandler");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
let constants = require("../utils/constants");

/* GET all users - mod permission required */
router.get(
  "/",
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let users = await userController.GetAllUser();
      CreateSuccessRes(res, 200, users);
    } catch (error) {
      next(error);
    }
  }
);

/* GET user by ID - mod permission required (except for own user) */
router.get("/:id", check_authentication, async function (req, res, next) {
  try {
    // Allow users to view their own profile without special permissions
    if (req.params.id === req.user._id.toString()) {
      let user = await userController.GetUserById(req.params.id);
      return CreateSuccessRes(res, 200, user);
    }

    // For other users, require mod permission
    if (!constants.MOD_PERMISSION.includes(req.user.role.name)) {
      throw new Error("ban khong co quyen");
    }

    let user = await userController.GetUserById(req.params.id);
    CreateSuccessRes(res, 200, user);
  } catch (error) {
    next(error);
  }
});

/* CREATE user - admin permission required */
router.post(
  "/",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body;
      let newUser = await userController.CreateAnUser(
        body.username,
        body.password,
        body.email,
        body.role
      );
      CreateSuccessRes(res, 200, newUser);
    } catch (error) {
      next(error);
    }
  }
);

/* UPDATE user - admin permission required */
router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let updateUser = await userController.UpdateUser(req.params.id, req.body);
      CreateSuccessRes(res, 200, updateUser);
    } catch (error) {
      next(error);
    }
  }
);

/* DELETE user - admin permission required */
router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let result = await userController.DeleteUser(req.params.id);
      CreateSuccessRes(res, 200, { message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
