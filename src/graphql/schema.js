import graphql, { GraphQLObjectType } from "graphql";

import { runListQuery, runGetQuery, runInsertQuery } from "../utils.js";

const UserType = new graphql.GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    comments: {
      type: graphql.GraphQLList(CommentType),
      resolve: (user) => {
        return runListQuery(`SELECT * FROM Comment WHERE user = ${user.id}`);
      },
    },
  }),
});

const BlogType = new graphql.GraphQLObjectType({
  name: "Blog",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    url: { type: graphql.GraphQLString },
    posts: {
      type: graphql.GraphQLList(PostType),
      resolve: (blog) => {
        return runListQuery(`SELECT * FROM Post WHERE blog = ${blog.id}`);
      },
    },
  }),
});

const BlogInputType = new graphql.GraphQLInputObjectType({
  name: "BlogInput",
  fields: {
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    url: { type: graphql.GraphQLString },
  },
});

const PostType = new graphql.GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    title: { type: graphql.GraphQLString },
    body: { type: graphql.GraphQLString },
    blog: {
      type: BlogType,
      resolve: (post) => {
        return runGetQuery(`SELECT * FROM Blog WHERE id = ${post.blog}`);
      },
    },
    author: {
      type: UserType,
      resolve: (post) => {
        return runGetQuery(`SELECT * FROM User WHERE id = ${post.author}`);
      },
    },
    comments: {
      type: graphql.GraphQLList(CommentType),
      resolve: (post) => {
        return runListQuery(`SELECT * FROM Comment WHERE post = ${post.id}`);
      },
    },
  }),
});

const CommentType = new graphql.GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    body: { type: graphql.GraphQLString },
    post: {
      type: PostType,
      resolve: (comment) => {
        return runGetQuery(`SELECT * FROM Post WHERE id = ${comment.post}`);
      },
    },
    parent: {
      type: CommentType,
      resolve: (comment) => {
        return runGetQuery(
          `SELECT * FROM Comment WHERE id = ${comment.parent}`
        );
      },
    },
    user: {
      type: UserType,
      resolve: (comment) => {
        return runGetQuery(`SELECT * FROM User WHERE id = ${comment.user}`);
      },
    },
  }),
});

const CommentInputType = new graphql.GraphQLInputObjectType({
  name: "CommentInput",
  fields: {
    id: { type: graphql.GraphQLID },
    body: { type: graphql.GraphQLString },
    post: { type: graphql.GraphQLID },
    parent: { type: graphql.GraphQLID },
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
    // Query to select post by id
    Post: {
      type: PostType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
      },
      resolve: (root, args, context, info) => {
        return runGetQuery(`SELECT * FROM Post WHERE id = ${id}`);
      },
    },
    // Query to select posts by blog id
    Posts: {
      type: graphql.GraphQLList(PostType),
      args: {
        blogId: {
          type: graphql.GraphQLID,
        },
        comments: {
          type: graphql.GraphQLList(graphql.GraphQLID),
        },
      },
      resolve: (root, { blogId, comments }, context, info) => {
        if (blogId)
          return runListQuery(`SELECT * FROM Post WHERE blog = ${blogId}`);
        if (comments)
          return runListQuery(
            `SELECT DISTINCT p.id, p.title, p.body, p.blog, p.author
             FROM Post p JOIN Comment c ON p.id=c.post
             WHERE c.id IN (${comments.join(",")});`
          );
        return runListQuery("SELECT * FROM Post");
      },
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createBlog: {
      type: BlogType,
      args: {
        input: { type: BlogInputType },
      },
      resolve: async (root, { input }) => {
        const id = await runInsertQuery("Blog", input);
        return runGetQuery(`SELECT * FROM Blog WHERE id = ${id}`);
      },
    },
    createComment: {
      type: CommentType,
      args: {
        input: { type: CommentInputType },
      },
      resolve: async (root, { input }) => {
        const id = await runInsertQuery("Comment", input);
        return runGetQuery(`SELECT * FROM Comment WHERE id = ${id}`);
      },
    },

    // Query to select all posts
    AllPosts: {
      type: graphql.GraphQLList(PostType),
      resolve: (root, args, context, info) => {
        return runListQuery("SELECT * FROM Post");
      },
    },
  },
});

// Construct a schema, using GraphQL schema language
export const schema = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
