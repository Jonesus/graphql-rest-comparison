import express from "express";
import { graphqlHTTP } from "express-graphql";

import { schema as userSchema } from "./schema.js";

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: userSchema,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
