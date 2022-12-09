CREATE TABLE "Blog" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL
);

CREATE TABLE "User" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL
);

CREATE TABLE "Post" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "blog" INTEGER NOT NULL REFERENCES "Blog" ("id") ON DELETE CASCADE,
  "author" INTEGER NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE INDEX "idx_post__author" ON "Post" ("author");

CREATE INDEX "idx_post__blog" ON "Post" ("blog");

CREATE TABLE "Comment" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "body" TEXT NOT NULL,
  "post" INTEGER NOT NULL REFERENCES "Post" ("id") ON DELETE CASCADE,
  "parent" INTEGER REFERENCES "Comment" ("id") ON DELETE CASCADE,
  "user" INTEGER NOT NULL REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE INDEX "idx_comment__parent" ON "Comment" ("parent");

CREATE INDEX "idx_comment__post" ON "Comment" ("post");

CREATE INDEX "idx_comment__user" ON "Comment" ("user");