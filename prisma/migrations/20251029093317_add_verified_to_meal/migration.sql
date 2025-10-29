/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `bestBefore` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bestBefore` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "bestBefore" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "expiryDate",
ADD COLUMN     "bestBefore" TIMESTAMP(3) NOT NULL;
