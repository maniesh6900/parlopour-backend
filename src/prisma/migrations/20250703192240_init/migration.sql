/*
  Warnings:

  - You are about to drop the column `usename` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignto` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropIndex
DROP INDEX "Admin_usename_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "usename",
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "userId",
ADD COLUMN     "assignto" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignto_fkey" FOREIGN KEY ("assignto") REFERENCES "Employee"("usename") ON DELETE RESTRICT ON UPDATE CASCADE;
