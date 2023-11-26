/*
  Warnings:

  - Added the required column `order` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ProfilePage_profileId_fkey` ON `ProfilePage`;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `order` INTEGER NOT NULL;
