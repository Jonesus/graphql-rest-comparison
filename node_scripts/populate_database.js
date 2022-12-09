import { faker } from "@faker-js/faker";
import { db } from "../src/db.js";
import {
  RANDOM_SEED,
  BLOG_COUNT,
  USER_COUNT,
  POST_COUNT,
  COMMENT_COUNT,
} from "../src/consts.js";

faker.seed(RANDOM_SEED);

// Generate a SQL statement for inserting multiple users.
// End result looks something like this (without nice formatting):
//
// INSERT INTO User (name) VALUES
//   ("John Doe"),
//   ...
//   ("Jane Doe");

// Users
db.get("SELECT count(*) from User;", (_err, res) => {
  const count = res["count(*)"];
  if (count < USER_COUNT) {
    const userRows = Array.from({ length: USER_COUNT }).map(
      () => `("${faker.name.fullName()}")`
    );

    // We need to run the sql queries in batches, otherwise the
    // SQLite parser will overflow from our huge insert string
    const step = 20;
    for (let i = 0; i < USER_COUNT; i += step) {
      const userRowsString = userRows.slice(i, i + step).join(", ");
      const userStatement = `INSERT INTO User (name) VALUES ${userRowsString};`;
      db.run(userStatement);
    }

    console.log(`Created ${USER_COUNT} users`);
  } else {
    console.log(`${count} users already exist`);
  }
});

// Blogs
db.get("SELECT count(*) from Blog;", (_err, res) => {
  const count = res["count(*)"];
  if (count < BLOG_COUNT) {
    const blogRows = Array.from({ length: BLOG_COUNT }).map(
      () =>
        `("${faker.company.name()}'s blog", "${faker.internet.domainName()}")`
    );

    const step = 20;
    for (let i = 0; i < BLOG_COUNT; i += step) {
      const blogRowsString = blogRows.slice(i, i + step).join(", ");
      const blogStatement = `INSERT INTO Blog (name, url) VALUES ${blogRowsString};`;
      db.run(blogStatement);
    }

    console.log(`Created ${BLOG_COUNT} blogs`);
  } else {
    console.log(`${count} blogs already exist`);
  }
});

// Posts
db.get("SELECT count(*) from Post;", (_err, res) => {
  const count = res["count(*)"];
  if (count < POST_COUNT) {
    const postRows = Array.from({ length: POST_COUNT }).map(
      () =>
        `("${faker.lorem.sentence()}", "${faker.lorem.paragraph()}", ${faker.datatype.number(
          { min: 1, max: BLOG_COUNT }
        )}, ${faker.datatype.number({ min: 1, max: USER_COUNT })})`
    );

    const step = 20;
    for (let i = 0; i < POST_COUNT; i += step) {
      const postRowsString = postRows.slice(i, i + step).join(", ");
      const postStatement = `INSERT INTO Post (title, body, blog, author) VALUES ${postRowsString};`;
      db.run(postStatement);
    }

    console.log(`Created ${POST_COUNT} posts`);
  } else {
    console.log(`${count} posts already exist`);
  }
});

// Comments
db.get("SELECT count(*) from Comment;", (_err, res) => {
  const count = res["count(*)"];
  if (count < COMMENT_COUNT) {
    const commentRows = Array.from({ length: COMMENT_COUNT }).map(
      () =>
        `("${faker.lorem.paragraph()}", ${faker.datatype.number({
          min: 1,
          max: POST_COUNT,
        })}, NULL, ${faker.datatype.number({ min: 1, max: USER_COUNT })})`
    );

    const step = 20;
    for (let i = 0; i < COMMENT_COUNT; i += step) {
      const commentRowsString = commentRows.slice(i, i + step).join(", ");
      const commentStatement = `INSERT INTO Comment (body, post, parent, user) VALUES ${commentRowsString};`;
      db.run(commentStatement);
    }

    console.log(`Created ${COMMENT_COUNT} comments`);
  } else {
    console.log(`${count} comments already exist`);
  }
});
