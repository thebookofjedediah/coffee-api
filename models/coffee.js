"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for companies. */

class Coffee {
  /** Create a coffee (from data), update db, return new coffee data.
   *
   * data should be { name, brand, roast_level }
   *
   * Returns { id, name, brand, roast_level }
   **/

  static async create({ name, brand, roastLevel}) {
    const result = await db.query(
          `INSERT INTO coffees (name,
                                brand,
                                roast_level)
           VALUES ($1, $2, $3)
           RETURNING id, name, brand, roast_level AS "roastLevel"`,
        [
          name,
          brand,
          roastLevel
        ]);
    
    let coffee = result.rows[0];

    return coffee;
  }

  /** Find all coffees ordered by name * */

  static async findAll() {

    const results = await db.query(
        `SELECT id,
                name,
                brand,
                roast_level AS "roastLevel"
        FROM coffees
        ORDER BY name`);

    return results.rows;
  }

  /** Given a coffee id, return data about coffee.
   *
   * Returns { id, name, brand, roast_level }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const coffeeRes = await db.query(
          `SELECT id,
                  name,
                  brand,
                  roast_level
           FROM coffees
           WHERE id = $1`, [id]);

    const coffee = coffeeRes.rows[0];

    if (!coffee) throw new NotFoundError(`No coffee: ${id}`);

    return coffee;
  }

  /** Update coffee data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name, brand, roast_level }
   *
   * Returns { id, name, brand, roast_level  }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE coffees 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                brand, 
                                roast_level`;
    const result = await db.query(querySql, [...values, id]);
    const coffee = result.rows[0];

    if (!coffee) throw new NotFoundError(`No job: ${id}`);

    return coffee;
  }

  /** Delete given coffee from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM coffees
           WHERE id = $1
           RETURNING id`, [id]);
    const coffee = result.rows[0];

    if (!coffee) throw new NotFoundError(`No coffee: ${id}`);
  }
}

module.exports = Coffee;