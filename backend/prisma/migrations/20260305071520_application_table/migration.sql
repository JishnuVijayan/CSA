-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "formData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_referenceNumber_key" ON "Application"("referenceNumber");

-- CreateIndex
CREATE INDEX "Application_referenceNumber_idx" ON "Application"("referenceNumber");

-- CreateIndex
CREATE INDEX "Application_serviceType_idx" ON "Application"("serviceType");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");
