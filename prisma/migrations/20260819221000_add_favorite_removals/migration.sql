-- CreateTable
CREATE TABLE `FavoriteRemoval` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `establishmentId` VARCHAR(191) NOT NULL,
    `favoriteCreatedAt` DATETIME(3) NULL,
    `removedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FavoriteRemoval_userId_removedAt_idx`(`userId`, `removedAt`),
    INDEX `FavoriteRemoval_establishmentId_idx`(`establishmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FavoriteRemoval` ADD CONSTRAINT `FavoriteRemoval_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteRemoval` ADD CONSTRAINT `FavoriteRemoval_establishmentId_fkey` FOREIGN KEY (`establishmentId`) REFERENCES `Establishment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
