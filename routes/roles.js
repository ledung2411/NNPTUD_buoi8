var express = require("express");
var router = express.Router();
let roleController = require("../controllers/roles");
var { CreateSuccessRes, CreateErrorRes } = require("../utils/ResHandler");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
let constants = require("../utils/constants");

/* GET roles - no login required */
router.get("/", async function (req, res, next) {
  try {
    let roles = await roleController.GetAllRole();
    CreateSuccessRes(res, 200, roles);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let role = await roleController.GetRoleById(req.params.id);
    CreateSuccessRes(res, 200, role);
  } catch (error) {
    next(error);
  }
});

// CREATE role - admin permission required
router.post(
  "/",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let newRole = await roleController.CreateRole(req.body.name);
      CreateSuccessRes(res, 200, newRole);
    } catch (error) {
      next(error);
    }
  }
);

// UPDATE role - admin permission required
router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let updatedRole = await roleController.UpdateRole(
        req.params.id,
        req.body.name
      );
      CreateSuccessRes(res, 200, updatedRole);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE role - admin permission required
router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let result = await roleController.DeleteRole(req.params.id);
      CreateSuccessRes(res, 200, { message: "Role deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
