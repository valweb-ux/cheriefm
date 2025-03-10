-- Цей скрипт створює всі необхідні таблиці для проекту Chérie FM

-- Перевіряємо наявність розширення uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Видаляємо існуючі таблиці, якщо вони існують
DROP TABLE IF EXISTS playlist_tracks CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS artists CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS radio_shows CASCADE;
DROP TABLE IF EXISTS radio_info CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- Створюємо таблицю для ролей користувачів
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо базові ролі
INSERT INTO user_roles (name, description) VALUES 
('admin', 'Адміністратор системи з повним доступом'),
('editor', 'Редактор контенту'),
('user', 'Звичайний користувач');

-- Створюємо таблицю для користувачів
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  role_id UUID REFERENCES user_roles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестового адміністратора
INSERT INTO users (email, name, role_id) VALUES 
('admin@cheriefm.ua', 'Адміністратор', (SELECT id FROM user_roles WHERE name = 'admin'));

-- Створюємо таблицю для мов
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо базові мови
INSERT INTO languages (name, code) VALUES 
('Українська', 'uk'),
('English', 'en');

-- Створюємо таблицю для програм
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  host TEXT,
  duration INTEGER,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для програм
INSERT INTO programs (title, description, host, duration, image) VALUES 
('Ранкове шоу', 'Найкраще ранкове шоу', 'Ведучий 1', 120, '/placeholder.svg?height=300&width=300'),
('Музичний блок', 'Найкраща музика', 'Ведучий 2', 180, '/placeholder.svg?height=300&width=300');

-- Створюємо таблицю для епізодів
CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  program_id UUID REFERENCES programs(id),
  image_url TEXT,
  audio_url TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT false,
  language_id UUID REFERENCES languages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для епізодів
INSERT INTO episodes (title, description, program_id, image_url, audio_url, published, language_id) VALUES 
('Епізод 1', 'Опис епізоду 1', (SELECT id FROM programs WHERE title = 'Ранкове шоу' LIMIT 1), '/placeholder.svg?height=300&width=300', 'https://example.com/episode1.mp3', true, (SELECT id FROM languages WHERE code = 'uk' LIMIT 1)),
('Епізод 2', 'Опис епізоду 2', (SELECT id FROM programs WHERE title = 'Музичний блок' LIMIT 1), '/placeholder.svg?height=300&width=300', 'https://example.com/episode2.mp3', true, (SELECT id FROM languages WHERE code = 'uk' LIMIT 1));

-- Створюємо таблицю для сторінок
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  language_id UUID REFERENCES languages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для сторінок
INSERT INTO pages (title, slug, content, published, language_id) VALUES 
('Про нас', 'about', '<p>Chérie FM - це радіостанція, яка транслює найкращу музику та програми для своїх слухачів.</p><p>Ми працюємо для вас 24/7, щоб ви могли насолоджуватися якісним контентом.</p>', true, (SELECT id FROM languages WHERE code = 'uk' LIMIT 1)),
('Контакти', 'contacts', '<p>Зв''яжіться з нами:</p><p>Email: info@cheriefm.ua</p><p>Телефон: +380 44 123 4567</p><p>Адреса: м. Київ, вул. Радіо, 1</p>', true, (SELECT id FROM languages WHERE code = 'uk' LIMIT 1));

-- Створюємо таблицю для радіо-шоу
CREATE TABLE radio_shows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  host TEXT,
  duration INTEGER,
  image TEXT,
  schedule TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для радіо-шоу
INSERT INTO radio_shows (title, description, host, duration, image, schedule) VALUES 
('Ранкове шоу', 'Найкраще ранкове шоу', 'Ведучий 1', 120, '/placeholder.svg?height=300&width=300', 'Пн-Пт, 08:00-10:00'),
('Музичний блок', 'Найкраща музика', 'Ведучий 2', 180, '/placeholder.svg?height=300&width=300', 'Пн-Пт, 10:00-13:00');

-- Створюємо таблицю для інформації про радіо
CREATE TABLE radio_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Chérie FM',
  description TEXT,
  stream_url TEXT NOT NULL DEFAULT 'https://online.cheriefm.ua/cheriefm',
  logo TEXT,
  current_track TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для інформації про радіо
INSERT INTO radio_info (title, description, stream_url, logo, current_track) VALUES 
('Chérie FM', 'Найкраще радіо України', 'https://online.cheriefm.ua/cheriefm', '/placeholder.svg?height=300&width=300', 'Зараз грає: Пісня дня - Популярний виконавець');

-- Створюємо таблицю для новин
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для новин
INSERT INTO news (title, excerpt, content, image, category, published, published_at) VALUES 
('Новина 1', 'Короткий опис новини 1', '<p>Повний текст новини 1</p>', '/placeholder.svg?height=300&width=300', 'Музика', true, NOW()),
('Новина 2', 'Короткий опис новини 2', '<p>Повний текст новини 2</p>', '/placeholder.svg?height=300&width=300', 'Культура', true, NOW() - INTERVAL '2 days');

-- Створюємо таблицю для артистів
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT,
  image_url TEXT,
  genre TEXT,
  bio JSONB DEFAULT '{"text": ""}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для артистів
INSERT INTO artists (name, slug, image_url, genre, bio) VALUES 
('Виконавець 1', 'vykonavets-1', '/placeholder.svg?height=300&width=300', 'Поп', '{"text": "Біографія виконавця 1"}'),
('Виконавець 2', 'vykonavets-2', '/placeholder.svg?height=300&width=300', 'Рок', '{"text": "Біографія виконавця 2"}'),
('Виконавець 3', 'vykonavets-3', '/placeholder.svg?height=300&width=300', 'Електронна', '{"text": "Біографія виконавця 3"}'),
('Виконавець 4', 'vykonavets-4', '/placeholder.svg?height=300&width=300', 'Хіп-хоп', '{"text": "Біографія виконавця 4"}'),
('Виконавець 5', 'vykonavets-5', '/placeholder.svg?height=300&width=300', 'Джаз', '{"text": "Біографія виконавця 5"}'),
('Виконавець 6', 'vykonavets-6', '/placeholder.svg?height=300&width=300', 'Класична', '{"text": "Біографія виконавця 6"}');

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для треків
INSERT INTO tracks (title, artist_name, album, duration, image_url, audio_url, plays) VALUES 
('Пісня 1', 'Виконавець 1', 'Альбом 1', 180, '/placeholder.svg?height=300&width=300', 'https://example.com/song1.mp3', 1250),
('Пісня 2', 'Виконавець 2', 'Альбом 2', 210, '/placeholder.svg?height=300&width=300', 'https://example.com/song2.mp3', 980),
('Пісня 3', 'Виконавець 3', 'Альбом 3', 240, '/placeholder.svg?height=300&width=300', 'https://example.com/song3.mp3', 1540),
('Пісня 4', 'Виконавець 4', 'Альбом 4', 195, '/placeholder.svg?height=300&width=300', 'https://example.com/song4.mp3', 760),
('Пісня 5', 'Виконавець 5', 'Альбом 5', 225, '/placeholder.svg?height=300&width=300', 'https://example.com/song5.mp3', 1120);

-- Створюємо таблицю для плейлистів
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tracks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Додаємо тестові дані для плейлистів
INSERT INTO playlists (title, description, image_url, tracks_count) VALUES 
('Плейлист 1', 'Опис плейлиста 1', '/placeholder.svg?height=300&width=300', 3),
('Плейлист 2', 'Опис плейлиста 2', '/placeholder.svg?height=300&width=300', 2),
('Плейлист 3', 'Опис плейлиста 3', '/placeholder.svg?height=300&width=300', 2);

-- Створюємо таблицю для зв'язку плейлистів і треків
CREATE TABLE playlist_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, track_id)
);

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

-- Створюємо індекси для покращення продуктивності
CREATE INDEX idx_episodes_program_id ON episodes(program_id);
CREATE INDEX idx_episodes_language_id ON episodes(language_id);
CREATE INDEX idx_pages_language_id ON pages(language_id);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_tracks_artist_name ON tracks(artist_name);
CREATE INDEX idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX idx_playlist_tracks_track_id ON playlist_tracks(track_id);

