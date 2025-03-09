import { describe, it, expect, vi, beforeEach } from "vitest"
import { createClient } from "@/lib/supabase/server"
import { getNewsById } from "@/lib/services/news-service"

// Мокаємо модуль supabase/server
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

// Мокаємо next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("News Service", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe("getNewsById", () => {
    it("should fetch news by ID with translations", async () => {
      // Мокуємо дані новини
      const mockNewsData = {
        id: "test-news-id",
        title: "Test News",
        content: "Test content",
        slug: "test-news",
        created_at: "2023-01-01T00:00:00Z",
      }

      // Мокуємо переклади
      const mockTranslationsData = [
        {
          id: "trans-1",
          news_id: "test-news-id",
          language: "uk",
          title: "Тестова новина",
          content: "Тестовий вміст",
          excerpt: "Тестовий уривок",
          slug: "testova-novyna",
        },
        {
          id: "trans-2",
          news_id: "test-news-id",
          language: "en",
          title: "Test News",
          content: "Test content",
          excerpt: "Test excerpt",
          slug: "test-news",
        },
        {
          id: "trans-3",
          news_id: "test-news-id",
          language: "fr",
          title: "Actualité de test",
          content: "Contenu de test",
          excerpt: "Extrait de test",
          slug: "actualite-de-test",
        },
      ]

      // Мокуємо теги
      const mockTagsData = [
        { tags: { id: "tag-1", name: "Tag 1", slug: "tag-1" } },
        { tags: { id: "tag-2", name: "Tag 2", slug: "tag-2" } },
      ]

      // Налаштовуємо моки для Supabase
      const mockFrom = vi.fn().mockReturnThis()
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: mockNewsData,
        error: null,
      })

      // Мок для запиту перекладів
      const mockTranslationsSelect = vi.fn().mockReturnThis()
      const mockTranslationsEq = vi.fn().mockReturnThis()
      const mockTranslationsResult = vi.fn().mockResolvedValue({
        data: mockTranslationsData,
        error: null,
      })

      // Мок для запиту тегів
      const mockTagsSelect = vi.fn().mockReturnThis()
      const mockTagsEq = vi.fn().mockReturnThis()
      const mockTagsResult = vi.fn().mockResolvedValue({
        data: mockTagsData,
        error: null,
      })

      // @ts-ignore - ігноруємо типи для тесту
      createClient.mockReturnValue({
        from: mockFrom,
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      })

      // Налаштовуємо різні відповіді для різних викликів
      mockFrom.mockImplementation((table) => {
        if (table === "news") {
          return {
            select: mockSelect,
            eq: mockEq,
            single: mockSingle,
          }
        } else if (table === "news_translations") {
          return {
            select: mockTranslationsSelect,
            eq: mockTranslationsEq,
            then: mockTranslationsResult,
          }
        } else if (table === "news_tags") {
          return {
            select: mockTagsSelect,
            eq: mockTagsEq,
            then: mockTagsResult,
          }
        }
      })

      const result = await getNewsById("test-news-id")

      expect(result).toEqual({
        ...mockNewsData,
        translations: {
          uk: {
            title: "Тестова новина",
            content: "Тестовий вміст",
            excerpt: "Тестовий уривок",
            slug: "testova-novyna",
          },
          en: {
            title: "Test News",
            content: "Test content",
            excerpt: "Test excerpt",
            slug: "test-news",
          },
          fr: {
            title: "Actualité de test",
            content: "Contenu de test",
            excerpt: "Extrait de test",
            slug: "actualite-de-test",
          },
        },
        tags: [
          { id: "tag-1", name: "Tag 1", slug: "tag-1" },
          { id: "tag-2", name: "Tag 2", slug: "tag-2" },
        ],
      })
    })
  })
})

