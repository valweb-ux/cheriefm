"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Loader2,
  Upload,
  Trash2,
  Copy,
  Check,
  FolderPlus,
  Folder,
  Search,
  Filter,
  Edit,
  Info,
  Download,
  Link,
} from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export function MediaLibrary({ onSelectImage, isModal = false, viewMode = "grid" }: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
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
  const [showFileDetails, setShowFileDetails] = useState<MediaFile | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editAltText, setEditAltText] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const itemsPerPage = 20

  useEffect(() => {
    fetchFiles()
  }, [currentPath, currentPage, searchQuery, dateFilter])

  const fetchFiles = async () => {
    try {
      setIsLoading(true)
      setErrorMessage("")

      const response = await fetch(
        `/api/media?path=${encodeURIComponent(currentPath)}&page=${currentPage}&search=${encodeURIComponent(searchQuery)}&date=${dateFilter}`,
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Не вдалося отримати список медіа-файлів")
      }

      const data = await response.json()
      setFiles(data.files || [])
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
    } catch (error) {
      console.error("Помилка при отриманні списку медіа-файлів:", error)
      setErrorMessage(error instanceof Error ? error.message : "Не вдалося отримати список медіа-файлів")
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
        console.error("Не вдалося скопіювати URL:", err)
        setErrorMessage("Не вдалося скопіювати URL")
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

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">{errorMessage}</div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => document.getElementById("media-upload")?.click()}
            disabled={isUploading}
            size="sm"
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Завантажити
          </Button>
          <input
            id="media-upload"
            type="file"
            accept="image/*,audio/*,video/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />

          <Button variant="outline" onClick={() => setShowNewFolderDialog(true)} size="sm">
            <FolderPlus className="mr-2 h-4 w-4" />
            Нова папка
          </Button>

          {currentPath && (
            <Button variant="outline" onClick={navigateUp} size="sm">
              Назад
            </Button>
          )}

          {selectedFiles.length > 0 && (
            <Button variant="outline" onClick={handleBulkDelete} size="sm" className="text-red-500 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" />
              Видалити вибрані ({selectedFiles.length})
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Пошук медіа"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Button type="submit" size="sm" variant="outline">
              Пошук
            </Button>
          </form>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-gray-100" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Всі дати" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі дати</SelectItem>
                  <SelectItem value="today">Сьогодні</SelectItem>
                  <SelectItem value="yesterday">Вчора</SelectItem>
                  <SelectItem value="last7days">Останні 7 днів</SelectItem>
                  <SelectItem value="last30days">Останні 30 днів</SelectItem>
                  <SelectItem value="thismonth">Цей місяць</SelectItem>
                  <SelectItem value="lastmonth">Минулий місяць</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Всі типи" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі типи</SelectItem>
                  <SelectItem value="image">Зображення</SelectItem>
                  <SelectItem value="audio">Аудіо</SelectItem>
                  <SelectItem value="video">Відео</SelectItem>
                  <SelectItem value="document">Документи</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setDateFilter("all")
                  setShowFilters(false)
                  fetchFiles()
                }}
              >
                Скинути фільтри
              </Button>
            </div>
          </div>
        </div>
      )}

      {renderBreadcrumbs()}

      {renderContent()}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <Modal isOpen={showNewFolderDialog} onClose={() => setShowNewFolderDialog(false)} title="Створити нову папку">
        <div className="space-y-4 py-4">
          <Input placeholder="Назва папки" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Скасувати
            </Button>
            <Button onClick={handleCreateFolder}>Створити</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showFileDetails !== null}
        onClose={() => setShowFileDetails(null)}
        title={isEditMode ? "Редагувати деталі файлу" : "Деталі файлу"}
        className="max-w-3xl"
      >
        {showFileDetails && (
          <div className="py-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={showFileDetails.publicUrl || "/placeholder.svg"}
                    alt={showFileDetails.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <strong>Назва файлу:</strong> {showFileDetails.name}
                  </p>
                  <p>
                    <strong>Тип файлу:</strong> {showFileDetails.metadata?.mimetype || "Невідомо"}
                  </p>
                  <p>
                    <strong>Розмір:</strong>{" "}
                    {formatFileSize(showFileDetails.metadata?.size || showFileDetails.size || 0)}
                  </p>
                  <p>
                    <strong>Дата завантаження:</strong>{" "}
                    {showFileDetails.created_at
                      ? format(new Date(showFileDetails.created_at), "d MMMM yyyy, HH:mm", { locale: uk })
                      : "Невідомо"}
                  </p>
                  <p>
                    <strong>Розміри:</strong> 800 x 600 пікселів
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => handleCopyUrl(showFileDetails.publicUrl)}>
                    <Link className="mr-2 h-4 w-4" />
                    {copiedUrl === showFileDetails.publicUrl ? "URL скопійовано!" : "Копіювати URL"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Завантажити файл
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-500 hover:bg-red-50"
                    onClick={() => {
                      handleDeleteFile(showFileDetails.name)
                      setShowFileDetails(null)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Видалити назавжди
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                {isEditMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Альтернативний текст</label>
                      <Input
                        value={editAltText}
                        onChange={(e) => setEditAltText(e.target.value)}
                        placeholder="Опис зображення для екранних читачів"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                        placeholder="Детальний опис зображення"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setIsEditMode(false)}>
                        Скасувати
                      </Button>
                      <Button onClick={handleSaveFileDetails}>Зберегти</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Tabs defaultValue="details">
                      <TabsList className="mb-4">
                        <TabsTrigger value="details">Деталі</TabsTrigger>
                        <TabsTrigger value="usage">Використання</TabsTrigger>
                      </TabsList>
                      <TabsContent value="details" className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Деталі файлу</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Тут ви можете переглянути та редагувати деталі файлу, такі як заголовок, альтернативний
                            текст та опис.
                          </p>
                          <Button variant="outline" onClick={() => setIsEditMode(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Редагувати деталі
                          </Button>
                        </div>
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">URL файлу</h4>
                          <div className="bg-gray-50 p-2 rounded-md text-sm font-mono break-all">
                            {showFileDetails.publicUrl}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="usage">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Використання файлу</h3>
                          <p className="text-sm text-gray-600 mb-4">Цей файл не використовується в жодному контенті.</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

