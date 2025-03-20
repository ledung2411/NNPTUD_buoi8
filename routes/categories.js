var express = require("express");
var router = express.Router();
let categoryModel = require("../schemas/category");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
let constants = require("../utils/constants");

/* GET categories - no login required */
router.get("/", async function (req, res, next) {
  try {
    let categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "khong co id phu hop",
      });
    }
    res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "khong co id phu hop",
    });
  }
});

// CREATE - mod permission required
router.post(
  "/",
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let newCategory = new categoryModel({
        name: req.body.name,
      });
      await newCategory.save();
      res.status(200).send({
        success: true,
        data: newCategory,
      });
    } catch (error) {
      next(error);
    }
  }
);

// UPDATE - mod permission required
router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      if (!req.body.name) {
        return res.status(400).send({
          success: false,
          message: "Name is required",
        });
      }

      let updatedCategory = await categoryModel.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).send({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).send({
        success: true,
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE - admin permission required
router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let category = await categoryModel.findById(req.params.id);
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Category not found",
        });
      }
      await categoryModel.findByIdAndDelete(req.params.id);

      res.status(200).send({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
