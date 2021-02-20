"use strict";

/** Routes for coffees. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Coffee = require("../models/coffee");
const coffeeNewSchema = require("../schemas/coffeeNew.json");
const coffeeUpdateSchema = require("../schemas/coffeeUpdate.json");

const router = express.Router({ mergeParams: true });


/** POST / { coffee } => { coffee }
 *
 * coffee should be { name, brand, roast_level }
 *
 * Returns { id, name, brand, roast_level  }
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
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
 * Returns { id, name, brand, roast_level }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const coffee = await Coffee.get(req.params.id);
    return res.json({ coffee });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id]  { fld1, fld2, ... } => { coffee }
 *
 * Data can include: { name, brand, roast_level }
 *
 * Returns { id, name, brand, roast_level }
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, coffeeUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const coffee = await Coffee.update(req.params.id, req.body);
    return res.json({ coffee });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Coffee.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;