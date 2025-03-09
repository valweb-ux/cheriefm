"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History, Loader2, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getContentVersions, restoreContentVersion } from "@/lib/services/wysiwyg-editor"

interface ContentVersionHistoryProps {
  contentType: string
  contentId: string
  onRestore: (content: string) => void
}

export function ContentVersionHistory({ contentType, contentId, onRestore }: ContentVersionHistoryProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [versions, setVersions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)

  const fetchVersions = async () => {
    if (!isOpen) return

    setLoading(true)
    try {
      const data = await getContentVersions(contentType, contentId)
      setVersions(data)
    } catch (error) {
      console.error("Error fetching versions:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося завантажити історію версій",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVersions()
  }, [isOpen])

  const handleRestore = async (versionId: string) => {
    if (!confirm("Ви впевнені, що хочете відновити цю версію? Поточні зміни будуть втрачені.")) {
      return
    }

    setRestoring(versionId)
    try {
      const content = await restoreContentVersion(versionId, contentType, contentId)

      toast({
        title: "Успішно",
        description: "Версію відновлено",
      })

      onRestore(content)
      setIsOpen(false)
    } catch (error) {
      console.error("Error restoring version:", error)
      toast({
        title: "Помилка",
        description: error instanceof Error ? error.message : "Не вдалося відновити версію",
        variant: "destructive",
      })
    } finally {
      setRestoring(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <History className="h-4 w-4 mr-2" />
          Історія змін
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Історія версій</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Історія версій порожня</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Користувач</TableHead>
                <TableHead>Коментар</TableHead>
                <TableHead className="w-[100px]">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell>{formatDate(version.created_at)}</TableCell>
                  <TableCell>{version.users?.email || "Невідомий користувач"}</TableCell>
                  <TableCell>{version.comment || "—"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(version.id)}
                      disabled={restoring === version.id}
                    >
                      {restoring === version.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}

