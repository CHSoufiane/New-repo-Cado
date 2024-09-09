-- Verify CadO:03-modify-structure on pg

BEGIN;

-- Vérifiez que la colonne "created_at" existe et a la bonne valeur par défaut
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_user' 
          AND column_name = 'created_at' 
          AND column_default = 'now()'
    ) THEN
        RAISE EXCEPTION 'Column "created_at" does not exist or does not have the correct default value';
    END IF;
END $$;

-- Vérifiez que la colonne "updated_at" existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_user' 
          AND column_name = 'updated_at'
    ) THEN
        RAISE EXCEPTION 'Column "updated_at" does not exist';
    END IF;
END $$;

ROLLBACK;
