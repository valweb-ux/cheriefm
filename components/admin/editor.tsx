"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export function Editor({ value, onChange }: EditorProps) {
  const [activeTab, setActiveTab] = useState<string>("edit")

  return (
    <div className="border rounded-md">
      <Tabs defaultValue="edit" onValueChange={setActiveTab}>
        <div className="border-b px-3">
          <TabsList className="bg-transparent">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="edit" className="p-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[300px] border-0 focus-visible:ring-0 rounded-none"
            placeholder="Write your content here..."
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4 prose max-w-none">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <p className="text-muted-foreground">No content to preview</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

