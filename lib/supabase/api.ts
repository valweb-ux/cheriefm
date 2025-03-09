// Створюємо заглушки для функцій API
export async function getProgramById(id: string) {
  // Заглушка для функції
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
  // Заглушка для функції
  console.log(`Updating program ${id}`, data)
  return { success: true }
}

export async function createProgram(data: any) {
  // Заглушка для функції
  console.log("Creating program", data)
  return { id: Date.now().toString(), ...data }
}

export async function deleteProgram(id: string) {
  // Заглушка для функції
  console.log(`Deleting program ${id}`)
  return { success: true }
}

