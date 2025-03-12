import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path") || ""
    const fileName = decodeURIComponent(params.id)
    const filePath = path ? `${path}/${fileName}` : fileName

    console.log("API: Видалення медіа-файлу:", filePath)

    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.storage.from("images").remove([filePath])

    if (error) {
      console.error("API: Помилка при видаленні медіа-файлу:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("API: Медіа-файл успішно видалено")
    return NextResponse.json({ message: "Медіа-файл успішно видалено" })
  } catch (error) {
    console.error("API: Помилка при видаленні медіа-файлу:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не вдалося видалити медіа-файл" },
      { status: 500 },
    )
  }
}

