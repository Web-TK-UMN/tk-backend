-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_dynamicId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_linkId_fkey`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_profileId_fkey`;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_dynamicId_fkey` FOREIGN KEY (`dynamicId`) REFERENCES `DynamicPage`(`id`) ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_linkId_fkey` FOREIGN KEY (`linkId`) REFERENCES `Link`(`id`) ON DELETE CASCADE ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `ProfilePage`(`id`) ON DELETE CASCADE ON UPDATE SET NULL;
