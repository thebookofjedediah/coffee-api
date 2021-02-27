"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for companies. */

class Coffee {
  /** Create a coffee (from data), update db, return new coffee data.
   *
   * data should be { name, brandHandle, roast_level }
   *
   * Returns { id, name, brandHandle, roast_level }
   **/

  static async create({ handle, name, brandHandle, roastLevel, photoUrl}) {
    const result = await db.query(
          `INSERT INTO coffees (handle,
                                name,
                                brand_handle,
                                roast_level,
                                photo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, brand_handle AS "brandHandle", roast_level AS "roastLevel", photo_url AS "photoUrl"`,
        [
          handle,
          name,
          brandHandle,
          roastLevel,
          photoUrl
        ]);
    
    let coffee = result.rows[0];

    return coffee;
  }

  /** Find all coffees ordered by name * */

  static async findAll() {

    const results = await db.query(
        `SELECT handle,
                name,
                brand_handle AS "brandHandle",
                roast_level AS "roastLevel",
                photo_url AS "photoUrl"
        FROM coffees
        ORDER BY name`);

    return results.rows;
  }

  /** Given a coffee handle, return data about coffee.
   *
   * Returns { handle, name, brand, roast_level }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const coffeeRes = await db.query(
          `SELECT handle,
                  name,
                  brand_handle AS "brandHandle",
                  roast_level AS "roastLevel",
                  photo_url AS "photoUrl"
           FROM coffees
           WHERE handle = $1`, [handle]);

    const coffee = coffeeRes.rows[0];

    if (!coffee) throw new NotFoundError(`No coffee: ${handle}`);

    return coffee;
  }

  /** Update coffee data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name, brand, roast_level, photo_url }
   *
   * Returns { handle, name, brand, roast_level, photo_url  }
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE coffees 
                      SET ${setCols} 
                      WHERE handle = ${idVarIdx} 
                      RETURNING handle, 
                                name, 
                                brand_handle AS "brandHandle",
                                roast_level AS "roastLevel",
                                photo_url AS "photoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const coffee = result.rows[0];

    if (!coffee) throw new NotFoundError(`No coffee: ${handle}`);

    return coffee;
  }

  /** Delete given coffee from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
          `DELETE
           FROM coffees
           WHERE handle = $1
           RETURNING handle`, [handle]);
    const coffee = result.rows[0];

    if (!coffee) throw new NotFoundError(`No coffee: ${handle}`);
  }
}

module.exports = Coffee;