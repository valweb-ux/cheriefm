import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaLibrary } from "@/components/admin/media/media-library"
import { MediaUpload } from "@/components/admin/media/media-upload"

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Медіафайли</h1>
        <p className="text-muted-foreground">Управління зображеннями та іншими медіафайлами</p>
      </div>

      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Бібліотека</TabsTrigger>
          <TabsTrigger value="upload">Завантажити</TabsTrigger>
        </TabsList>
        <TabsContent value="library" className="space-y-4">
          <MediaLibrary />
        </TabsContent>
        <TabsContent value="upload" className="space-y-4">
          <MediaUpload />
        </TabsContent>
      </Tabs>
    </div>
  )
}

