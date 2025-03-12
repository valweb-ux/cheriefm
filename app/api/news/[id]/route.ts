import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const { title, content, publish_date, image_url } = await request.json()

    console.log("API: Оновлення новини з наступними даними:")
    console.log("ID:", id)
    console.log("Заголовок:", title)
    console.log("Зміст:", content.substring(0, 100) + "...")
    console.log("Дата публікації:", publish_date)
    console.log("URL зображення:", image_url)

    const updateData: { title: string; content: string; publish_date?: string; image_url?: string } = {
      title,
      content,
    }

    if (publish_date) {
      updateData.publish_date = publish_date
    }

    if (image_url !== undefined) {
      updateData.image_url = image_url
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin.from("news").update(updateData).eq("id", id).select()

    if (error) {
      console.error("API: Помилка при оновленні новини:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("API: Новину успішно оновлено:", data[0])
    return NextResponse.json(data[0])
  } catch (error) {
    console.error("API: Помилка при оновленні новини:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося оновити новину" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    console.log("API: Видалення новини з ID:", id)

    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.from("news").delete().eq("id", id)

    if (error) {
      console.error("API: Помилка при видаленні новини:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("API: Новину успішно видалено")
    return NextResponse.json({ message: "Новину успішно видалено" })
  } catch (error) {
    console.error("API: Помилка при видаленні новини:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося видалити новину" },
      { status: 500 },
    )
  }
}

