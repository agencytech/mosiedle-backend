/*
  Warnings:

  - You are about to drop the column `refrest_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `refrest_token`,
    ADD COLUMN `refresh_token` VARCHAR(191) NULL;
