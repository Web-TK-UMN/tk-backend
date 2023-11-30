/*
  Warnings:

  - You are about to drop the column `title` on the `DynamicPage` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ProfilePage` table. All the data in the column will be lost.
  - Added the required column `title` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DynamicPage` DROP COLUMN `title`;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Link` DROP COLUMN `title`;

-- AlterTable
ALTER TABLE `ProfilePage` DROP COLUMN `title`;
