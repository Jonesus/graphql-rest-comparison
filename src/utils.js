import { db } from "../src/db.js";

/* Runs given sql string, returns result as promise */
export async function runListQuery(queryString) {
  return new Promise((resolve, reject) => {
    db.all(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        reject([]);
      }
      resolve(rows);
    });
  });
}

/* Runs given sql string, returns result as promise */
export async function runGetQuery(queryString) {
  return new Promise((resolve, reject) => {
    db.get(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        reject([]);
      }
      resolve(rows);
    });
  });
}

export async function runInsertQuery(table, object) {
  return new Promise((resolve, reject) => {
    const cols = Object.keys(object).join(", ");
    const placeholders = Object.keys(object).fill("?").join(", ");
    db.run(
      `INSERT INTO ${table} (${cols}) VALUES (${placeholders});`,
      Object.values(object),
      function (err) {
        if (err) {
          console.log(err);
          reject([]);
        }
        resolve(this.lastID);
      }
    );
  });
}
