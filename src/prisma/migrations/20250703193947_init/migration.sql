/*
  Warnings:

  - You are about to drop the column `attendance` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "attendance";

-- DropEnum
DROP TYPE "Attendance";
