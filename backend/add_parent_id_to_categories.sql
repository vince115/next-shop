-- add_parent_id_to_categories.sql

ALTER TABLE categories
ADD COLUMN IF NOT EXISTS parent_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_categories_parent'
    ) THEN
        ALTER TABLE categories
        ADD CONSTRAINT fk_categories_parent
        FOREIGN KEY (parent_id) REFERENCES categories (id)
        ON DELETE RESTRICT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_categories_parent_id
ON categories(parent_id);