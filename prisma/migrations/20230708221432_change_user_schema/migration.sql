-- DropIndex
DROP INDEX "users_expo_push_token_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "device_info" JSONB;
