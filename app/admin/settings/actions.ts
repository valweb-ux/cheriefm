// Створюємо заглушки для функцій налаштувань
export async function updateThemeSettingsAction(formData: FormData) {
  // Заглушка для функції
  const data = Object.fromEntries(formData)
  console.log("Updating theme settings", data)
  return { success: true }
}

