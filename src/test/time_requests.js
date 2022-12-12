import axios from 'axios';
import { performance } from 'perf_hooks';

const roundNumber = (rnum, rlength) => {
  var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
  return newnumber;
}

const gql_endpoint = "http://localhost:4000/graphql";

console.log("Test initialized");
console.log("");

var iterations = 100
let t0
let t1

let users_rest = 0
let users_gql = 0
let blog_rest = 0
let blog_gql = 0
let posts_of_blog_rest = 0
let posts_of_blog_gql = 0
let posts_comments_rest = 0
let posts_comments_gql = 0
let author_comments_rest = 0
let author_comments_gql = 0
let comment_post_rest = 0
let comment_post_gql = 0

for (var i = 0; i < iterations; i++) {

  console.log("Get All Users:");
  t0 = performance.now();
  const { users_rest_response } = await axios.get('http://localhost:4001/rest/user')
  t1 = performance.now();
  users_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);

  const GET_USERS = {
    "operationName": "getUsers",
    "query": `query getUsers { Users { id name }}`
  };

  t0 = performance.now();
  const users_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: GET_USERS
  });
  t1 = performance.now();
  users_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log("");


  console.log("Create a Blog");
  t0 = performance.now();
  const blog_rest_response = await axios({
    url: 'http://localhost:4001/rest/blog',
    method: "post",
    data: {
      name: "rest_test_blog",
      url: "google.com"
    }
  });
  t1 = performance.now();
  blog_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);

  const randomBlogID = Math.floor(Math.random() * 1000000)

  const CREATE_BLOG = {
    "query": `mutation {
      createBlog(input: {id: ${String(randomBlogID)}, name: "graphql_test_blog", url: "google.com"}){ id, name }
  }`
  };

  t0 = performance.now();
  const blog_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: CREATE_BLOG
  });
  t1 = performance.now();
  blog_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log("");

  console.log("Get All Posts of a Blog");
  t0 = performance.now();
  const posts_of_blog_rest_response = await axios({
    url: 'http://localhost:4001/rest/blog/12/posts',
    method: "get",
  });
  t1 = performance.now();
  posts_of_blog_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);

  const GET_POSTS_OF_BLOG = {
    "operationName": "getPosts",
    "query": `query getPosts { Posts(blogId: ${12}) { id title body blog {id name url} author {id name} }}`
  };

  t0 = performance.now();
  const posts_of_blog_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: GET_POSTS_OF_BLOG
  });
  t1 = performance.now();
  posts_of_blog_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log("");

  console.log("Get Post Comments");
  t0 = performance.now();
  const posts_comments_rest_response = await axios({
    url: 'http://localhost:4001/rest/post/12/comments',
    method: "get",
  });
  t1 = performance.now();
  posts_comments_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);

  const GET_POST_COMMENTS = {
    "operationName": "getPostComments",
    "query": `query getPostComments { Post(id: 12) { comments { id body } }
}`
  };

  t0 = performance.now();
  const posts_comments_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: GET_POST_COMMENTS
  });
  t1 = performance.now();
  posts_comments_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log("");

  console.log("Get All Posts Where Author Has Commented");
  t0 = performance.now();
  const author_comments_rest_response = await axios({
    url: 'http://localhost:4001/rest/comment/user/1',
    method: "get",
  });
  t1 = performance.now();
  author_comments_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);

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

  t0 = performance.now();
  const author_comments_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: GET_POST_COMMENTS
  });
  t1 = performance.now();
  author_comments_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log("");

  console.log("Comment on a post");
  const randomCommentRestID = Math.floor(Math.random() * 1000000)

  t0 = performance.now();
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
  t1 = performance.now();
  comment_post_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);

  const randomCommentgqlID = Math.floor(Math.random() * 1000000)
  const CREATE_COMMENT = {
    "query": `mutation{
      createComment(input: {id: ${String(randomCommentgqlID)}, body: "gql test", post: ${1}, parent: ${1}, user: ${1}}){ id }
  }`
  };

  t0 = performance.now();
  const comment_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: CREATE_COMMENT
  });
  t1 = performance.now();
  comment_post_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log("");
}

console.log(`Ran ${iterations} iterations. Averages for each test:`);
console.log("Get All Users:");
console.log(`REST: ${roundNumber(users_rest / iterations, 2)} ms`);
console.log(`GraphQL: ${roundNumber(users_gql / iterations, 2)} ms`);
console.log('');

console.log("Create a Blog");
console.log(`REST: ${roundNumber(blog_rest / iterations, 2)} ms`);
console.log(`GraphQL: ${roundNumber(blog_gql / iterations, 2)} ms`);
console.log('');

console.log("Get All Posts of a Blog");
console.log(`REST: ${roundNumber(posts_of_blog_rest / iterations, 2)} ms`);
console.log(`GraphQL: ${roundNumber(posts_of_blog_gql / iterations, 2)} ms`);
console.log('');

console.log("Get Post Comments");
console.log(`REST: ${roundNumber(posts_comments_rest / iterations, 2)} ms`);
console.log(`GraphQL: ${roundNumber(posts_comments_gql / iterations, 2)} ms`);
console.log('');

console.log("Get All Posts Where Author Has Commented");
console.log(`REST: ${roundNumber(author_comments_rest / iterations, 2)} ms`);
console.log(`GraphQL: ${roundNumber(author_comments_gql / iterations, 2)} ms`);
console.log('');

console.log("Comment on a post");
console.log(`REST: ${roundNumber(comment_post_rest / iterations, 2)} ms`);
console.log(`GraphQL: ${roundNumber(comment_post_gql / iterations, 2)} ms`);
console.log('');
