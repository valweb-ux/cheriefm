-- Перевіряємо структуру таблиці artists
DO $$
DECLARE
    column_exists BOOLEAN;
    slug_required BOOLEAN;
BEGIN
    -- Перевіряємо, чи існує таблиця artists
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'artists'
    ) THEN
        -- Перевіряємо, чи існує стовпець slug і чи є він NOT NULL
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'artists' AND column_name = 'slug'
        ) INTO column_exists;
        
        IF column_exists THEN
            SELECT (is_nullable = 'NO')
            FROM information_schema.columns
            WHERE table_name = 'artists' AND column_name = 'slug'
            INTO slug_required;
            
            IF slug_required THEN
                -- Якщо slug є NOT NULL, змінюємо обмеження
                ALTER TABLE artists ALTER COLUMN slug DROP NOT NULL;
            END IF;
        END IF;
        
        -- Перевіряємо, чи існує стовпець image_url
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'artists' AND column_name = 'image_url'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            ALTER TABLE artists ADD COLUMN image_url TEXT;
        END IF;
        
        -- Перевіряємо, чи існує стовпець genre
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'artists' AND column_name = 'genre'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            ALTER TABLE artists ADD COLUMN genre TEXT;
        END IF;
        
        -- Перевіряємо, чи існує стовпець bio
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'artists' AND column_name = 'bio'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            ALTER TABLE artists ADD COLUMN bio JSONB;
        END IF;
    ELSE
        -- Якщо таблиця artists не існує, створюємо її з правильною структурою
        CREATE TABLE artists (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            slug TEXT,
            image_url TEXT,
            genre TEXT,
            bio JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Видаляємо існуючі тестові дані, якщо вони є
DELETE FROM artists WHERE name IN ('Виконавець 1', 'Виконавець 2', 'Виконавець 3', 'Виконавець 4', 'Виконавець 5', 'Виконавець 6');

-- Додаємо тестові дані для артистів з правильним форматом JSON для поля bio і значенням для slug
INSERT INTO artists (name, slug, image_url, genre, bio) VALUES 
('Виконавець 1', 'vykonavets-1', '/placeholder.svg?height=300&width=300', 'Поп', '"Біографія виконавця 1"'),
('Виконавець 2', 'vykonavets-2', '/placeholder.svg?height=300&width=300', 'Рок', '"Біографія виконавця 2"'),
('Виконавець 3', 'vykonavets-3', '/placeholder.svg?height=300&width=300', 'Електронна', '"Біографія виконавця 3"'),
('Виконавець 4', 'vykonavets-4', '/placeholder.svg?height=300&width=300', 'Хіп-хоп', '"Біографія виконавця 4"'),
('Виконавець 5', 'vykonavets-5', '/placeholder.svg?height=300&width=300', 'Джаз', '"Біографія виконавця 5"'),
('Виконавець 6', 'vykonavets-6', '/placeholder.svg?height=300&width=300', 'Класична', '"Біографія виконавця 6"');

