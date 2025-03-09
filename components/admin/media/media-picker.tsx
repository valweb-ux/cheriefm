"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Image, Music, Upload, X } from "lucide-react"

interface MediaPickerProps {
  value: string
  onChange: (value: string) => void
  type?: "image" | "audio" | "video"
}

export function MediaPicker({ value, onChange, type = "image" }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock media items for demonstration
  const mediaItems = [
    { id: "1", url: "/placeholder.svg?height=200&width=300", type: "image", name: "Placeholder 1" },
    { id: "2", url: "/placeholder.svg?height=200&width=300", type: "image", name: "Placeholder 2" },
    { id: "3", url: "https://example.com/audio.mp3", type: "audio", name: "Sample Audio" },
  ]

  const filteredItems = mediaItems.filter(
    (item) => item.type === type && item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (url: string) => {
    onChange(url)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange("")
  }

  return (
    <div>
      {value ? (
        <div className="relative border rounded-md p-2">
          {type === "image" && (
            <img
              src={value || "/placeholder.svg"}
              alt="Selected media"
              className="h-40 w-full object-cover rounded-md"
            />
          )}
          {type === "audio" && (
            <div className="flex items-center gap-2 p-2">
              <Music className="h-6 w-6" />
              <span className="text-sm truncate">{value.split("/").pop()}</span>
            </div>
          )}
          <Button variant="destructive" size="icon" className="absolute top-3 right-3 h-6 w-6" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              {type === "image" ? <Image className="mr-2 h-4 w-4" /> : <Music className="mr-2 h-4 w-4" />}
              Select {type}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Select {type}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={`Search ${type}s...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1">
                {filteredItems.length === 0 ? (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">No {type}s found</div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleSelect(item.url)}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.name}
                          className="h-24 w-full object-cover"
                        />
                      ) : (
                        <div className="h-24 flex items-center justify-center bg-muted">
                          <Music className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-2 text-xs truncate">{item.name}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

