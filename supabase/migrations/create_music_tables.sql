-- Перевіряємо наявність стовпця image_url в таблиці tracks перед вставкою даних
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Перевіряємо, чи існує таблиця tracks
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'tracks'
    ) THEN
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
    ELSE
        -- Перевіряємо, чи існує стовпець image_url
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'tracks' AND column_name = 'image_url'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            -- Якщо стовпець image_url не існує, додаємо його
            ALTER TABLE tracks ADD COLUMN image_url TEXT;
        END IF;
        
        -- Перевіряємо, чи існує стовпець artist_name
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'tracks' AND column_name = 'artist_name'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            -- Якщо стовпець artist_name не існує, додаємо його
            ALTER TABLE tracks ADD COLUMN artist_name TEXT NOT NULL DEFAULT 'Невідомий виконавець';
        END IF;
    END IF;
END
$$;

-- Таблиця для артистів (якщо не існує)
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'artists'
    ) THEN
        CREATE TABLE artists (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            slug TEXT,
            image_url TEXT,
            genre TEXT,
            bio JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Перевіряємо, чи існує стовпець slug і чи є він NOT NULL
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'artists' AND column_name = 'slug'
        ) INTO column_exists;
        
        IF column_exists THEN
            -- Перевіряємо, чи є slug NOT NULL
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'artists' AND column_name = 'slug' AND is_nullable = 'NO'
            ) THEN
                -- Якщо slug є NOT NULL, змінюємо обмеження
                ALTER TABLE artists ALTER COLUMN slug DROP NOT NULL;
            END IF;
        ELSE
            -- Якщо стовпець slug не існує, додаємо його
            ALTER TABLE artists ADD COLUMN slug TEXT;
        END IF;
    END IF;
END
$$;

-- Таблиця для плейлистів (якщо не існує)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'playlists'
    ) THEN
        CREATE TABLE playlists (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            tracks_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Таблиця для зв'язку плейлистів і треків (якщо не існує)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'playlist_tracks'
    ) THEN
        CREATE TABLE playlist_tracks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
            track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
            position INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(playlist_id, track_id)
        );
    END IF;
END
$$;

-- Додаємо тестові дані для треків, якщо таблиця порожня
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM tracks LIMIT 1) THEN
        INSERT INTO tracks (title, artist_name, album, duration, image_url, audio_url, plays) VALUES 
        ('Пісня 1', 'Виконавець 1', 'Альбом 1', 180, '/placeholder.svg?height=300&width=300', 'https://example.com/song1.mp3', 1250),
        ('Пісня 2', 'Виконавець 2', 'Альбом 2', 210, '/placeholder.svg?height=300&width=300', 'https://example.com/song2.mp3', 980),
        ('Пісня 3', 'Виконавець 3', 'Альбом 3', 240, '/placeholder.svg?height=300&width=300', 'https://example.com/song3.mp3', 1540),
        ('Пісня 4', 'Виконавець 4', 'Альбом 4', 195, '/placeholder.svg?height=300&width=300', 'https://example.com/song4.mp3', 760),
        ('Пісня 5', 'Виконавець 5', 'Альбом 5', 225, '/placeholder.svg?height=300&width=300', 'https://example.com/song5.mp3', 1120);
    END IF;
END
$$;

-- Додаємо тестові дані для артистів, якщо таблиця порожня
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM artists LIMIT 1) THEN
        INSERT INTO artists (name, slug, image_url, genre, bio) VALUES 
        ('Виконавець 1', 'vykonavets-1', '/placeholder.svg?height=300&width=300', 'Поп', '"Біографія виконавця 1"'),
        ('Виконавець 2', 'vykonavets-2', '/placeholder.svg?height=300&width=300', 'Рок', '"Біографія виконавця 2"'),
        ('Виконавець 3', 'vykonavets-3', '/placeholder.svg?height=300&width=300', 'Електронна', '"Біографія виконавця 3"'),
        ('Виконавець 4', 'vykonavets-4', '/placeholder.svg?height=300&width=300', 'Хіп-хоп', '"Біографія виконавця 4"'),
        ('Виконавець 5', 'vykonavets-5', '/placeholder.svg?height=300&width=300', 'Джаз', '"Біографія виконавця 5"'),
        ('Виконавець 6', 'vykonavets-6', '/placeholder.svg?height=300&width=300', 'Класична', '"Біографія виконавця 6"');
    END IF;
END
$$;

-- Додаємо тестові дані для плейлистів, якщо таблиця порожня
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM playlists LIMIT 1) THEN
        INSERT INTO playlists (title, description, image_url, tracks_count) VALUES 
        ('Плейлист 1', 'Опис плейлиста 1', '/placeholder.svg?height=300&width=300', 15),
        ('Плейлист 2', 'Опис плейлиста 2', '/placeholder.svg?height=300&width=300', 20),
        ('Плейлист 3', 'Опис плейлиста 3', '/placeholder.svg?height=300&width=300', 12);
    END IF;
END
$$;

-- Додаємо зв'язки між плейлистами і треками, якщо таблиця порожня
DO $$
DECLARE
    playlist1_id UUID;
    playlist2_id UUID;
    playlist3_id UUID;
    track1_id UUID;
    track2_id UUID;
    track3_id UUID;
    track4_id UUID;
    track5_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM playlist_tracks LIMIT 1) THEN
        -- Отримуємо ID плейлистів
        SELECT id INTO playlist1_id FROM playlists WHERE title = 'Плейлист 1' LIMIT 1;
        SELECT id INTO playlist2_id FROM playlists WHERE title = 'Плейлист 2' LIMIT 1;
        SELECT id INTO playlist3_id FROM playlists WHERE title = 'Плейлист 3' LIMIT 1;
        
        -- Отримуємо ID треків
        SELECT id INTO track1_id FROM tracks WHERE title = 'Пісня 1' LIMIT 1;
        SELECT id INTO track2_id FROM tracks WHERE title = 'Пісня 2' LIMIT 1;
        SELECT id INTO track3_id FROM tracks WHERE title = 'Пісня 3' LIMIT 1;
        SELECT id INTO track4_id FROM tracks WHERE title = 'Пісня 4' LIMIT 1;
        SELECT id INTO track5_id FROM tracks WHERE title = 'Пісня 5' LIMIT 1;
        
        -- Додаємо зв'язки, якщо ID не NULL
        IF playlist1_id IS NOT NULL AND track1_id IS NOT NULL THEN
            INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (playlist1_id, track1_id, 1);
        END IF;
        
        IF playlist1_id IS NOT NULL AND track2_id IS NOT NULL THEN
            INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (playlist1_id, track2_id, 2);
        END IF;
        
        IF playlist1_id IS NOT NULL AND track3_id IS NOT NULL THEN
            INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (playlist1_id, track3_id, 3);
        END IF;
        
        IF playlist2_id IS NOT NULL AND track2_id IS NOT NULL THEN
            INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (playlist2_id, track2_id, 1);
        END IF;
        
        IF playlist2_id IS NOT NULL AND track4_id IS NOT NULL THEN
            INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (playlist2_id, track4_id, 2);
        END IF;
        
        IF playlist3_id IS NOT NULL AND track1_id IS NOT NULL THEN
            INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (playlist3_id, track1_id, 1);
        END IF;
        
        IF playlist3_id IS NOT NULL AND track5_id IS NOT NULL THEN
            INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (playlist3_id, track5_id, 2);
        END IF;
    END IF;
END
$$;

