/*
  Warnings:

  - You are about to drop the column `imageBytes` on the `tb_product` table. All the data in the column will be lost.
  - Added the required column `imageURL` to the `tb_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tb_product` DROP COLUMN `imageBytes`,
    ADD COLUMN `imageURL` VARCHAR(191) NOT NULL;
