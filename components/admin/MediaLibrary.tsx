"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, Trash2, Copy, Check, Info, Folder, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { uk } from "date-fns/locale"

interface MediaFile {
  name: string
  id: string
  publicUrl: string
  size: number
  metadata: {
    size: number
    mimetype: string
  }
  path: string
  created_at?: string
}

interface MediaLibraryProps {
  onSelectImage?: (url: string) => void
  isModal?: boolean
  viewMode?: "grid" | "list"
}

export function MediaLibrary({
  onSelectImage,
  isModal = false,
  viewMode: initialViewMode = "grid",
}: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [dateFilter, setDateFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">(initialViewMode)
  const [showFileDetails, setShowFileDetails] = useState<MediaFile | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editAltText, setEditAltText] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const itemsPerPage = 20

  useEffect(() => {
    fetchFiles()
  }, [currentPath, currentPage, searchQuery, dateFilter])

  const fetchFiles = async () => {
    try {
      setIsLoading(true)
      setErrorMessage("")

      const response = await fetch(
        `/api/media?path=${encodeURIComponent(currentPath)}&page=${currentPage}&search=${encodeURIComponent(
          searchQuery,
        )}&date=${dateFilter}`,
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch media files")
      }

      const data = await response.json()
      setFiles(data.files || [])
      setTotalPages(Math.ceil((data.total || 0) / 20))
    } catch (error) {
      console.error("Error fetching media files:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch media files")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setErrorMessage("")
    setSuccessMessage("")

    try {
      setIsUploading(true)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Створюємо FormData для завантаження файлу
        const formData = new FormData()
        formData.append("file", file)
        formData.append("path", currentPath)

        // Завантажуємо файл через API
        const response = await fetch("/api/media", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Не вдалося завантажити файл")
        }
      }

      setSuccessMessage(`Файли успішно завантажено`)

      // Оновлюємо список файлів
      fetchFiles()
    } catch (error) {
      console.error("Помилка завантаження файлу:", error)
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося завантажити файл")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteFile = async (fileName: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити файл ${fileName}?`)) {
      return
    }

    setErrorMessage("")
    setSuccessMessage("")

    try {
      setIsLoading(true)

      const response = await fetch(
        `/api/media/${encodeURIComponent(fileName)}?path=${encodeURIComponent(currentPath)}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Не вдалося видалити файл")
      }

      setSuccessMessage(`Файл ${fileName} успішно видалено`)

      // Оновлюємо список файлів
      fetchFiles()
    } catch (error) {
      console.error("Помилка видалення файлу:", error)
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося видалити файл")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return

    if (!confirm(`Ви впевнені, що хочете видалити ${selectedFiles.length} файл(ів)?`)) {
      return
    }

    setErrorMessage("")
    setSuccessMessage("")

    try {
      setIsLoading(true)

      for (const fileName of selectedFiles) {
        const response = await fetch(
          `/api/media/${encodeURIComponent(fileName)}?path=${encodeURIComponent(currentPath)}`,
          {
            method: "DELETE",
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Не вдалося видалити файл")
        }
      }

      setSuccessMessage(`${selectedFiles.length} файл(ів) успішно видалено`)
      setSelectedFiles([])
      setSelectAll(false)

      // Оновлюємо список файлів
      fetchFiles()
    } catch (error) {
      console.error("Помилка видалення файлів:", error)
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося видалити файли")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedUrl(url)
        setTimeout(() => setCopiedUrl(null), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err)
        setErrorMessage("Failed to copy URL")
      })
  }

  const handleSelectImage = (url: string) => {
    if (onSelectImage) {
      onSelectImage(url)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setErrorMessage("Введіть назву папки")
      return
    }

    setErrorMessage("")
    setSuccessMessage("")

    try {
      setIsLoading(true)

      // Створюємо порожній файл .folder для позначення папки
      const emptyFile = new File([""], ".folder", { type: "application/octet-stream" })
      const formData = new FormData()
      formData.append("file", emptyFile)

      const folderPath = currentPath ? `${currentPath}/${newFolderName}` : newFolderName

      formData.append("path", folderPath)

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Не вдалося створити папку")
      }

      setSuccessMessage(`Папку ${newFolderName} успішно створено`)
      setNewFolderName("")
      setShowNewFolderDialog(false)

      // Оновлюємо список файлів
      fetchFiles()
    } catch (error) {
      console.error("Помилка створення папки:", error)
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося створити папку")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToFolder = (folderName: string) => {
    setCurrentPath((prev) => (prev ? `${prev}/${folderName}` : folderName))
  }

  const navigateUp = () => {
    setCurrentPath((prev) => {
      const parts = prev.split("/")
      parts.pop()
      return parts.join("/")
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles((prev) => {
      if (prev.includes(fileId)) {
        return prev.filter((id) => id !== fileId)
      } else {
        return [...prev, fileId]
      }
    })
  }

  const handleSelectAllFiles = () => {
    if (selectAll) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(files.map((file) => file.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchFiles()
  }

  const handleShowFileDetails = (file: MediaFile) => {
    setShowFileDetails(file)
    setEditTitle(file.name)
    setEditAltText("")
    setEditDescription("")
    setIsEditMode(false)
  }

  const handleSaveFileDetails = async () => {
    if (!showFileDetails) return

    setErrorMessage("")
    setSuccessMessage("")

    try {
      setIsLoading(true)

      // Тут буде API запит для оновлення метаданих файлу
      // const response = await fetch(`/api/media/${encodeURIComponent(showFileDetails.id)}`, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     title: editTitle,
      //     alt_text: editAltText,
      //     description: editDescription,
      //   }),
      // })

      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.error || "Не вдалося оновити метадані файлу")
      // }

      setSuccessMessage("Метадані файлу успішно оновлено")
      setIsEditMode(false)
      setShowFileDetails(null)

      // Оновлюємо список файлів
      fetchFiles()
    } catch (error) {
      console.error("Помилка оновлення метаданих файлу:", error)
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося оновити метадані файлу")
    } finally {
      setIsLoading(false)
    }
  }

  const renderBreadcrumbs = () => {
    const parts = currentPath.split("/").filter(Boolean)

    return (
      <div className="flex items-center text-sm mb-4 overflow-x-auto">
        <button onClick={() => setCurrentPath("")} className="text-blue-500 hover:underline">
          Головна
        </button>

        {parts.map((part, index) => (
          <div key={index} className="flex items-center">
            <span className="mx-2 text-gray-500">/</span>
            <button
              onClick={() => setCurrentPath(parts.slice(0, index + 1).join("/"))}
              className="text-blue-500 hover:underline"
            >
              {part}
            </button>
          </div>
        ))}
      </div>
    )
  }

  const renderGridView = () => {
    // Розділяємо файли на папки та звичайні файли
    const folders = files
      .filter((file) => file.name.endsWith("/.folder"))
      .map((file) => {
        const folderName = file.name.replace("/.folder", "")
        return { ...file, isFolder: true, name: folderName }
      })

    const regularFiles = files.filter((file) => !file.name.endsWith("/.folder"))

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {folders.map((folder) => (
          <div key={folder.id} className="bg-white border rounded-md overflow-hidden hover:shadow-md transition-shadow">
            <div
              className="p-4 cursor-pointer flex flex-col items-center"
              onClick={() => navigateToFolder(folder.name)}
            >
              <Folder className="h-16 w-16 text-blue-500 mb-2" />
              <div className="text-center">
                <p className="font-medium text-sm truncate w-full">{folder.name}</p>
              </div>
            </div>
          </div>
        ))}

        {regularFiles.map((file) => (
          <div
            key={file.id}
            className={`bg-white border rounded-md overflow-hidden hover:shadow-md transition-shadow ${
              selectedFiles.includes(file.id) ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={file.publicUrl || "/placeholder.svg"}
                alt={file.name}
                className="w-full h-full object-cover"
                onClick={() => (isModal ? handleSelectImage(file.publicUrl) : handleShowFileDetails(file))}
              />
              {isModal && (
                <button
                  onClick={() => handleSelectImage(file.publicUrl)}
                  className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center transition-all"
                >
                  <span className="bg-primary text-white px-3 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                    Вибрати
                  </span>
                </button>
              )}
              <div className="absolute top-2 left-2">
                <Checkbox
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={() => handleSelectFile(file.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white border-gray-300"
                />
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.metadata?.size || file.size || 0)}</p>
              <div className="flex mt-2 space-x-1">
                <button
                  onClick={() => handleCopyUrl(file.publicUrl)}
                  className="text-gray-500 hover:text-blue-500 p-1"
                  title="Копіювати URL"
                >
                  {copiedUrl === file.publicUrl ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => handleShowFileDetails(file)}
                  className="text-gray-500 hover:text-blue-500 p-1"
                  title="Деталі"
                >
                  <Info size={16} />
                </button>
                <button
                  onClick={() => handleDeleteFile(file.name)}
                  className="text-gray-500 hover:text-red-500 p-1"
                  title="Видалити"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderListView = () => {
    // Розділяємо файли на папки та звичайні файли
    const folders = files
      .filter((file) => file.name.endsWith("/.folder"))
      .map((file) => {
        const folderName = file.name.replace("/.folder", "")
        return { ...file, isFolder: true, name: folderName }
      })

    const regularFiles = files.filter((file) => !file.name.endsWith("/.folder"))

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-2 text-left w-10">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAllFiles}
                  className="bg-white border-gray-300"
                />
              </th>
              <th className="p-2 text-left">Файл</th>
              <th className="p-2 text-left">Автор</th>
              <th className="p-2 text-left">Дата</th>
              <th className="p-2 text-left">Розмір</th>
              <th className="p-2 text-left">Дії</th>
            </tr>
          </thead>
          <tbody>
            {folders.map((folder) => (
              <tr key={folder.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Checkbox
                    checked={selectedFiles.includes(folder.id)}
                    onCheckedChange={() => handleSelectFile(folder.id)}
                    className="bg-white border-gray-300"
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <Folder className="h-5 w-5 text-blue-500 mr-2" />
                    <button onClick={() => navigateToFolder(folder.name)} className="text-blue-500 hover:underline">
                      {folder.name}
                    </button>
                  </div>
                </td>
                <td className="p-2">Адмін</td>
                <td className="p-2">
                  {folder.created_at ? format(new Date(folder.created_at), "d MMMM yyyy", { locale: uk }) : "-"}
                </td>
                <td className="p-2">-</td>
                <td className="p-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleDeleteFile(folder.name)}
                      className="text-gray-500 hover:text-red-500 p-1"
                      title="Видалити"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {regularFiles.map((file) => (
              <tr key={file.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={() => handleSelectFile(file.id)}
                    className="bg-white border-gray-300"
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-2 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={file.publicUrl || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button onClick={() => handleShowFileDetails(file)} className="text-blue-500 hover:underline">
                      {file.name}
                    </button>
                  </div>
                </td>
                <td className="p-2">Адмін</td>
                <td className="p-2">
                  {file.created_at ? format(new Date(file.created_at), "d MMMM yyyy", { locale: uk }) : "-"}
                </td>
                <td className="p-2">{formatFileSize(file.metadata?.size || file.size || 0)}</td>
                <td className="p-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleCopyUrl(file.publicUrl)}
                      className="text-gray-500 hover:text-blue-500 p-1"
                      title="Копіювати URL"
                    >
                      {copiedUrl === file.publicUrl ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={() => handleShowFileDetails(file)}
                      className="text-gray-500 hover:text-blue-500 p-1"
                      title="Деталі"
                    >
                      <Info size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.name)}
                      className="text-gray-500 hover:text-red-500 p-1"
                      title="Видалити"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )
    }

    if (files.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-4">У цій папці немає файлів</p>
          <Button onClick={() => document.getElementById("media-upload")?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Завантажити файл
          </Button>
        </div>
      )
    }

    return viewMode === "grid" ? renderGridView() : renderListView()
  }

  const handleBulkSelect = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(files.map((file) => file.id))
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Всі медіа-файли" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі медіа-файли</SelectItem>
                <SelectItem value="images">Зображення</SelectItem>
                <SelectItem value="videos">Відео</SelectItem>
                <SelectItem value="documents">Документи</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Всі дати" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі дати</SelectItem>
                <SelectItem value="today">Сьогодні</SelectItem>
                <SelectItem value="yesterday">Вчора</SelectItem>
                <SelectItem value="last7days">Останні 7 днів</SelectItem>
                <SelectItem value="last30days">Останні 30 днів</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkSelect}
              className="admin-button admin-button-secondary"
            >
              Вибрати все
            </Button>
          </div>

          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Пошук медіа"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 admin-form-input"
            />
          </div>
        </div>
      </div>

      {/* Решта коду залишається без змін */}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No media files found</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-5 gap-4 p-4" : "divide-y"}>
          {files.map((file) =>
            viewMode === "grid" ? (
              <div
                key={file.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                <img
                  src={file.publicUrl || "/placeholder.svg"}
                  alt={file.name}
                  className="h-full w-full object-cover"
                  onClick={() => onSelectImage?.(file.publicUrl)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleCopyUrl(file.publicUrl)}>
                      {copiedUrl === file.publicUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={file.id} className="flex items-center p-4 hover:bg-gray-50">
                <div className="h-16 w-16 flex-shrink-0">
                  <img
                    src={file.publicUrl || "/placeholder.svg"}
                    alt={file.name}
                    className="h-full w-full rounded object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-500">{new Date(file.created_at || "").toLocaleDateString()}</div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => handleCopyUrl(file.publicUrl)}>
                    {copiedUrl === file.publicUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 text-sm text-gray-500">
        Showing {files.length} of {files.length} media items
      </div>
    </div>
  )
}

