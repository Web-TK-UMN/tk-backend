/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `DynamicPage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ProfilePage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `DynamicPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ProfilePage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `DynamicPage` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Link` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProfilePage` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_slug_key` ON `Category`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `DynamicPage_slug_key` ON `DynamicPage`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Link_slug_key` ON `Link`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `ProfilePage_slug_key` ON `ProfilePage`(`slug`);
