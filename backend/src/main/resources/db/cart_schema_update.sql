-- backend/src/main/resources/db/cart_schema_update.sql

-- 1. Hardening Carts table
ALTER TABLE carts ADD COLUMN IF NOT EXISTS uuid UUID UNIQUE DEFAULT gen_random_uuid();
ALTER TABLE carts ADD COLUMN IF NOT EXISTS user_id BIGINT;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);
ALTER TABLE carts ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_cart_uuid ON carts(uuid);
CREATE INDEX IF NOT EXISTS idx_cart_user_active ON carts(user_id, active);

-- 2. Hardening Cart Items table
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS variant_id BIGINT;
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS price_at_add_time DECIMAL(19, 2);

CREATE INDEX IF NOT EXISTS idx_cart_items_composite ON cart_items(cart_id, product_id, variant_id);

-- 3. Hardening Orders table linkage
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cart_uuid VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_order_cart_uuid ON orders(cart_uuid);

-- Enforce Domain Integrity
CREATE UNIQUE INDEX IF NOT EXISTS uk_cart_user_active_singleton ON carts (user_id) WHERE active = TRUE;
