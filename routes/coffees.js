"use strict";

/** Routes for coffees. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Coffee = require("../models/coffee");
const coffeeNewSchema = require("../schemas/coffeeNew.json");
const coffeeUpdateSchema = require("../schemas/coffeeUpdate.json");
const { checkPhoto, uploadPhoto} = require("../helpers/photos");
let multer = require('multer');

const router = express.Router({ mergeParams: true });

// Set up multer to write incoming files to the tmp directory
var upload = multer({ dest: 'tmp/' })


/** POST / { coffee } => { coffee }
 *
 * coffee should be { name, brand, roast_level, photo_url }
 *
 * Returns { id, name, brand, roast_level  }
 *
 * Authorization required: admin
 */

router.post("/", upload.single('photoUrl'), async function (req, res, next) {
  try {
    let content_check_passed = await checkPhoto(req.file.path);
    console.log("content is clean")
    if (content_check_passed){
      let photoUrl = await uploadPhoto(req.file.path)
      req.body['photoUrl'] = photoUrl;
    }
    const validator = jsonschema.validate(req.body, coffeeNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const coffee = await Coffee.create(req.body);
    return res.status(201).json({ coffee });
  } catch (err) {
    return next(err);
  }
});

/** GET / => {coffees}
 *  
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
    try {
        const coffees = await Coffee.findAll();
        return res.json({ coffees });
      } catch (err) {
        return next(err);
      }
});

/** GET /[coffeeId] => { coffee }
 *
 * Returns { id, name, brand, roast_level, photo_url }
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const coffee = await Coffee.get(req.params.handle);
    return res.json({ coffee });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id]  { fld1, fld2, ... } => { coffee }
 *
 * Data can include: { name, brand, roast_level, photo_url }
 *
 * Returns { id, name, brand, roast_level }
 *
 * Authorization required: admin
 */

router.patch("/:handle", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, coffeeUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const coffee = await Coffee.update(req.params.handle, req.body);
    return res.json({ coffee });
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
    await Coffee.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;