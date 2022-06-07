/*
  Warnings:

  - Added the required column `banner` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picture` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "banner" TEXT NOT NULL,
ADD COLUMN     "picture" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "picture" TEXT NOT NULL;
