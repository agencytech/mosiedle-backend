-- DropForeignKey
ALTER TABLE `Announcement` DROP FOREIGN KEY `Announcement_author_id_fkey`;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
