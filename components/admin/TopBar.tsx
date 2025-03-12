"use client"

import Link from "next/link"
import { useState } from "react"

export function TopBar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="admin-top-bar">
      <div className="admin-top-bar-left">
        <div className="admin-top-bar-item admin-logo">
          <Link href="/admin">
            <span className="admin-logo-icon">C</span>
          </Link>
        </div>
        <div className="admin-top-bar-item">
          <Link href="/">CherieFM</Link>
        </div>
        <div className="admin-top-bar-item">
          <span className="admin-count">2</span>
        </div>
        <div className="admin-top-bar-item">
          <span className="admin-count">0</span>
        </div>
        <div className="admin-top-bar-item">
          <Link href="/admin/edit/new">+ Нова</Link>
        </div>
      </div>

      <div className="admin-top-bar-right">
        <div className="admin-top-bar-item">
          <div className="admin-user-menu" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <span>Привіт, адмін</span>
            <img src="/placeholder.svg?height=32&width=32" alt="Admin" className="admin-user-avatar" />
            {userMenuOpen && (
              <div className="admin-user-dropdown">
                <div className="admin-user-info">
                  <img src="/placeholder.svg?height=64&width=64" alt="Admin" className="admin-user-avatar-large" />
                  <div>
                    <div className="admin-user-name">адмін</div>
                    <div className="admin-user-role">Адміністратор</div>
                  </div>
                </div>
                <ul className="admin-user-actions">
                  <li>
                    <Link href="/admin/profile">Редагувати профіль</Link>
                  </li>
                  <li>
                    <Link href="/">Вийти</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

