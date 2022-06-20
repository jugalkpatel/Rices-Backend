/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CommentVote` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Community` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "CommentVote" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Community" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "updatedAt";
