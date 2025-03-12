import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("Початок створення таблиці radio_settings...")

    const supabaseAdmin = getSupabaseAdmin()

    // Перевіряємо, чи існує таблиця radio_settings
    const { error: checkError } = await supabaseAdmin.from("radio_settings").select("id").limit(1)

    if (checkError) {
      console.log("Таблиця radio_settings не існує, створюємо...")

      // SQL для створення таблиці radio_settings
      const { error: createError } = await supabaseAdmin.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.radio_settings (
            id SERIAL PRIMARY KEY,
            stream_url TEXT NOT NULL DEFAULT '',
            station_name TEXT NOT NULL DEFAULT 'CherieFM',
            station_logo_url TEXT NOT NULL DEFAULT '/placeholder.svg',
            autoplay BOOLEAN NOT NULL DEFAULT false,
            show_player BOOLEAN NOT NULL DEFAULT true,
            show_volume_slider BOOLEAN NOT NULL DEFAULT true,
            show_album_art BOOLEAN NOT NULL DEFAULT true,
            show_station_logo BOOLEAN NOT NULL DEFAULT true,
            default_volume INTEGER NOT NULL DEFAULT 80,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
          
          -- Додаємо тригер для оновлення updated_at
          CREATE OR REPLACE FUNCTION update_modified_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = now();
            RETURN NEW;
          END;
          $$ language 'plpgsql';
          
          DROP TRIGGER IF EXISTS update_radio_settings_updated_at ON public.radio_settings;
          
          CREATE TRIGGER update_radio_settings_updated_at
          BEFORE UPDATE ON public.radio_settings
          FOR EACH ROW
          EXECUTE PROCEDURE update_modified_column();
          
          -- Налаштовуємо RLS для таблиці
          ALTER TABLE public.radio_settings ENABLE ROW LEVEL SECURITY;
          
          -- Створюємо політику для доступу до таблиці
          DROP POLICY IF EXISTS "Allow full access to radio_settings" ON public.radio_settings;
          
          CREATE POLICY "Allow full access to radio_settings"
          ON public.radio_settings
          USING (true)
          WITH CHECK (true);
          
          -- Вставляємо початковий запис, якщо таблиця порожня
          INSERT INTO public.radio_settings (stream_url, station_name, station_logo_url)
          SELECT '', 'CherieFM', '/placeholder.svg'
          WHERE NOT EXISTS (SELECT 1 FROM public.radio_settings);
        `,
      })

      if (createError) {
        console.error("Помилка при створенні таблиці radio_settings:", createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      console.log("Таблиця radio_settings успішно створена")
    } else {
      console.log("Таблиця radio_settings вже існує")
    }

    return NextResponse.json({
      message: "Таблиця radio_settings успішно налаштована",
      instructions: "Тепер ви можете зберігати налаштування радіоплеєра",
    })
  } catch (error) {
    console.error("Неочікувана помилка при налаштуванні таблиці radio_settings:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Неочікувана помилка" }, { status: 500 })
  }
}

