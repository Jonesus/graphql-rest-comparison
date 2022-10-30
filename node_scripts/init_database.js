import fs from "fs";
import { db } from "../src/db.js";

const initScript = fs.readFileSync("./sql_scripts/init.sql").toString();
// Convert the SQL string to array so that you can run them one at a time.
// You can split the strings using the query delimiter i.e. `;` in // my case I used `);` because some data in the queries had `;`.
const dataArr = initScript.split(");");
// db.serialize ensures that your queries are one after the other depending on which one came first in your `dataArr`
db.serialize(() => {
  // db.run runs your SQL query against the DB
  db.run("PRAGMA foreign_keys=OFF;");
  db.run("BEGIN TRANSACTION;");
  // Loop through the `dataArr` and db.run each query
  dataArr.forEach((query) => {
    if (query) {
      // Add the delimiter back to each query before you run them
      // In my case the it was `);`
      query += ");";
      db.run(query, (err) => {
        if (err) throw err;
      });
    }
  });
  db.run("COMMIT;");
});
// Close the DB connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Closed the database connection.");
});
