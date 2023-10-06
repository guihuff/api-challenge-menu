-- CreateTable
CREATE TABLE `tb_category` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `description` TEXT NOT NULL,

    UNIQUE INDEX `tb_category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_product` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DOUBLE NOT NULL,
    `id_category` CHAR(36) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `tb_product` ADD CONSTRAINT `tb_product_id_category_fkey` FOREIGN KEY (`id_category`) REFERENCES `tb_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_menu_to_product` ADD CONSTRAINT `tb_menu_to_product_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `tb_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_menu_to_product` ADD CONSTRAINT `tb_menu_to_product_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `tb_menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
