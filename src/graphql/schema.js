import graphql from "graphql";

import { runListQuery, runGetQuery, runQuery } from "../utils.js";

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
  },
});

const BlogType = new graphql.GraphQLObjectType({
  name: "Blog",
  fields: {
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    url: { type: graphql.GraphQLString },
  },
});

const PostType = new graphql.GraphQLObjectType({
  name: "Post",
  fields: {
    id: { type: graphql.GraphQLID },
    title: { type: graphql.GraphQLString },
    body: { type: graphql.GraphQLString },
    blog: { type: graphql.GraphQLID },
    author: { type: graphql.GraphQLID },
  },
});

const CommentType = new graphql.GraphQLObjectType({
  name: "Post",
  fields: {
    id: { type: graphql.GraphQLID },
    body: { type: graphql.GraphQLString },
    post: { type: graphql.GraphQLID },
    parent: { type: graphql.GraphQLID  },
    user: { type: graphql.GraphQLID },
  },
});

const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    // Query to select all Users
    Users: {
      type: graphql.GraphQLList(UserType),
      resolve: (root, args, context, info) => {
        return runListQuery("SELECT * FROM User;");
      },
    },
    // Query to select user by id
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
    // Query to select all blogs
    Blogs: {
      type: graphql.GraphQLList(BlogType),
      resolve: (root, args, context, info) => {
        return runListQuery("SELECT * FROM Blog;");
      },
    },
    // Query to select blog by id
    Blog: {
      type: BlogType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
      },
      resolve: (root, { id }, context, info) => {
        return runGetQuery(`SELECT * FROM Blog WHERE id = ${id}`);
      },
    },
    // Query to select posts by blog id
    Posts: {
      type: graphql.GraphQLList(PostType),
      args: {
        blogId: {
          type: new graphql.GraphQLList(graphql.GraphQLID),
        },
      },
      resolve: (root, { blogId }, context, info) => {
        return runListQuery(`SELECT * FROM Post WHERE blog = ${blogId}`);
      },
    },
  },
});

// Construct a schema, using GraphQL schema language
export const schema = new graphql.GraphQLSchema({
  query: queryType,
});
