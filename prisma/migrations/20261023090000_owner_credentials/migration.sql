CREATE TABLE "AdminCredential" (
    "id" TEXT NOT NULL DEFAULT 'owner',
    "passwordHash" TEXT NOT NULL,
    "sessionVersion" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminCredential_pkey" PRIMARY KEY ("id")
);
