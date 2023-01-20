/*
  Warnings:

  - Added the required column `weekDay` to the `BusinessHour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BusinessHour` ADD COLUMN `weekDay` VARCHAR(191) NOT NULL;
