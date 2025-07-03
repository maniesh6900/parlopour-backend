/*
  Warnings:

  - You are about to drop the column `usename` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignto_fkey";

-- DropIndex
DROP INDEX "Employee_usename_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "usename",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_username_key" ON "Employee"("username");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignto_fkey" FOREIGN KEY ("assignto") REFERENCES "Employee"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
