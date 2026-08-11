/*
  Warnings:

  - Added the required column `description` to the `deliveries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deliveries" ADD COLUMN     "description" TEXT NOT NULL;
