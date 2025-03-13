import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("Початок створення таблиці site_settings...")

    const supabaseAdmin = getSupabaseAdmin()

    // Перевіряємо, чи існує таблиця site_settings
    const { error: checkError } = await supabaseAdmin.from("site_settings").select("id").limit(1)

    if (checkError) {
      console.log("Таблиця site_settings не існує, створюємо...")

      try {
        // Спочатку спробуємо створити функцію exec_sql, якщо вона ще не існує
        await supabaseAdmin
          .rpc("exec_sql", {
            sql_query: `
            CREATE OR REPLACE FUNCTION exec_sql(sql_query text) RETURNS void AS $$
            BEGIN
              EXECUTE sql_query;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
          `,
          })
          .catch((err) => {
            console.log("Функція exec_sql вже існує або помилка створення:", err.message)
          })

        // SQL для створення таблиці site_settings
        const { error: createError } = await supabaseAdmin.rpc("exec_sql", {
          sql_query: `
            CREATE TABLE IF NOT EXISTS public.site_settings (
              id SERIAL PRIMARY KEY,
              site_title TEXT NOT NULL DEFAULT 'CherieFM',
              site_tagline TEXT NOT NULL DEFAULT 'Feel Good Music !',
              site_icon_url TEXT NOT NULL DEFAULT '/placeholder.svg',
              site_url TEXT NOT NULL DEFAULT '',
              admin_email TEXT NOT NULL DEFAULT '',
              allow_registration BOOLEAN NOT NULL DEFAULT false,
              default_role TEXT NOT NULL DEFAULT 'user',
              site_language TEXT NOT NULL DEFAULT 'uk',
              timezone TEXT NOT NULL DEFAULT 'UTC+2',
              date_format TEXT NOT NULL DEFAULT 'd MMMM yyyy',
              time_format TEXT NOT NULL DEFAULT 'HH:mm',
              week_starts_on TEXT NOT NULL DEFAULT 'monday',
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
            
            DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
            
            CREATE TRIGGER update_site_settings_updated_at
            BEFORE UPDATE ON public.site_settings
            FOR EACH ROW
            EXECUTE PROCEDURE update_modified_column();
            
            -- Налаштовуємо RLS для таблиці
            ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
            
            -- Створюємо політику для доступу до таблиці
            DROP POLICY IF EXISTS "Allow full access to site_settings" ON public.site_settings;
            
            CREATE POLICY "Allow full access to site_settings"
            ON public.site_settings
            USING (true)
            WITH CHECK (true);
            
            -- Вставляємо початковий запис, якщо таблиця порожня
            INSERT INTO public.site_settings (site_title, site_tagline, date_format, time_format)
            SELECT 'CherieFM', 'Feel Good Music !', 'd MMMM yyyy', 'HH:mm'
            WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);
          `,
        })

        if (createError) {
          console.error("Помилка при створенні таблиці site_settings:", createError)
          return NextResponse.json({ error: createError.message }, { status: 500 })
        }
      } catch (sqlError) {
        console.error("SQL помилка при створенні таблиці:", sqlError)

        // Альтернативний підхід - створення таблиці через SQL запити напряму
        try {
          // Створюємо таблицю
          await supabaseAdmin
            .from("site_settings")
            .insert({
              id: 1,
              site_title: "CherieFM",
              site_tagline: "Feel Good Music !",
              site_icon_url: "/placeholder.svg",
              site_url: "",
              admin_email: "",
              allow_registration: false,
              default_role: "user",
              site_language: "uk",
              timezone: "UTC+2",
              date_format: "d MMMM yyyy",
              time_format: "HH:mm",
              week_starts_on: "monday",
            })
            .select()

          console.log("Таблиця site_settings створена альтернативним методом")
        } catch (altError) {
          console.error("Помилка при альтернативному створенні таблиці:", altError)
          return NextResponse.json({ error: "Не вдалося створити таблицю налаштувань" }, { status: 500 })
        }
      }

      console.log("Таблиця site_settings успішно створена")
    } else {
      console.log("Таблиця site_settings вже існує")
    }

    return NextResponse.json({
      message: "Таблиця site_settings успішно налаштована",
      instructions: "Тепер ви можете зберігати налаштування сайту",
    })
  } catch (error) {
    console.error("Неочікувана помилка при налаштуванні таблиці site_settings:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Неочікувана помилка" }, { status: 500 })
  }
}

