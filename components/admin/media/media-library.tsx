"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Folder,
  Image,
  File,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getMediaFiles, getMediaFolders, createMediaFolder, deleteMediaFolder } from "@/lib/supabase/media-api"
import type { MediaFileWithUrl, MediaFolder } from "@/lib/supabase/schema"

export function MediaLibrary() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [files, setFiles] = useState<MediaFileWithUrl[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState<string | undefined>(searchParams.get("folder") || undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  // Завантаження даних
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        // Завантажуємо папки
        const foldersData = await getMediaFolders(currentFolder)
        setFolders(foldersData)

        // Завантажуємо файли
        const { data: filesData, count } = await getMediaFiles(currentFolder, searchQuery, currentPage, 20)

        setFiles(filesData)
        setTotalPages(Math.ceil(count / 20))
      } catch (error) {
        console.error("Error fetching media:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити медіафайли",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentFolder, currentPage, searchQuery, toast])

  // Обробка пошуку
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  // Створення нової папки
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Помилка",
        description: "Назва папки не може бути порожньою",
        variant: "destructive",
      })
      return
    }

    setIsCreatingFolder(true)

    try {
      await createMediaFolder(newFolderName, currentFolder)

      toast({
        title: "Успішно",
        description: "Папку створено",
      })

      // Оновлюємо список папок
      const foldersData = await getMediaFolders(currentFolder)
      setFolders(foldersData)

      setNewFolderName("")
      setIsCreateFolderOpen(false)
    } catch (error) {
      console.error("Error creating folder:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося створити папку",
        variant: "destructive",
      })
    } finally {
      setIsCreatingFolder(false)
    }
  }

  // Видалення папки
  const handleDeleteFolder = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю папку?")) {
      return
    }

    try {
      await deleteMediaFolder(id)

      toast({
        title: "Успішно",
        description: "Папку видалено",
      })

      // Оновлюємо список папок
      const foldersData = await getMediaFolders(currentFolder)
      setFolders(foldersData)
    } catch (error) {
      console.error("Error deleting folder:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося видалити папку",
        variant: "destructive",
      })
    }
  }

  // Перехід до папки
  const navigateToFolder = (folderId?: string) => {
    setCurrentFolder(folderId)
    setCurrentPage(1)
    setSearchQuery("")

    // Оновлюємо URL
    const params = new URLSearchParams()
    if (folderId) {
      params.set("folder", folderId)
    }

    router.push(`/admin/media${params.toString() ? `?${params.toString()}` : ""}`)
  }

  // Перехід до деталей файлу
  const navigateToFileDetails = (fileId: string) => {
    router.push(`/admin/media/${fileId}`)
  }

  // Отримання іконки для файлу
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-6 w-6" />
    }

    return <File className="h-6 w-6" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex items-center flex-1 mr-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Пошук файлів..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="ml-2">
            Пошук
          </Button>
        </form>

        <Button onClick={() => setIsCreateFolderOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Нова папка
        </Button>
      </div>

      {/* Навігація по папках */}
      {currentFolder && (
        <Button variant="outline" onClick={() => navigateToFolder(undefined)} className="mb-2">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Назад до кореневої папки
        </Button>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Папки */}
          {folders.map((folder) => (
            <Card key={folder.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative group">
                  <div
                    className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => navigateToFolder(folder.id)}
                  >
                    <Folder className="h-16 w-16 text-primary mb-2" />
                    <p className="text-sm font-medium text-center truncate w-full">{folder.name}</p>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteFolder(folder.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Видалити
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Файли */}
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative group">
                  <div className="cursor-pointer" onClick={() => navigateToFileDetails(file.id)}>
                    {file.file_type.startsWith("image/") ? (
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={file.thumbnail_url || file.url}
                          alt={file.alt_text || file.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square flex items-center justify-center bg-muted">
                        {getFileIcon(file.file_type)}
                      </div>
                    )}

                    <div className="p-2">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigateToFileDetails(file.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Редагувати
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {folders.length === 0 && files.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">{searchQuery ? "Файлів не знайдено" : "Ця папка порожня"}</p>
            </div>
          )}
        </div>
      )}

      {/* Пагінація */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Сторінка {currentPage} з {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Діалог створення папки */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити нову папку</DialogTitle>
            <DialogDescription>Введіть назву для нової папки</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Назва папки</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Нова папка"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)} disabled={isCreatingFolder}>
              Скасувати
            </Button>
            <Button onClick={handleCreateFolder} disabled={isCreatingFolder}>
              {isCreatingFolder ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Створення...
                </>
              ) : (
                "Створити"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

