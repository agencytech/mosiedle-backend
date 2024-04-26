-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_role_id_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `role_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
