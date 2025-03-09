"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Copy, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TranslationToolsProps {
  sourceLanguage: "uk" | "fr" | "en"
  targetLanguages: ("uk" | "fr" | "en")[]
  sourceContent: string
  onTranslate: (language: "uk" | "fr" | "en", translatedText: string) => void
  disabled?: boolean
}

export function TranslationTools({
  sourceLanguage,
  targetLanguages,
  sourceContent,
  onTranslate,
  disabled = false,
}: TranslationToolsProps) {
  const { toast } = useToast()
  const [isTranslating, setIsTranslating] = useState(false)

  const languageNames = {
    uk: "української",
    fr: "французької",
    en: "англійської",
  }

  const handleAutoTranslate = async () => {
    if (!sourceContent) {
      toast({
        title: "Помилка",
        description: `Спочатку заповніть поле ${languageNames[sourceLanguage]} мовою`,
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)

    try {
      // Тут буде реальний API для перекладу
      // Наразі просто імітуємо затримку
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Імітуємо переклад (в реальному додатку тут буде виклик API перекладу)
      for (const targetLang of targetLanguages) {
        if (targetLang !== sourceLanguage) {
          // Простий "переклад" для демонстрації
          const translatedText = `[${targetLang.toUpperCase()}] ${sourceContent}`
          onTranslate(targetLang, translatedText)
        }
      }

      toast({
        title: "Успішно",
        description: "Текст автоматично перекладено",
      })
    } catch (error) {
      toast({
        title: "Помилка перекладу",
        description: "Не вдалося виконати автоматичний переклад",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleCopyToLanguage = (targetLang: "uk" | "fr" | "en") => {
    if (!sourceContent) {
      toast({
        title: "Помилка",
        description: `Спочатку заповніть поле ${languageNames[sourceLanguage]} мовою`,
        variant: "destructive",
      })
      return
    }

    onTranslate(targetLang, sourceContent)

    toast({
      title: "Скопійовано",
      description: `Текст скопійовано з ${languageNames[sourceLanguage]} на ${languageNames[targetLang]}`,
    })
  }

  return (
    <div className="space-y-2 mb-6 bg-muted/50 p-4 rounded-lg">
      <h3 className="text-sm font-medium mb-2">Інструменти перекладу</h3>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoTranslate}
          disabled={disabled || isTranslating || !sourceContent}
        >
          {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
          Автоматично перекласти з {languageNames[sourceLanguage]}
        </Button>

        {targetLanguages.map(
          (lang) =>
            lang !== sourceLanguage && (
              <Button
                key={lang}
                variant="outline"
                size="sm"
                onClick={() => handleCopyToLanguage(lang)}
                disabled={disabled || !sourceContent}
              >
                <Copy className="mr-2 h-4 w-4" />
                Копіювати в {languageNames[lang]}
              </Button>
            ),
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Автоматичний переклад може потребувати редагування для забезпечення якості
      </p>
    </div>
  )
}

