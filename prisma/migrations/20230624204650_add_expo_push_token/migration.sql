/*
  Warnings:

  - A unique constraint covering the columns `[expo_push_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "expo_push_token" TEXT;

-- DropEnum
DROP TYPE "VerificationType";

-- CreateIndex
CREATE UNIQUE INDEX "users_expo_push_token_key" ON "users"("expo_push_token");
