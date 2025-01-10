/*
  Warnings:

  - You are about to drop the `_CourseToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `json` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3_uri` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_orgId_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToUser" DROP CONSTRAINT "_CourseToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToUser" DROP CONSTRAINT "_CourseToUser_B_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "json" JSONB NOT NULL,
ADD COLUMN     "s3_uri" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "courses" TEXT[];

-- DropTable
DROP TABLE "_CourseToUser";
