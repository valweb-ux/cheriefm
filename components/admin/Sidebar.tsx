"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Home,
  FileText,
  Image,
  FileBox,
  MessageSquare,
  Palette,
  PuzzleIcon as PuzzlePiece,
  Users,
  Settings,
  Radio,
  Calendar,
  Upload,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Додаємо ці змінні на початку компонента Sidebar після useState
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true
    }
    return pathname !== "/admin" && pathname?.startsWith(path)
  }

  return (
    <div className="admin-sidebar">
      <ul className="admin-menu">
        <li className={`admin-menu-item ${pathname === "/admin" ? "active" : ""}`}>
          <Link href="/admin" className="admin-menu-link">
            <span className="admin-menu-icon">
              <Home size={20} />
            </span>
            <span className="admin-menu-text">Головна панель</span>
          </Link>
          <ul className="admin-submenu">
            <li className={`admin-submenu-item ${pathname === "/admin" ? "active" : ""}`}>
              <Link href="/admin">Головна</Link>
            </li>
            <li className="admin-submenu-item">
              <Link href="/admin/updates">Оновлення</Link>
              <span className="admin-count">2</span>
            </li>
          </ul>
        </li>

        <li
          className={`admin-menu-item ${isActive("/admin/news") || isActive("/admin/edit") ? "active" : ""}`}
          onMouseEnter={() => {
            if (timeoutId) {
              clearTimeout(timeoutId)
              setTimeoutId(null)
            }
            setHoveredItem("news")
          }}
          onMouseLeave={() => {
            const id = setTimeout(() => {
              setHoveredItem(null)
            }, 300) // 300ms затримка перед закриттям
            setTimeoutId(id)
          }}
        >
          <Link href="/admin" className="admin-menu-link">
            <span className="admin-menu-icon">
              <FileText size={20} />
            </span>
            <span className="admin-menu-text">Новини</span>
          </Link>

          {hoveredItem === "news" && (
            <div
              style={{
                position: "fixed",
                left: "159px", // Прилягає до бічної панелі
                top: "auto", // Буде автоматично позиціонуватися відносно батьківського елемента
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={() => {
                if (timeoutId) {
                  clearTimeout(timeoutId)
                  setTimeoutId(null)
                }
              }}
              onMouseLeave={() => {
                const id = setTimeout(() => {
                  setHoveredItem(null)
                }, 300)
                setTimeoutId(id)
              }}
            >
              {/* Додаємо невидимий "міст" між меню та підменю */}
              <div
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "100%",
                  left: "-10px",
                  top: 0,
                  background: "transparent",
                }}
              />
              <ul
                style={{
                  backgroundColor: "white",
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  listStyle: "none",
                  padding: "8px 0",
                  margin: 0,
                  minWidth: "180px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <li style={{ padding: 0, margin: 0 }}>
                  <Link
                    href="/admin/news"
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#3c434a",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Всі новини
                  </Link>
                </li>
                <li style={{ padding: 0, margin: 0 }}>
                  <Link
                    href="/admin/edit/new"
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#3c434a",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Додати нову
                  </Link>
                </li>
                <li style={{ padding: 0, margin: 0 }}>
                  <Link
                    href="/admin/categories"
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#3c434a",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Категорії
                  </Link>
                </li>
                <li style={{ padding: 0, margin: 0 }}>
                  <Link
                    href="/admin/tags"
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#3c434a",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Теги
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <ul className="admin-submenu">
            <li className="admin-submenu-item">
              <Link href="/admin/news">Всі новини</Link>
            </li>
            <li className="admin-submenu-item">
              <Link href="/admin/edit/new">Додати нову</Link>
            </li>
            <li className="admin-submenu-item">
              <Link href="/admin/categories">Категорії</Link>
            </li>
            <li className="admin-submenu-item">
              <Link href="/admin/tags">Теги</Link>
            </li>
          </ul>
        </li>

        <li
          className="admin-menu-item"
          onMouseEnter={() => {
            if (timeoutId) {
              clearTimeout(timeoutId)
              setTimeoutId(null)
            }
            setHoveredItem("media")
          }}
          onMouseLeave={() => {
            const id = setTimeout(() => {
              setHoveredItem(null)
            }, 300) // 300ms затримка перед закриттям
            setTimeoutId(id)
          }}
        >
          <Link href="/admin/media" className="admin-menu-link">
            <span className="admin-menu-icon">
              <Image size={20} />
            </span>
            <span className="admin-menu-text">Медіа</span>
          </Link>

          {hoveredItem === "media" && (
            <div
              style={{
                position: "fixed",
                left: "159px", // Прилягає до бічної панелі
                top: "auto", // Буде автоматично позиціонуватися відносно батьківського елемента
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={() => {
                if (timeoutId) {
                  clearTimeout(timeoutId)
                  setTimeoutId(null)
                }
              }}
              onMouseLeave={() => {
                const id = setTimeout(() => {
                  setHoveredItem(null)
                }, 300)
                setTimeoutId(id)
              }}
            >
              {/* Додаємо невидимий "міст" між меню та підменю */}
              <div
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "100%",
                  left: "-10px",
                  top: 0,
                  background: "transparent",
                }}
              />
              <ul
                style={{
                  backgroundColor: "white",
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  listStyle: "none",
                  padding: "8px 0",
                  margin: 0,
                  minWidth: "180px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <li style={{ padding: 0, margin: 0 }}>
                  <Link
                    href="/admin/media"
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#3c434a",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Галерея
                  </Link>
                </li>
                <li style={{ padding: 0, margin: 0 }}>
                  <Link
                    href="/admin/media/upload-universal"
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      color: "#3c434a",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "background-color 0.2s",
                      fontWeight: "500",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div className="flex items-center">
                      <Upload size={14} className="mr-1.5" />
                      <span>Завантажити файл</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <ul className="admin-submenu">
            <li className="admin-submenu-item">
              <Link href="/admin/media">Галерея</Link>
            </li>
            <li className="admin-submenu-item">
              <Link href="/admin/media/upload-universal">Завантажити файл</Link>
            </li>
          </ul>
        </li>

        <li className="admin-menu-item">
          <Link href="/admin/pages" className="admin-menu-link">
            <span className="admin-menu-icon">
              <FileBox size={20} />
            </span>
            <span className="admin-menu-text">Сторінки</span>
          </Link>
        </li>

        <li className="admin-menu-item">
          <Link href="/admin/comments" className="admin-menu-link">
            <span className="admin-menu-icon">
              <MessageSquare size={20} />
            </span>
            <span className="admin-menu-text">Коментарі</span>
          </Link>
        </li>

        <li className={`admin-menu-item ${isActive("/admin/radio") ? "active" : ""}`}>
          <Link href="/admin/radio" className="admin-menu-link">
            <span className="admin-menu-icon">
              <Radio size={20} />
            </span>
            <span className="admin-menu-text">Радіоплеєр</span>
          </Link>
        </li>

        <li className="admin-menu-item">
          <Link href="/admin/appearance" className="admin-menu-link">
            <span className="admin-menu-icon">
              <Palette size={20} />
            </span>
            <span className="admin-menu-text">Зовнішній вигляд</span>
          </Link>
        </li>

        <li className="admin-menu-item">
          <Link href="/admin/plugins" className="admin-menu-link">
            <span className="admin-menu-icon">
              <PuzzlePiece size={20} />
            </span>
            <span className="admin-menu-text">Плагіни</span>
            <span className="admin-count">1</span>
          </Link>
        </li>

        <li className="admin-menu-item">
          <Link href="/admin/users" className="admin-menu-link">
            <span className="admin-menu-icon">
              <Users size={20} />
            </span>
            <span className="admin-menu-text">Користувачі</span>
          </Link>
        </li>

        <li className={`admin-menu-item ${isActive("/admin/calendar") ? "active" : ""}`}>
          <Link href="/admin/calendar" className="admin-menu-link">
            <span className="admin-menu-icon">
              <Calendar size={20} />
            </span>
            <span className="admin-menu-text">Календар</span>
          </Link>
        </li>

        <li className={`admin-menu-item ${isActive("/admin/settings") ? "active" : ""}`}>
          <Link href="/admin/settings" className="admin-menu-link">
            <span className="admin-menu-icon">
              <Settings size={20} />
            </span>
            <span className="admin-menu-text">Налаштування</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

