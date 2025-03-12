"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { addNews, updateNews, getNewsById } from "@/lib/supabase"

interface NewsFormProps {
  newsId?: number
}

export function NewsForm({ newsId }: NewsFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (newsId) {
      fetchNews()
    }
  }, [newsId])

  const fetchNews = async () => {
    if (!newsId) return

    try {
      setIsLoading(true)
      const news = await getNewsById(newsId)
      if (news) {
        setTitle(news.title)
        setContent(news.content)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити новину. Спробуйте ще раз.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (newsId) {
        await updateNews(newsId, title, content)
        toast({
          title: "Успіх",
          description: "Новину успішно оновлено.",
        })
      } else {
        await addNews(title, content)
        toast({
          title: "Успіх",
          description: "Новину успішно додано.",
        })
        setTitle("")
        setContent("")
      }
      router.refresh()
    } catch (error) {
      console.error("Error saving news:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти новину. Спробуйте ще раз.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Заголовок новини"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Textarea
          placeholder="Зміст новини"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Збереження..." : newsId ? "Оновити новину" : "Додати новину"}
      </Button>
    </form>
  )
}

