"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import {
  HistoryIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RotateCcwIcon,
  Loader2Icon,
  UserIcon,
  ClockIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { News } from "@/types/news.types"
import type { Version } from "@/types/version.types"
import { restoreNewsVersion } from "@/lib/actions/version-actions"

interface VersionHistoryProps {
  versions: Version[]
  newsId: string
  currentVersion: News
}

export default function VersionHistory({ versions, newsId, currentVersion }: VersionHistoryProps) {
  const router = useRouter()
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [compareVersion, setCompareVersion] = useState<Version | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleCompare = (version: Version) => {
    if (compareVersion && compareVersion.id === version.id) {
      setCompareVersion(null)
    } else {
      setCompareVersion(version)
    }
  }

  const handleRestore = async () => {
    if (!selectedVersion) return

    try {
      setIsRestoring(true)
      await restoreNewsVersion(newsId, selectedVersion.id)
      toast({
        title: "Версію відновлено",
        description: "Новину успішно відновлено до попередньої версії",
      })
      router.refresh()
    } catch (error) {
      console.error("Error restoring version:", error)
      toast({
        title: "Помилка відновлення",
        description: "Не вдалося відновити версію",
        variant: "destructive",
      })
    } finally {
      setIsRestoring(false)
      setShowRestoreDialog(false)
      setSelectedVersion(null)
    }
  }

  // Функція для порівняння текстів та виділення відмінностей
  const getDiff = (oldText: string, newText: string) => {
    if (!oldText || !newText) return newText || oldText || ""

    // Спрощене порівняння для прикладу
    // В реальному проекті варто використовувати бібліотеку для diff
    const oldWords = oldText.split(" ")
    const newWords = newText.split(" ")

    let result = ""
    let i = 0,
      j = 0

    while (i < oldWords.length || j < newWords.length) {
      if (i >= oldWords.length) {
        // Додані слова
        result += ` <span class="bg-green-100 text-green-800 px-1 rounded">${newWords[j]}</span>`
        j++
      } else if (j >= newWords.length) {
        // Видалені слова (не показуємо в новому тексті)
        i++
      } else if (oldWords[i] === newWords[j]) {
        // Однакові слова
        result += ` ${newWords[j]}`
        i++
        j++
      } else {
        // Змінені слова
        result += ` <span class="bg-yellow-100 text-yellow-800 px-1 rounded">${newWords[j]}</span>`
        i++
        j++
      }
    }

    return result.trim()
  }

  return (
    <div className="space-y-4">
      {versions.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Версія</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Зміни</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version, index) => (
                <TableRow key={version.id} className={selectedVersion?.id === version.id ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{versions.length - index}</TableCell>
                  <TableCell>{version.createdBy || "Система"}</TableCell>
                  <TableCell>{format(new Date(version.createdAt), "PPP HH:mm", { locale: uk })}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {version.changes?.title && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Заголовок
                        </Badge>
                      )}
                      {version.changes?.content && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 ml-1">
                          Контент
                        </Badge>
                      )}
                      {version.changes?.description && (
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 ml-1">
                          Опис
                        </Badge>
                      )}
                      {version.changes?.status && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-1">
                          Статус
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedVersion(version)}>
                        <HistoryIcon className="h-4 w-4 mr-1" />
                        Переглянути
                      </Button>
                      <Button
                        variant={compareVersion?.id === version.id ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleCompare(version)}
                        disabled={!selectedVersion || selectedVersion.id === version.id}
                      >
                        {compareVersion?.id === version.id ? (
                          <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowRightIcon className="h-4 w-4 mr-1" />
                        )}
                        Порівняти
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/50">
          <HistoryIcon className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Немає історії змін</h3>
          <p className="text-sm text-muted-foreground mt-1">Для цієї новини ще не збережено жодної версії.</p>
        </div>
      )}

      {/* Діалог перегляду версії */}
      <Dialog open={!!selectedVersion} onOpenChange={(open) => !open && setSelectedVersion(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Версія від {selectedVersion && format(new Date(selectedVersion.createdAt), "PPP HH:mm", { locale: uk })}
            </DialogTitle>
            <DialogDescription className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4" />
              <span>Автор: {selectedVersion?.createdBy || "Система"}</span>
              <ClockIcon className="h-4 w-4 ml-2" />
              <span>ID: {selectedVersion?.id.substring(0, 8)}</span>
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">Перегляд</TabsTrigger>
              <TabsTrigger value="compare" disabled={!compareVersion}>
                Порівняння
              </TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="space-y-4 pt-4">
              {selectedVersion && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Заголовок</h3>
                    <div className="p-3 border rounded-md bg-card">{selectedVersion.data.title}</div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Опис</h3>
                    <div className="p-3 border rounded-md bg-card">
                      {selectedVersion.data.description || (
                        <span className="text-muted-foreground italic">Немає опису</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Контент</h3>
                    <div
                      className="p-3 border rounded-md bg-card prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedVersion.data.content || "" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Статус</h3>
                    <div className="p-3 border rounded-md bg-card">
                      {selectedVersion.data.status === "published" ? "Опубліковано" : "Чернетка"}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="compare" className="space-y-4 pt-4">
              {selectedVersion && compareVersion && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Заголовок</h3>
                    <div className="p-3 border rounded-md bg-card">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getDiff(compareVersion.data.title, selectedVersion.data.title),
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Опис</h3>
                    <div className="p-3 border rounded-md bg-card">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getDiff(
                            compareVersion.data.description || "",
                            selectedVersion.data.description || "",
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Контент</h3>
                    <div className="p-3 border rounded-md bg-card">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getDiff(compareVersion.data.content || "", selectedVersion.data.content || ""),
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Статус</h3>
                    <div className="p-3 border rounded-md bg-card">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getDiff(
                            compareVersion.data.status === "published" ? "Опубліковано" : "Чернетка",
                            selectedVersion.data.status === "published" ? "Опубліковано" : "Чернетка",
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVersion(null)}>
              Закрити
            </Button>
            <Button variant="default" onClick={() => setShowRestoreDialog(true)}>
              <RotateCcwIcon className="h-4 w-4 mr-2" />
              Відновити цю версію
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Діалог підтвердження відновлення */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Відновити цю версію?</AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія створить нову версію новини на основі вибраної версії. Поточна версія буде збережена в історії.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Скасувати</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore} disabled={isRestoring}>
              {isRestoring ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Відновлення...
                </>
              ) : (
                <>
                  <RotateCcwIcon className="mr-2 h-4 w-4" />
                  Відновити
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

