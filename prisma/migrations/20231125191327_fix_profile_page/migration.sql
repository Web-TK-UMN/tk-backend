/*
  Warnings:

  - You are about to drop the column `profileId` on the `ProfilePage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_profilePageId_fkey`;

-- AlterTable
ALTER TABLE `ProfilePage` DROP COLUMN `profileId`;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_profilePageId_fkey` FOREIGN KEY (`profilePageId`) REFERENCES `ProfilePage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
