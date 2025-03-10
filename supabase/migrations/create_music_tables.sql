-- Таблиця для треків
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  duration INTEGER NOT NULL,
  image_url TEXT,
  audio_url TEXT NOT NULL,
  plays INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблиця для артистів
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  genre TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблиця для плейлистів
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tracks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблиця для зв'язку плейлистів і треків
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, track_id)
);

-- Додаємо тестові дані для треків
INSERT INTO tracks (title, artist, album, duration, image_url, audio_url, plays) VALUES 
('Пісня 1', 'Виконавець 1', 'Альбом 1', 180, '/placeholder.svg?height=300&width=300', 'https://example.com/song1.mp3', 1250),
('Пісня 2', 'Виконавець 2', 'Альбом 2', 210, '/placeholder.svg?height=300&width=300', 'https://example.com/song2.mp3', 980),
('Пісня 3', 'Виконавець 3', 'Альбом 3', 240, '/placeholder.svg?height=300&width=300', 'https://example.com/song3.mp3', 1540),
('Пісня 4', 'Виконавець 4', 'Альбом 4', 195, '/placeholder.svg?height=300&width=300', 'https://example.com/song4.mp3', 760),
('Пісня 5', 'Виконавець 5', 'Альбом 5', 225, '/placeholder.svg?height=300&width=300', 'https://example.com/song5.mp3', 1120);

-- Додаємо тестові дані для артистів
INSERT INTO artists (name, image_url, genre, bio) VALUES 
('Виконавець 1', '/placeholder.svg?height=300&width=300', 'Поп', 'Біографія виконавця 1'),
('Виконавець 2', '/placeholder.svg?height=300&width=300', 'Рок', 'Біографія виконавця 2'),
('Виконавець 3', '/placeholder.svg?height=300&width=300', 'Електронна', 'Біографія виконавця 3'),
('Виконавець 4', '/placeholder.svg?height=300&width=300', 'Хіп-хоп', 'Біографія виконавця 4'),
('Виконавець 5', '/placeholder.svg?height=300&width=300', 'Джаз', 'Біографія виконавця 5'),
('Виконавець 6', '/placeholder.svg?height=300&width=300', 'Класична', 'Біографія виконавця 6');

-- Додаємо тестові дані для плейлистів
INSERT INTO playlists (title, description, image_url, tracks_count) VALUES 
('Плейлист 1', 'Опис плейлиста 1', '/placeholder.svg?height=300&width=300', 15),
('Плейлист 2', 'Опис плейлиста 2', '/placeholder.svg?height=300&width=300', 20),
('Плейлист 3', 'Опис плейлиста 3', '/placeholder.svg?height=300&width=300', 12);

-- Додаємо зв'язки між плейлистами і треками
INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES 
((SELECT id FROM playlists WHERE title = 'Плейлист 1'), (SELECT id FROM tracks WHERE title = 'Пісня 1'), 1),
((SELECT id FROM playlists WHERE title = 'Плейлист 1'), (SELECT id FROM tracks WHERE title = 'Пісня 2'), 2),
((SELECT id FROM playlists WHERE title = 'Плейлист 1'), (SELECT id FROM tracks WHERE title = 'Пісня 3'), 3),
((SELECT id FROM playlists WHERE title = 'Плейлист 2'), (SELECT id FROM tracks WHERE title = 'Пісня 2'), 1),
((SELECT id FROM playlists WHERE title = 'Плейлист 2'), (SELECT id FROM tracks WHERE title = 'Пісня 4'), 2),
((SELECT id FROM playlists WHERE title = 'Плейлист 3'), (SELECT id FROM tracks WHERE title = 'Пісня 1'), 1),
((SELECT id FROM playlists WHERE title = 'Плейлист 3'), (SELECT id FROM tracks WHERE title = 'Пісня 5'), 2);

