"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { usePathname } from "next/navigation"

export default function SiteFooter() {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  // Не відображаємо футер на сторінках адміністратора
  if (isAdminPage) {
    return null
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Chérie FM</h3>
            <p className="text-sm">
              Ваше улюблене радіо з найкращою музикою та програмами. Слухайте нас онлайн або на частоті 101.5 FM.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Навігація</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">
                  Головна
                </Link>
              </li>
              <li>
                <Link href="/radio" className="hover:underline">
                  Радіо
                </Link>
              </li>
              <li>
                <Link href="/music" className="hover:underline">
                  Музика
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:underline">
                  Новини
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:underline">
                  Програми
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Про нас</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:underline">
                  Про Chérie FM
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:underline">
                  Наша команда
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Контакти
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:underline">
                  Реклама
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:underline">
                  Вакансії
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Слідкуйте за нами</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-accent transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" className="hover:text-accent transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://twitter.com" className="hover:text-accent transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://youtube.com" className="hover:text-accent transition-colors">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Підпишіться на нашу розсилку</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="px-3 py-2 text-black rounded-l-md w-full"
                  required
                />
                <button
                  type="submit"
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-r-md hover:bg-accent/90"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-sm text-center">
          <p>© {new Date().getFullYear()} Chérie FM. Усі права захищені.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/privacy" className="hover:underline">
              Політика конфіденційності
            </Link>
            <Link href="/terms" className="hover:underline">
              Умови використання
            </Link>
            <Link href="/cookies" className="hover:underline">
              Політика щодо файлів cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

