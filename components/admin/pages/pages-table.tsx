"use client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Експортуємо компонент за замовчуванням
export default function PagesTable({ pages = [], onEdit = () => {}, onDelete = () => {} }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сторінки</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Назва</TableHead>
                <TableHead>Шлях</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Немає сторінок
                  </TableCell>
                </TableRow>
              ) : (
                pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>{page.title}</TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell>{page.published ? "Опубліковано" : "Чернетка"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(page.id)}>
                          Редагувати
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(page.id)}>
                          Видалити
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// Також експортуємо іменований компонент для сумісності
export { PagesTable }

