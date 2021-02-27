"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for companies. */

class Brand {
  /** Create a brand (from data), update db, return new brand data.
   *
   * data should be { handle, name, location, logoUrl }
   *
   * Returns { handle, name, location, logoUrl }
   *
   * Throws BadRequestError if brand already in database.
   * */

  static async create({ handle, name, location, logoUrl }) {
    const duplicateCheck = await db.query(
          `SELECT handle
           FROM brands
           WHERE handle = $1`,
        [handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate brand: ${handle}`);

    const result = await db.query(
          `INSERT INTO brands
           (handle, name, location, logo_url)
           VALUES ($1, $2, $3, $4)
           RETURNING handle, name, location, logo_url AS "logoUrl"`,
        [
          handle,
          name,
          location,
          logoUrl,
        ],
    );
    const brand = result.rows[0];

    return brand;
  }

    /** Find all brands ordered by name * */

    static async findAll() {

      const results = await db.query(
        `SELECT handle,
                name,
                location,
                logo_url AS "logoUrl"
        FROM brands
        ORDER BY name`);
  
      return results.rows;
    }

  /** Given a brand handle, return data about brand.
   *
   * Returns { handle, name, location, logoUrl, coffees }
   *   where coffees is [{ id, title, salary, equity }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const brandRes = await db.query(
          `SELECT handle,
                  name,
                  location,
                  logo_url AS "logoUrl"
           FROM brands
           WHERE handle = $1`,
        [handle]);

    const brand = brandRes.rows[0];

    if (!brand) throw new NotFoundError(`No brand: ${handle}`);

    const coffeesRes = await db.query(
          `SELECT handle,
                  name, 
                  brand_handle AS "brandHandle", 
                  roast_level AS "roastLevel"
           FROM coffees
           WHERE brand_handle = $1
           ORDER BY name`,
        [handle],
    );

    brand.coffees = coffeesRes.rows;

    return brand;
  }

   /** Update brand data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, location, logoUrl}
   *
   * Returns {handle, name, location, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          logoUrl: "logo_url",
        });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE brands 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                location,
                                logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const brand = result.rows[0];

    if (!brand) throw new NotFoundError(`No brand: ${handle}`);

    return brand;
  }

  /** Delete given brand from database; returns undefined.
   *
   * Throws NotFoundError if brand not found.
   **/

  static async remove(handle) {
    const result = await db.query(
          `DELETE
           FROM brands
           WHERE handle = $1
           RETURNING handle`, [handle]);
    const brand = result.rows[0];

    if (!brand) throw new NotFoundError(`No brand: ${handle}`);
  }
}

module.exports = Brand;