/*
  Warnings:

  - Added the required column `language` to the `patch_notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patch_notes" ADD COLUMN     "language" TEXT NOT NULL;
