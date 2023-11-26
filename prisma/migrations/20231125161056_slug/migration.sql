/*
  Warnings:

  - You are about to drop the column `slug` on the `DynamicPage` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `ProfilePage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picUrl` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_dynamicId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_linkId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `ProfilePage` DROP FOREIGN KEY `ProfilePage_profileId_fkey`;

-- DropIndex
DROP INDEX `DynamicPage_slug_key` ON `DynamicPage`;

-- DropIndex
DROP INDEX `Link_slug_key` ON `Link`;

-- DropIndex
DROP INDEX `ProfilePage_slug_key` ON `ProfilePage`;

-- AlterTable
ALTER TABLE `DynamicPage` DROP COLUMN `slug`;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Link` DROP COLUMN `slug`;

-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `picUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `profilePageId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProfilePage` DROP COLUMN `slug`;

-- CreateIndex
CREATE UNIQUE INDEX `Item_slug_key` ON `Item`(`slug`);

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_dynamicId_fkey` FOREIGN KEY (`dynamicId`) REFERENCES `DynamicPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `ProfilePage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_profilePageId_fkey` FOREIGN KEY (`profilePageId`) REFERENCES `ProfilePage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
