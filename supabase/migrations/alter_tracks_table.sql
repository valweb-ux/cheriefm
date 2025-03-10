-- Перевіряємо структуру таблиці tracks
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Перевіряємо, чи існує таблиця tracks
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'tracks'
    ) THEN
        -- Перевіряємо, чи існує стовпець image_url
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'tracks' AND column_name = 'image_url'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            -- Перевіряємо, чи існує стовпець cover або cover_url
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'tracks' AND column_name IN ('cover', 'cover_url')
            ) INTO column_exists;
            
            IF column_exists THEN
                -- Якщо існує cover або cover_url, перейменовуємо його на image_url
                IF EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'tracks' AND column_name = 'cover'
                ) THEN
                    ALTER TABLE tracks RENAME COLUMN cover TO image_url;
                ELSIF EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'tracks' AND column_name = 'cover_url'
                ) THEN
                    ALTER TABLE tracks RENAME COLUMN cover_url TO image_url;
                END IF;
            ELSE
                -- Якщо не існує ні image_url, ні cover, ні cover_url, додаємо image_url
                ALTER TABLE tracks ADD COLUMN image_url TEXT;
            END IF;
        END IF;
        
        -- Перевіряємо, чи існує стовпець artist в таблиці tracks
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'tracks' AND column_name = 'artist'
        ) INTO column_exists;
        
        IF column_exists THEN
            -- Якщо стовпець artist існує, додаємо новий стовпець artist_name і копіюємо дані
            ALTER TABLE tracks ADD COLUMN artist_name TEXT;
            UPDATE tracks SET artist_name = artist;
            ALTER TABLE tracks ALTER COLUMN artist_name SET NOT NULL;
            ALTER TABLE tracks DROP COLUMN artist;
        ELSIF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'tracks' AND column_name = 'artist_name'
        ) THEN
            -- Якщо стовпець artist_name не існує, додаємо його
            ALTER TABLE tracks ADD COLUMN artist_name TEXT NOT NULL DEFAULT 'Невідомий виконавець';
        END IF;
    ELSE
        -- Якщо таблиця tracks не існує, створюємо її з правильною структурою
        CREATE TABLE tracks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            artist_name TEXT NOT NULL DEFAULT 'Невідомий виконавець',
            album TEXT,
            duration INTEGER NOT NULL,
            image_url TEXT,
            audio_url TEXT NOT NULL,
            plays INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Оновлюємо тестові дані, якщо таблиця вже існує
DELETE FROM tracks WHERE title IN ('Пісня 1', 'Пісня 2', 'Пісня 3', 'Пісня 4', 'Пісня 5');

-- Додаємо тестові дані для треків
INSERT INTO tracks (title, artist_name, album, duration, image_url, audio_url, plays) VALUES 
('Пісня 1', 'Виконавець 1', 'Альбом 1', 180, '/placeholder.svg?height=300&width=300', 'https://example.com/song1.mp3', 1250),
('Пісня 2', 'Виконавець 2', 'Альбом 2', 210, '/placeholder.svg?height=300&width=300', 'https://example.com/song2.mp3', 980),
('Пісня 3', 'Виконавець 3', 'Альбом 3', 240, '/placeholder.svg?height=300&width=300', 'https://example.com/song3.mp3', 1540),
('Пісня 4', 'Виконавець 4', 'Альбом 4', 195, '/placeholder.svg?height=300&width=300', 'https://example.com/song4.mp3', 760),
('Пісня 5', 'Виконавець 5', 'Альбом 5', 225, '/placeholder.svg?height=300&width=300', 'https://example.com/song5.mp3', 1120);

