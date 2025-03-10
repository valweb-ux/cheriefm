import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Chérie FM</h3>
            <p className="text-muted-foreground">Найкраще радіо України з найкращою музикою та програмами.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Навігація</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Головна
                </Link>
              </li>
              <li>
                <Link href="/radio" className="text-muted-foreground hover:text-foreground">
                  Радіо
                </Link>
              </li>
              <li>
                <Link href="/episodes" className="text-muted-foreground hover:text-foreground">
                  Епізоди
                </Link>
              </li>
              <li>
                <Link href="/music" className="text-muted-foreground hover:text-foreground">
                  Музика
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground">
                  Новини
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Контакти</h3>
            <address className="not-italic text-muted-foreground">
              <p>м. Київ, вул. Радіо, 1</p>
              <p>Телефон: +380 44 123 4567</p>
              <p>Email: info@cheriefm.ua</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Chérie FM. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter

