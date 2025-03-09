"use client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MultilingualFieldProps {
  label: string
  fieldName: string
  values: {
    uk: string
    fr: string
    en: string
  }
  onChange: (field: string, value: string, lang: string) => void
  type?: "input" | "textarea"
  required?: boolean
  tooltip?: string
  placeholder?: {
    uk: string
    fr: string
    en: string
  }
  rows?: number
}

export function MultilingualField({
  label,
  fieldName,
  values,
  onChange,
  type = "input",
  required = false,
  tooltip,
  placeholder = { uk: "", fr: "", en: "" },
  rows = 3,
}: MultilingualFieldProps) {
  const renderField = (lang: "uk" | "fr" | "en", flag: string, langName: string) => {
    const isRequired = required && lang === "uk"

    return (
      <div className="language-field space-y-1">
        <div className="flex items-center">
          <span className="text-lg mr-2">{flag}</span>
          <span className="text-sm text-muted-foreground">{langName}</span>
        </div>

        {type === "input" ? (
          <Input
            value={values[lang] || ""}
            onChange={(e) => onChange(fieldName, e.target.value, lang)}
            placeholder={placeholder[lang] || `${label} ${langName}`}
            required={isRequired}
            className="w-full"
          />
        ) : (
          <Textarea
            value={values[lang] || ""}
            onChange={(e) => onChange(fieldName, e.target.value, lang)}
            placeholder={placeholder[lang] || `${label} ${langName}`}
            required={isRequired}
            rows={rows}
            className="w-full"
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center">
        <Label className="text-base">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="ml-1.5 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {renderField("uk", "🇺🇦", "українською")}
        {renderField("fr", "🇫🇷", "французькою")}
        {renderField("en", "🇬🇧", "англійською")}
      </div>

      {required && <p className="text-xs text-muted-foreground">* Поле обов'язкове для заповнення українською мовою</p>}
    </div>
  )
}

