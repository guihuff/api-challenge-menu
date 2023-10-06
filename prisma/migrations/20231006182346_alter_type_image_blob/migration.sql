/*
  Warnings:

  - You are about to drop the column `imageBlob` on the `tb_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tb_product` DROP COLUMN `imageBlob`,
    ADD COLUMN `imageBytes` BLOB NULL;
