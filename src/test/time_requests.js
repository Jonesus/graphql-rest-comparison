import axios from 'axios';
import graphql, { GraphQLObjectType, print } from "graphql";
import gql from 'graphql-tag';


const gql_endpoint = "http://localhost:4000/graphql";

console.log("Test initialized");
console.log("");

console.log("Get All Users:");
console.time('REST');
const { users_rest_response } = await axios.get('http://localhost:4001/rest/user')
console.timeEnd('REST');

const GET_USERS = {
  "operationName": "getUsers",
  "query": `query getUsers { Users { id name }}`
};

console.time('GraphQL');
const users_gql_response = await axios({
  url: gql_endpoint,
  method: "post",
  data: GET_USERS
});
console.timeEnd('GraphQL');
console.log("");


console.log("Create a Blog");
console.time('REST');
const blog_rest_response = await axios({
  url: 'http://localhost:4001/rest/blog',
  method: "post",
  data: {
    name: "rest_test_blog",
    url: "google.com"
  }
});
console.timeEnd('REST');

// TODO: Please fix below :D

/* const CREATE_BLOG = gql`
  mutation createBlog($id: ${graphql.GraphQLID}, $name: ${graphql.GraphQLString}, $url: ${graphql.GraphQLString}) {
    createBlog(id: $id, name: $name, url: $url) {
      id
      name
      url
    }
  }
`;

console.time('GraphQL')
const blog_gql_response = await axios.post(gql_endpoint, {
  query: CREATE_BLOG,
  variables: {
    id: 100000,
    name: "gql_test_blog",
    url: "google.com",
  },
});
console.timeEnd('GraphQL') */
console.log("");


console.log("Get All Posts of a Blog");
console.time('REST');
const posts_of_blog_rest_response = await axios({
  url: 'http://localhost:4001/rest/blog/12/posts',
  method: "get",
});
console.timeEnd('REST');

const GET_POSTS_OF_BLOG = {
  "operationName": "getPosts",
  "query": `query getPosts { Posts(blogId: ${12}) { id title body blog {id name url} author {id name} }}`
};

console.time('GraphQL');
const posts_of_blog_gql_response = await axios({
  url: gql_endpoint,
  method: "post",
  data: GET_POSTS_OF_BLOG
});
console.timeEnd('GraphQL');
console.log("");

console.log("Get Post Comments");
console.time('REST');
const posts_comments_rest_response = await axios({
  url: 'http://localhost:4001/rest/post/12/comments',
  method: "get",
});
console.timeEnd('REST');

const GET_POST_COMMENTS = {
  "operationName": "getPostComments",
  "query": `query getPostComments { Post(id: 12) { comments { id body } }
}`
};

console.time('GraphQL');
const posts_comments_gql_response = await axios({
  url: gql_endpoint,
  method: "post",
  data: GET_POST_COMMENTS
});
console.timeEnd('GraphQL');



