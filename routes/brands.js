"use strict";

/** Routes for brands. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Brand = require("../models/brand");
const brandNewSchema = require("../schemas/brandNew.json");
const brandUpdateSchema = require("../schemas/brandUpdate.json");
const { checkPhoto, uploadPhoto} = require("../helpers/photos")
let multer = require('multer')

const router = express.Router({ mergeParams: true });

// Set up multer to write incoming files to the tmp directory
var upload = multer({ dest: 'tmp/' })


/** POST / { brand } => { brand }
 *
 * brand should be { name, location, logo_url }
 *
 * Returns { handle, name, location, logo_url }
 *
 * Authorization required: user
 */

router.post("/", upload.single('logoUrl'), async function (req, res, next) {
  console.log(req.body)
  try {
    let content_check_passed = await checkPhoto(req.file.path);
    console.log("content is clean")
    if (content_check_passed){
      let photoUrl = await uploadPhoto(req.file.path)
      req.body['photoUrl'] = photoUrl;
      console.log(req.body)
    }
    console.log(req.body)
    const validator = jsonschema.validate(req.body, brandNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const brand = await Brand.create(req.body);
    return res.status(201).json({ brand });
  } catch (err) {
    return next(err);
  }
});

/** GET / => {brands}
 *  
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
    try {
        const brands = await Brand.findAll();
        return res.json({ brands });
      } catch (err) {
        return next(err);
      }
});

/** GET /[brandId] => { brand }
 *
 * Returns { id, name, location }
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const brand = await Brand.get(req.params.handle);
    return res.json({ brand });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id]  { fld1, fld2, ... } => { brand }
 *
 * Data can include: { name, location }
 *
 * Returns { id, name, location}
 *
 * Authorization required: admin
 */


router.patch("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, brandUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const brand = await Brand.update(req.params.handle, req.body);
    return res.json({ brand });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    await Brand.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;