"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor"
import { Globe, Copy, ArrowRightLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Language {
  code: string
  name: string
  flag: string
}

interface MultilingualEditorProps {
  fieldName: string
  label: string
  values: Record<string, string>
  onChange: (fieldName: string, value: Record<string, string>) => void
  type?: "input" | "textarea" | "wysiwyg"
  placeholder?: Record<string, string>
  required?: boolean
  languages: Language[]
  defaultLanguage?: string
}

export function MultilingualEditor({
  fieldName,
  label,
  values,
  onChange,
  type = "input",
  placeholder = {},
  required = false,
  languages,
  defaultLanguage = "uk",
}: MultilingualEditorProps) {
  const [activeTab, setActiveTab] = useState(defaultLanguage)
  const { toast } = useToast()

  const handleChange = (value: string, lang: string) => {
    onChange(fieldName, { ...values, [lang]: value })
  }

  const copyFromLanguage = (fromLang: string, toLang: string) => {
    if (!values[fromLang]) {
      toast({
        title: "Неможливо скопіювати",
        description: `Поле порожнє для мови-джерела (${languages.find((l) => l.code === fromLang)?.name})`,
        variant: "destructive",
      })
      return
    }

    handleChange(values[fromLang], toLang)

    toast({
      title: "Скопійовано",
      description: `Вміст скопійовано з ${languages.find((l) => l.code === fromLang)?.name} на ${languages.find((l) => l.code === toLang)?.name}`,
    })
  }

  const copyToAllLanguages = (fromLang: string) => {
    if (!values[fromLang]) {
      toast({
        title: "Неможливо скопіювати",
        description: `Поле порожнє для мови-джерела (${languages.find((l) => l.code === fromLang)?.name})`,
        variant: "destructive",
      })
      return
    }

    const newValues = { ...values }

    languages.forEach((lang) => {
      if (lang.code !== fromLang) {
        newValues[lang.code] = values[fromLang]
      }
    })

    onChange(fieldName, newValues)

    toast({
      title: "Скопійовано на всі мови",
      description: `Вміст скопійовано з ${languages.find((l) => l.code === fromLang)?.name} на всі інші мови`,
    })
  }

  // Відображення всіх полів одночасно для невеликих полів
  if (type === "input" && languages.length <= 3) {
    return (
      <div className="space-y-2">
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>

        <div className="space-y-2">
          {languages.map((lang) => (
            <div key={lang.code} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 text-center">{lang.flag}</div>
              <Input
                value={values[lang.code] || ""}
                onChange={(e) => handleChange(e.target.value, lang.code)}
                placeholder={placeholder[lang.code] || `${label} ${lang.name}`}
                required={required && lang.code === defaultLanguage}
                className="flex-1"
              />
              {lang.code !== defaultLanguage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => copyFromLanguage(defaultLanguage, lang.code)}
                  title={`Копіювати з ${languages.find((l) => l.code === defaultLanguage)?.name}`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Для більших полів використовуємо вкладки
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copyToAllLanguages(activeTab)}
            className="h-8 text-xs"
          >
            <Globe className="h-3 w-3 mr-1" />
            Копіювати на всі мови
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            {languages.map((lang) => (
              <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-1">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-1">
            {languages.map((lang) => {
              if (lang.code === activeTab) return null
              return (
                <Button
                  key={lang.code}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyFromLanguage(activeTab, lang.code)}
                  className="h-8 text-xs"
                  title={`Копіювати з ${languages.find((l) => l.code === activeTab)?.name}`}
                >
                  <ArrowRightLeft className="h-3 w-3 mr-1" />
                  {lang.flag}
                </Button>
              )
            })}
          </div>
        </div>

        {languages.map((lang) => (
          <TabsContent key={lang.code} value={lang.code}>
            {type === "input" && (
              <Input
                value={values[lang.code] || ""}
                onChange={(e) => handleChange(e.target.value, lang.code)}
                placeholder={placeholder[lang.code] || `${label} ${lang.name}`}
                required={required && lang.code === defaultLanguage}
              />
            )}

            {type === "textarea" && (
              <Textarea
                value={values[lang.code] || ""}
                onChange={(e) => handleChange(e.target.value, lang.code)}
                placeholder={placeholder[lang.code] || `${label} ${lang.name}`}
                required={required && lang.code === defaultLanguage}
                rows={5}
              />
            )}

            {type === "wysiwyg" && (
              <WysiwygEditor
                value={values[lang.code] || ""}
                onChange={(value) => handleChange(value, lang.code)}
                placeholder={placeholder[lang.code] || `${label} ${lang.name}`}
              />
            )}

            {lang.code !== defaultLanguage && (
              <div className="mt-2 text-sm text-muted-foreground">
                {!values[lang.code] && values[defaultLanguage] && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyFromLanguage(defaultLanguage, lang.code)}
                    className="h-8 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Копіювати з основної мови
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

