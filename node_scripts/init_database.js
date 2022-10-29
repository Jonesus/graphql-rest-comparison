import fs from "fs";
import { db } from "../src/db.js";

const initScript = fs.readFileSync("./sql_scripts/init.sql").toString();

db.run(initScript);
