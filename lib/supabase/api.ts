export async function getProgramById(id: string) {
  return {
    id,
    title: "Програма",
    description: "Опис програми",
    host: "Ведучий",
    duration: 60,
    image: "/placeholder.svg?height=300&width=300",
  }
}

export async function updateProgram(id: string, data: any) {
  return { success: true }
}

export async function createProgram(data: any) {
  return { id: Date.now().toString(), ...data }
}

export async function deleteProgram(id: string) {
  return { success: true }
}

export async function getCategories() {
  return [
    { id: "1", name: "Новини" },
    { id: "2", name: "Музика" },
    { id: "3", name: "Культура" },
  ]
}

export async function getNewsById(id: string) {
  return {
    id,
    title: "Новина",
    content: "Зміст новини",
    image: "/placeholder.svg?height=300&width=300",
    categoryId: "1",
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function updateNews(id: string, data: any) {
  return { success: true }
}

export async function createNews(data: any) {
  return { id: Date.now().toString(), ...data }
}

export async function deleteNews(id: string) {
  return { success: true }
}

export async function getNews() {
  return [
    {
      id: "1",
      title: "Новина 1",
      content: "Зміст новини 1",
      image: "/placeholder.svg?height=300&width=300",
      categoryId: "1",
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Новина 2",
      content: "Зміст новини 2",
      image: "/placeholder.svg?height=300&width=300",
      categoryId: "2",
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

export async function getDashboardStats() {
  return {
    newsCount: 10,
    programsCount: 5,
    tracksCount: 100,
    usersCount: 500,
  }
}

export async function getRecentContent() {
  return [
    {
      id: "1",
      title: "Новина 1",
      type: "news",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Програма 1",
      type: "program",
      createdAt: new Date().toISOString(),
    },
  ]
}

