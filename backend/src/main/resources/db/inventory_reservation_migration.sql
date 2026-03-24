-- backend/src/main/resources/db/inventory_reservation_migration.sql

-- 1. Create Reservation table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    order_id VARCHAR(255),
    expired_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reservation_product_id ON reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_reservation_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservation_expired_at ON reservations(expired_at);

-- 2. Refactor Inventories table
-- Remove legacy column or stop using it (keeping column but logic is removed)
-- If we want to strictly remove it:
-- ALTER TABLE inventories DROP COLUMN IF EXISTS reserved_stock;

-- Ensure physical stock index exists
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventories(product_id);
