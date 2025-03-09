import { describe, it, expect, vi, beforeEach } from "vitest"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

// Мокаємо модуль supabase/server
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

// Мокаємо cookies
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: vi.fn(),
  }),
}))

describe("Authentication", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should return null when no session exists", async () => {
    // Налаштовуємо мок для createClient
    const mockAuth = {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    }

    // @ts-ignore - ігноруємо типи для тесту
    createClient.mockReturnValue({ auth: mockAuth })

    const user = await getCurrentUser()

    expect(user).toBeNull()
    expect(mockAuth.getSession).toHaveBeenCalledTimes(1)
  })

  it("should return user data when session exists", async () => {
    // Мокуємо дані користувача
    const mockUser = {
      id: "test-user-id",
      email: "test@example.com",
      role: "admin",
    }

    // Налаштовуємо мок для createClient
    const mockAuth = {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: mockUser.id,
              email: mockUser.email,
            },
          },
        },
        error: null,
      }),
    }

    const mockFrom = vi.fn().mockReturnThis()
    const mockSelect = vi.fn().mockReturnThis()
    const mockEq = vi.fn().mockReturnThis()
    const mockSingle = vi.fn().mockResolvedValue({
      data: mockUser,
      error: null,
    })

    // @ts-ignore - ігноруємо типи для тесту
    createClient.mockReturnValue({
      auth: mockAuth,
      from: mockFrom,
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    })

    const user = await getCurrentUser()

    expect(user).toEqual(mockUser)
    expect(mockAuth.getSession).toHaveBeenCalledTimes(1)
  })

  it("should handle errors gracefully", async () => {
    // Налаштовуємо мок для createClient з помилкою
    const mockAuth = {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: new Error("Authentication error"),
      }),
    }

    // @ts-ignore - ігноруємо типи для тесту
    createClient.mockReturnValue({ auth: mockAuth })

    const user = await getCurrentUser()

    expect(user).toBeNull()
    expect(mockAuth.getSession).toHaveBeenCalledTimes(1)
  })
})

