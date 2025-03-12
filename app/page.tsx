import Link from "next/link"
import { getNews } from "../lib/supabase"

export const revalidate = 0

// Функція для видалення HTML-тегів і обмеження довжини тексту
const stripHtmlAndLimit = (html: string, limit: number) => {
  // Видаляємо HTML-теги за допомогою регулярного виразу
  const text = html.replace(/<[^>]*>?/gm, "")
  return text.length > limit ? text.substring(0, limit) + "..." : text
}

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1
  const pageSize = 10
  const { news, total } = await getNews(page, pageSize)
  const totalPages = Math.ceil(total / pageSize)

  console.log("Отримано новини для головної сторінки:", news.length)
  news.forEach((item, index) => {
    console.log(`Новина ${index + 1}:`, item.title, "URL зображення:", item.image_url)
  })

  // Отримуємо список радіостанцій
  // const { data: stations } = await supabase.from("radio_stations").select("*").order("name")

  return (
    <div>
      {/* Радіоплеєр у верхній частині сторінки */}
      {/* <div className="bg-primary/5 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Слухайте наше радіо онлайн</h2>
        <div className="max-w-xl mx-auto">
          <RadioPlayer stations={(stations as RadioStation[]) || []} />
        </div>
      </div> */}

      <h1 className="page-title">Останні новини</h1>
      <p className="news-count">Всього новин: {total}</p>

      <div className="news-grid">
        {news.map((item) => (
          <div key={item.id} className="news-item">
            {item.image_url && (
              <div className="news-image">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
            )}
            <div className="p-4">
              <h2>{item.title}</h2>
              <p>{stripHtmlAndLimit(item.content, 150)}</p>
              <p className="news-date">{new Date(item.publish_date || item.created_at).toLocaleString()}</p>
              <Link href={`/news/${item.id}`} className="read-more">
                Читати далі
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {page > 1 && (
          <Link href={`/?page=${page - 1}`} className="pagination-link">
            Попередня
          </Link>
        )}
        <span className="pagination-info">
          Сторінка {page} з {totalPages}
        </span>
        {page < totalPages && (
          <Link href={`/?page=${page + 1}`} className="pagination-link">
            Наступна
          </Link>
        )}
      </div>
    </div>
  )
}

