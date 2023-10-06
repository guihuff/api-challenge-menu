/*
  Warnings:

  - The primary key for the `tb_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tb_category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.

*/
-- AlterTable
ALTER TABLE `tb_category` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `tb_product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DOUBLE NOT NULL,
    `id_category` CHAR(36) NOT NULL,
    `image` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_product` ADD CONSTRAINT `tb_product_id_category_fkey` FOREIGN KEY (`id_category`) REFERENCES `tb_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
