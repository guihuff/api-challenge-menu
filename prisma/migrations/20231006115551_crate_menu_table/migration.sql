/*
  Warnings:

  - The primary key for the `tb_product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tb_product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.

*/
-- AlterTable
ALTER TABLE `tb_product` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `tb_menu` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `time` ENUM('NIGHT', 'DAY') NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_menu_to_product` (
    `id_product` CHAR(36) NOT NULL,
    `id_menu` CHAR(36) NOT NULL,

    PRIMARY KEY (`id_product`, `id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_menu_to_product` ADD CONSTRAINT `tb_menu_to_product_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `tb_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_menu_to_product` ADD CONSTRAINT `tb_menu_to_product_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `tb_menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
