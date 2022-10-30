import graphql from "graphql";

import { runListQuery, runGetQuery } from "../../utils.js";

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
  },
});

const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    // first query to select all
    Users: {
      type: graphql.GraphQLList(UserType),
      resolve: (root, args, context, info) => {
        return runListQuery("SELECT * FROM User;");
      },
    },
    // second query to select by id
    User: {
      type: UserType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
      },
      resolve: (root, { id }, context, info) => {
        // kids don't do bare templated sql statements at home,
        // this is the easiest sql injection vulnerability :)
        return runGetQuery(`SELECT * FROM User WHERE id = ${id}`);
      },
    },
  },
});

// Construct a schema, using GraphQL schema language
export const schema = new graphql.GraphQLSchema({
  query: queryType,
});
