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

const randomBlogID = Math.floor(Math.random() * 1000000)

const CREATE_BLOG = {
  "query": `mutation {
      createBlog(input: {id: ${String(randomBlogID)}, name: "graphql_test_blog", url: "google.com"}){ id, name }
  }`
};

console.time('GraphQL')
const blog_gql_response = await axios({
  url: gql_endpoint,
  method: "post",
  data: CREATE_BLOG
});
console.timeEnd('GraphQL')
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
console.log("");

//TODO: Authors comments not returned. Fix API?
console.log("Get All Posts Where Author Has Commented");
console.time('REST');
const author_comments_rest_response = await axios({
  url: 'http://localhost:4001/rest/user/1',
  method: "get",
});
console.timeEnd('REST');

const GET_AUTHOR_COMMENTS = {
  "operationName": "getAuthorComments",
  "query": `query getAuthorComments { 
    User(id: 1) {
      comments {
        id
        body
      }
    } 
  }
}`
};

console.time('GraphQL');
const author_comments_gql_response = await axios({
  url: gql_endpoint,
  method: "post",
  data: GET_POST_COMMENTS
});
console.timeEnd('GraphQL');
console.log("");

console.log("Comment on a post");
const randomCommentRestID = Math.floor(Math.random() * 1000000)

console.time('REST');
const comment_post_rest_response = await axios({
  url: 'http://localhost:4001/rest/comment/',
  method: "post",
  data: {
    id: randomCommentRestID,
    body: "test",
    post: 1,
    parent: 1,
    user: 1
  }
});
console.timeEnd('REST');

const randomCommentgqlID = Math.floor(Math.random() * 1000000)
const CREATE_COMMENT = {
  "query": `mutation{
      createComment(input: {id: ${String(randomCommentgqlID)}, body: "gql test", post: ${1}, parent: ${1}, user: ${1}}){ id }
  }`
};

console.time('GraphQL')
const comment_gql_response = await axios({
  url: gql_endpoint,
  method: "post",
  data: CREATE_COMMENT
});
console.timeEnd('GraphQL')
console.log("");
