-- Видаляємо існуючі таблиці, якщо вони існують
DROP TABLE IF EXISTS playlist_tracks CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS artists CASCADE;

-- Створюємо таблицю для артистів
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT,
    image_url TEXT,
    genre TEXT,
    bio JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Створюємо таблицю для треків
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    album TEXT,
    duration INTEGER NOT NULL,
    image_url TEXT,
    audio_url TEXT NOT NULL,
    plays INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Створюємо таблицю для плейлистів
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    tracks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Створюємо таблицю для зв'язку плейлистів і треків
CREATE TABLE playlist_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(playlist_id, track_id)
);

-- Додаємо тестові дані для артистів
INSERT INTO artists (name, slug, image_url, genre, bio) VALUES 
('Виконавець 1', 'vykonavets-1', '/placeholder.svg?height=300&width=300', 'Поп', '{"text": "Біографія виконавця 1"}'),
('Виконавець 2', 'vykonavets-2', '/placeholder.svg?height=300&width=300', 'Рок', '{"text": "Біографія виконавця 2"}'),
('Виконавець 3', 'vykonavets-3', '/placeholder.svg?height=300&width=300', 'Електронна', '{"text": "Біографія виконавця 3"}'),
('Виконавець 4', 'vykonavets-4', '/placeholder.svg?height=300&width=300', 'Хіп-хоп', '{"text": "Біографія виконавця 4"}'),
('Виконавець 5', 'vykonavets-5', '/placeholder.svg?height=300&width=300', 'Джаз', '{"text": "Біографія виконавця 5"}'),
('Виконавець 6', 'vykonavets-6', '/placeholder.svg?height=300&width=300', 'Класична', '{"text": "Біографія виконавця 6"}');

-- Додаємо тестові дані для треків
INSERT INTO tracks (title, artist_name, album, duration, image_url, audio_url, plays) VALUES 
('Пісня 1', 'Виконавець 1', 'Альбом 1', 180, '/placeholder.svg?height=300&width=300', 'https://example.com/song1.mp3', 1250),
('Пісня 2', 'Виконавець 2', 'Альбом 2', 210, '/placeholder.svg?height=300&width=300', 'https://example.com/song2.mp3', 980),
('Пісня 3', 'Виконавець 3', 'Альбом 3', 240, '/placeholder.svg?height=300&width=300', 'https://example.com/song3.mp3', 1540),
('Пісня 4', 'Виконавець 4', 'Альбом 4', 195, '/placeholder.svg?height=300&width=300', 'https://example.com/song4.mp3', 760),
('Пісня 5', 'Виконавець 5', 'Альбом 5', 225, '/placeholder.svg?height=300&width=300', 'https://example.com/song5.mp3', 1120);

-- Додаємо тестові дані для плейлистів
INSERT INTO playlists (title, description, image_url, tracks_count) VALUES 
('Плейлист 1', 'Опис плейлиста 1', '/placeholder.svg?height=300&width=300', 3),
('Плейлист 2', 'Опис плейлиста 2', '/placeholder.svg?height=300&width=300', 2),
('Плейлист 3', 'Опис плейлиста 3', '/placeholder.svg?height=300&width=300', 2);

-- Додаємо зв'язки між плейлистами і треками
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
    
    -- Додаємо зв'язки
    INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES 
    (playlist1_id, track1_id, 1),
    (playlist1_id, track2_id, 2),
    (playlist1_id, track3_id, 3),
    (playlist2_id, track2_id, 1),
    (playlist2_id, track4_id, 2),
    (playlist3_id, track1_id, 1),
    (playlist3_id, track5_id, 2);
END
$$;

