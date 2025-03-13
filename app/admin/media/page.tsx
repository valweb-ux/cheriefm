"use client"
import Link from "next/link"
import { MediaLibrary } from "@/components/admin/MediaLibrary"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function MediaPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <Button asChild>
          <Link href="/admin/media/upload-universal">
            <Upload className="mr-2 h-4 w-4" />
            Add New Media File
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <MediaLibrary />
      </div>
    </div>
  )
}

