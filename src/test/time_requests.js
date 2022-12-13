import axios from "axios";
import { performance } from "perf_hooks";

const roundNumber = (rnum, rlength) => {
  var newnumber =
    Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
  return newnumber;
};

const gql_endpoint = "http://localhost:4000/graphql";

console.log("Test initialized");
console.log("");

var iterations = 100;
let t0;
let t1;

let users_rest = 0;
let users_rest_size = 0;
let users_gql = 0;
let users_gql_size = 0;
let blog_rest = 0;
let blog_rest_size = 0;
let blog_gql = 0;
let blog_gql_size = 0;
let posts_of_blog_rest = 0;
let posts_of_blog_rest_size = 0;
let posts_of_blog_gql = 0;
let posts_of_blog_gql_size = 0;
let posts_comments_rest = 0;
let posts_comments_rest_size = 0;
let posts_comments_gql = 0;
let posts_comments_gql_size = 0;
let author_comments_rest = 0;
let author_comments_rest_size = 0;
let author_comments_gql = 0;
let author_comments_gql_size = 0;
let comment_post_rest = 0;
let comment_post_rest_size = 0;
let comment_post_gql = 0;
let comment_post_gql_size = 0;

for (var i = 0; i < iterations; i++) {
  console.log("Get All Users Names:");
  t0 = performance.now();
  const users_rest_response = await axios({
    url: "http://localhost:4001/rest/user",
    method: "get"
  });
  t1 = performance.now();
  users_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('REST response size:', users_rest_response.headers["content-length"]);
  users_rest_size = users_rest_response.headers["content-length"]


  const GET_USERS = {
    operationName: "getUsers",
    query: `query getUsers { Users { name }}`,
  };

  t0 = performance.now();
  const users_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: GET_USERS,
  });
  t1 = performance.now();
  users_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('GraphQL response size:', users_gql_response.headers["content-length"]);
  users_gql_size = users_gql_response.headers["content-length"]


  console.log("");

  console.log("Create a Blog");
  t0 = performance.now();
  const blog_rest_response = await axios({
    url: "http://localhost:4001/rest/blog",
    method: "post",
    data: {
      name: "rest_test_blog",
      url: "google.com",
    },
  });
  t1 = performance.now();
  blog_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('REST response size:', blog_rest_response.headers["content-length"]);
  blog_rest_size = blog_rest_response.headers["content-length"]


  const randomBlogID = Math.floor(Math.random() * 1000000);

  const CREATE_BLOG = {
    query: `mutation {
      createBlog(input: {id: ${String(
      randomBlogID
    )}, name: "graphql_test_blog", url: "google.com"}){ id, name }
  }`,
  };

  t0 = performance.now();
  const blog_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: CREATE_BLOG,
  });
  t1 = performance.now();
  blog_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('GraphQL response size:', blog_gql_response.headers["content-length"]);
  blog_gql_size = blog_gql_response.headers["content-length"]
  console.log("");

  console.log("Get All Posts Titles of a Blog");
  t0 = performance.now();
  const posts_of_blog_rest_response = await axios({
    url: "http://localhost:4001/rest/blog/12/posts",
    method: "get",
  });
  t1 = performance.now();
  posts_of_blog_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('REST response size:', posts_of_blog_rest_response.headers["content-length"])
  posts_of_blog_rest_size = posts_of_blog_rest_response.headers["content-length"];

  const GET_POSTS_OF_BLOG = {
    operationName: "getPosts",
    query: `query getPosts { Posts(blogId: ${12}) { title }}`,
  };

  t0 = performance.now();
  const posts_of_blog_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: GET_POSTS_OF_BLOG,
  });
  t1 = performance.now();
  posts_of_blog_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('GraphQL response size:', posts_of_blog_gql_response.headers["content-length"])
  posts_of_blog_gql_size = posts_of_blog_gql_response.headers["content-length"];
  console.log("");

  console.log("Get Post Comments");
  t0 = performance.now();
  const posts_comments_rest_response = await axios({
    url: "http://localhost:4001/rest/post/12/comments",
    method: "get",
  });
  t1 = performance.now();
  posts_comments_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('REST response size:', posts_comments_rest_response.headers["content-length"])
  posts_comments_rest_size = posts_comments_rest_response.headers["content-length"]

  const GET_POST_COMMENTS = {
    operationName: "getPostComments",
    query: `query getPostComments { Post(id: 12) { comments { id body } }
}`,
  };

  t0 = performance.now();
  const posts_comments_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: GET_POST_COMMENTS,
  });
  t1 = performance.now();
  posts_comments_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('GraphQL response size:', posts_comments_gql_response.headers["content-length"])
  posts_comments_gql_size = posts_comments_gql_response.headers["content-length"]

  console.log("");

  console.log("Get All Posts Where Author Has Commented");
  t0 = performance.now();
  const author_comments_rest_response = await axios({
    url: "http://localhost:4001/rest/comment/user/1",
    method: "get",
  });
  t1 = performance.now();
  author_comments_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('REST response size:', author_comments_rest_response.headers["content-length"])
  author_comments_rest_size = author_comments_rest_response.headers["content-length"]


  const GET_AUTHOR_COMMENTS = {
    query: ` 
    {
      User(id: 1) {
        name
        comments {
          id
          body
        }
      }
    }
    
`,
  };

  t0 = performance.now();
  const author_comments_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: GET_AUTHOR_COMMENTS,
  });
  t1 = performance.now();
  author_comments_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('GraphQL response size:', author_comments_gql_response.headers["content-length"])
  author_comments_gql_size = author_comments_gql_response.headers["content-length"]
  console.log("");

  console.log("Comment on a post");
  const randomCommentRestID = Math.floor(Math.random() * 1000000);

  t0 = performance.now();
  const comment_post_rest_response = await axios({
    url: "http://localhost:4001/rest/comment/",
    method: "post",
    data: {
      id: randomCommentRestID,
      body: "test",
      post: 1,
      parent: 1,
      user: 1,
    },
  });
  t1 = performance.now();
  comment_post_rest += t1 - t0;
  console.log(`REST: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('REST response size:', comment_post_rest_response.headers["content-length"])
  comment_post_rest_size = comment_post_rest_response.headers["content-length"]

  const randomCommentgqlID = Math.floor(Math.random() * 1000000);
  const CREATE_COMMENT = {
    query: `mutation{
      createComment(input: {id: ${String(
      randomCommentgqlID
    )}, body: "gql test", post: ${1}, parent: ${1}, user: ${1}}){ id }
  }`,
  };

  t0 = performance.now();
  const comment_gql_response = await axios({
    url: gql_endpoint,
    method: "post",
    data: CREATE_COMMENT,
  });
  t1 = performance.now();
  comment_post_gql += t1 - t0;
  console.log(`GraphQL: ${roundNumber(t1 - t0, 2)} ms`);
  console.log('GraphQL response size:', comment_gql_response.headers["content-length"])
  comment_post_gql_size = comment_gql_response.headers["content-length"]
  console.log("");
}

console.log("");
console.log("");
console.log(`Ran ${iterations} iterations. Averages for each test:`);
console.log("Get All Users Names:");
console.log(`REST: ${roundNumber(users_rest / iterations, 2)} ms`);
console.log("REST response size:", users_rest_size);
console.log(`GraphQL: ${roundNumber(users_gql / iterations, 2)} ms`);
console.log("GraphQL response size:", users_gql_size);
console.log(`Relative difference: ${roundNumber(users_rest / users_gql, 2)}`);
console.log("");

console.log("Create a Blog");
console.log(`REST: ${roundNumber(blog_rest / iterations, 2)} ms`);
console.log("REST response size:", blog_rest_size);
console.log(`GraphQL: ${roundNumber(blog_gql / iterations, 2)} ms`);
console.log("GraphQL response size:", blog_gql_size);
console.log(`Relative difference: ${roundNumber(blog_rest / blog_gql, 2)}`);
console.log("");

console.log("Get All Posts Titles of a Blog");
console.log(`REST: ${roundNumber(posts_of_blog_rest / iterations, 2)} ms`);
console.log("REST response size:", posts_of_blog_rest_size);
console.log(`GraphQL: ${roundNumber(posts_of_blog_gql / iterations, 2)} ms`);
console.log("GraphQL response size:", posts_of_blog_gql_size);
console.log(
  `Relative difference: ${roundNumber(
    posts_of_blog_rest / posts_of_blog_gql,
    2
  )}`
);
console.log("");

console.log("Get Post Comments");
console.log(`REST: ${roundNumber(posts_comments_rest / iterations, 2)} ms`);
console.log("REST response size:", posts_comments_rest_size);
console.log(`GraphQL: ${roundNumber(posts_comments_gql / iterations, 2)} ms`);
console.log("GraphQL response size:", posts_of_blog_gql_size);
console.log(
  `Relative difference: ${roundNumber(
    posts_comments_rest / posts_comments_gql,
    2
  )}`
);
console.log("");

console.log("Get All Posts Where Author Has Commented");
console.log(`REST: ${roundNumber(author_comments_rest / iterations, 2)} ms`);
console.log("REST response size:", author_comments_rest_size);
console.log(`GraphQL: ${roundNumber(author_comments_gql / iterations, 2)} ms`);
console.log("GraphQL response size:", author_comments_gql_size);
console.log(
  `Relative difference: ${roundNumber(
    author_comments_rest / author_comments_gql,
    2
  )}`
);
console.log("");

console.log("Comment on a post");
console.log(`REST: ${roundNumber(comment_post_rest / iterations, 2)} ms`);
console.log("REST response size:", comment_post_rest_size);
console.log(`GraphQL: ${roundNumber(comment_post_gql / iterations, 2)} ms`);
console.log("GraphQL response size:", comment_post_gql_size);
console.log(
  `Relative difference: ${roundNumber(comment_post_rest / comment_post_gql, 2)}`
);
console.log("");
