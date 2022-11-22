-- AlterTable
ALTER TABLE "Characters" ADD COLUMN     "gameId" INTEGER;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
