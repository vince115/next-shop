-- migrate_roles_to_uppercase.sql
-- One-time migration: normalize all role names to UPPERCASE.
-- Run this BEFORE restarting the application with the updated code.

-- Preview what will be changed (read-only check):
-- SELECT id, name, UPPER(name) AS name_after FROM roles;

UPDATE roles
SET name = UPPER(name)
WHERE name != UPPER(name);
