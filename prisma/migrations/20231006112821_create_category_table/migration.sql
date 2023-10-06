-- CreateTable
CREATE TABLE `tb_category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `description` TEXT NOT NULL,

    UNIQUE INDEX `tb_category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
