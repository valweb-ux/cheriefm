"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LanguageTabsProps {
  languages: any[]
  activeLanguage: string
  setActiveLanguage: (languageId: string) => void
}

export function LanguageTabs({ languages, activeLanguage, setActiveLanguage }: LanguageTabsProps) {
  return (
    <div className="mb-6">
      <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
        <TabsList className="w-full">
          {languages.map((language) => (
            <TabsTrigger key={language.id} value={language.id} className="flex-1">
              {language.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

