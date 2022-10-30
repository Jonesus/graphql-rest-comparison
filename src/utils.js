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
