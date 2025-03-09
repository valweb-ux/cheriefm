"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash2, Save, Play, Pause, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  getAllRadioAdverts,
  createRadioAdvert,
  updateRadioAdvert,
  deleteRadioAdvert,
} from "@/lib/services/radio-adverts-service"
import type { RadioAdvert, AdvertTargeting } from "@/types/radio.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RadioAdvertsManager() {
  const router = useRouter()
  const { toast } = useToast()
  const [adverts, setAdverts] = useState<RadioAdvert[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAdvert, setCurrentAdvert] = useState<Partial<RadioAdvert> | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  // Завантаження рекламних роликів
  useEffect(() => {
    const loadAdverts = async () => {
      try {
        const data = await getAllRadioAdverts()
        setAdverts(data)
      } catch (error) {
        console.error("Error loading adverts:", error)
        toast({
          title: "Помилка",
          description: "Не вдалося завантажити рекламні ролики",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadAdverts()
  }, [toast])

  // Зупинка відтворення аудіо при закритті діалогу
  useEffect(() => {
    if (!isDialogOpen && currentAudio) {
      currentAudio.pause()
      setIsPlaying(false)
      setCurrentAudio(null)
    }
  }, [isDialogOpen, currentAudio])

  const handleCreateAdvert = () => {
    setCurrentAdvert({
      title: "",
      audioUrl: "",
      duration: 0,
      isActive: true,
      priority: 1,
      targeting: {
        devices: [],
        browsers: [],
        countries: [],
        languages: [],
        daysOfWeek: [],
        timeOfDay: [],
        programs: [],
      },
    })
    setAudioFile(null)
    setIsDialogOpen(true)
    setActiveTab("basic")
  }

  const handleEditAdvert = (advert: RadioAdvert) => {
    // Переконуємося, що targeting існує
    const advertWithTargeting = {
      ...advert,
      targeting: advert.targeting || {
        devices: [],
        browsers: [],
        countries: [],
        languages: [],
        daysOfWeek: [],
        timeOfDay: [],
        programs: [],
      },
    }

    setCurrentAdvert(advertWithTargeting)
    setAudioFile(null)
    setIsDialogOpen(true)
    setActiveTab("basic")
  }

  const handleDeleteAdvert = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей рекламний ролик?")) {
      return
    }

    try {
      await deleteRadioAdvert(id)
      setAdverts(adverts.filter((advert) => advert.id !== id))
      toast({
        title: "Успішно",
        description: "Рекламний ролик видалено",
      })
    } catch (error) {
      console.error("Error deleting advert:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося видалити рекламний ролик",
        variant: "destructive",
      })
    }
  }

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAudioFile(file)

      // Отримуємо тривалість аудіо
      const audio = new Audio()
      audio.src = URL.createObjectURL(file)

      audio.onloadedmetadata = () => {
        setCurrentAdvert((prev) => ({
          ...prev,
          duration: Math.ceil(audio.duration),
        }))
      }
    }
  }

  const handlePlayAudio = (url: string) => {
    if (currentAudio) {
      currentAudio.pause()
    }

    const audio = new Audio(url)
    audio.play()
    setIsPlaying(true)
    setCurrentAudio(audio)

    audio.onended = () => {
      setIsPlaying(false)
      setCurrentAudio(null)
    }
  }

  const handlePauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause()
      setIsPlaying(false)
    }
  }

  const handleSaveAdvert = async () => {
    if (!currentAdvert || !currentAdvert.title) {
      toast({
        title: "Помилка",
        description: "Заповніть всі обов'язкові поля",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      let audioUrl = currentAdvert.audioUrl || ""

      // Якщо вибрано новий аудіофайл, завантажуємо його
      if (audioFile) {
        // Тут має бути код для завантаження файлу на сервер
        // Наприклад, через Supabase Storage

        // Для прикладу просто встановлюємо тимчасовий URL
        audioUrl = URL.createObjectURL(audioFile)

        // В реальному проекті тут буде щось на зразок:
        // const { data, error } = await supabase.storage
        //   .from('adverts')
        //   .upload(`advert-${Date.now()}.mp3`, audioFile)
        // if (error) throw error
        // audioUrl = supabase.storage.from('adverts').getPublicUrl(data.path).publicUrl
      }

      const advertData = {
        ...currentAdvert,
        audioUrl,
      }

      let updatedAdvert: RadioAdvert

      if (currentAdvert.id) {
        // Оновлення існуючого ролика
        updatedAdvert = await updateRadioAdvert(currentAdvert.id, advertData)
        setAdverts(adverts.map((a) => (a.id === updatedAdvert.id ? updatedAdvert : a)))
      } else {
        // Створення нового ролика
        updatedAdvert = await createRadioAdvert(advertData as any)
        setAdverts([...adverts, updatedAdvert])
      }

      toast({
        title: "Успішно",
        description: currentAdvert.id ? "Рекламний ролик оновлено" : "Рекламний ролик створено",
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving advert:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти рекламний ролик",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Функція для оновлення таргетування
  const updateTargeting = (field: keyof AdvertTargeting, value: any) => {
    setCurrentAdvert((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          [field]: value,
        },
      }
    })
  }

  // Функція для додавання часового діапазону
  const addTimeRange = () => {
    setCurrentAdvert((prev) => {
      if (!prev || !prev.targeting) return prev

      const timeOfDay = prev.targeting.timeOfDay || []
      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          timeOfDay: [...timeOfDay, { startTime: "08:00", endTime: "20:00" }],
        },
      }
    })
  }

  // Функція для видалення часового діапазону
  const removeTimeRange = (index: number) => {
    setCurrentAdvert((prev) => {
      if (!prev || !prev.targeting || !prev.targeting.timeOfDay) return prev

      const timeOfDay = [...prev.targeting.timeOfDay]
      timeOfDay.splice(index, 1)

      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          timeOfDay,
        },
      }
    })
  }

  // Функція для оновлення часового діапазону
  const updateTimeRange = (index: number, field: "startTime" | "endTime", value: string) => {
    setCurrentAdvert((prev) => {
      if (!prev || !prev.targeting || !prev.targeting.timeOfDay) return prev

      const timeOfDay = [...prev.targeting.timeOfDay]
      timeOfDay[index] = {
        ...timeOfDay[index],
        [field]: value,
      }

      return {
        ...prev,
        targeting: {
          ...prev.targeting,
          timeOfDay,
        },
      }
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Рекламні ролики</h2>
        <Button onClick={handleCreateAdvert}>
          <Plus className="mr-2 h-4 w-4" />
          Додати ролик
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Назва</TableHead>
                <TableHead>Тривалість</TableHead>
                <TableHead>Пріоритет</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Таргетування</TableHead>
                <TableHead>Відтворень</TableHead>
                <TableHead>Останнє оновлення</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adverts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Немає рекламних роликів. Додайте перший ролик.
                  </TableCell>
                </TableRow>
              ) : (
                adverts.map((advert) => (
                  <TableRow key={advert.id}>
                    <TableCell className="font-medium">{advert.title}</TableCell>
                    <TableCell>{advert.duration} сек.</TableCell>
                    <TableCell>{advert.priority}</TableCell>
                    <TableCell>
                      {advert.isActive ? (
                        <Badge variant="default">Активний</Badge>
                      ) : (
                        <Badge variant="outline">Неактивний</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {advert.targeting &&
                      Object.values(advert.targeting).some((val) => Array.isArray(val) && val.length > 0) ? (
                        <Badge variant="secondary">
                          <Target className="h-3 w-3 mr-1" />
                          Налаштовано
                        </Badge>
                      ) : (
                        <Badge variant="outline">Всі користувачі</Badge>
                      )}
                    </TableCell>
                    <TableCell>{advert.playCount}</TableCell>
                    <TableCell>{format(new Date(advert.lastUpdated), "dd.MM.yyyy HH:mm")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (isPlaying && currentAudio) {
                              handlePauseAudio()
                            } else {
                              handlePlayAudio(advert.audioUrl)
                            }
                          }}
                        >
                          {isPlaying && currentAudio?.src === advert.audioUrl ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEditAdvert(advert)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteAdvert(advert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{currentAdvert?.id ? "Редагувати рекламний ролик" : "Додати рекламний ролик"}</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basic">Основна інформація</TabsTrigger>
              <TabsTrigger value="targeting">Таргетування</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Назва ролика</Label>
                <Input
                  id="title"
                  value={currentAdvert?.title || ""}
                  onChange={(e) => setCurrentAdvert((prev) => ({ ...prev!, title: e.target.value }))}
                  placeholder="Введіть назву рекламного ролика"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audio">Аудіофайл</Label>
                <Input id="audio" type="file" accept="audio/*" onChange={handleAudioFileChange} />
                {currentAdvert?.audioUrl && !audioFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">Поточний файл: {currentAdvert.audioUrl}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (isPlaying && currentAudio) {
                          handlePauseAudio()
                        } else {
                          handlePlayAudio(currentAdvert.audioUrl)
                        }
                      }}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Тривалість (сек.)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={currentAdvert?.duration || 0}
                    onChange={(e) =>
                      setCurrentAdvert((prev) => ({ ...prev!, duration: Number.parseInt(e.target.value) }))
                    }
                    min={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Пріоритет</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={currentAdvert?.priority || 1}
                    onChange={(e) =>
                      setCurrentAdvert((prev) => ({ ...prev!, priority: Number.parseInt(e.target.value) }))
                    }
                    min={1}
                    max={10}
                  />
                  <p className="text-xs text-muted-foreground">Вищий пріоритет означає частіше відтворення</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={currentAdvert?.isActive || false}
                  onCheckedChange={(checked) => setCurrentAdvert((prev) => ({ ...prev!, isActive: checked }))}
                />
                <Label htmlFor="isActive">Активний</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Дата початку (опціонально)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={currentAdvert?.startDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      setCurrentAdvert((prev) => ({
                        ...prev!,
                        startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Дата закінчення (опціонально)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={currentAdvert?.endDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      setCurrentAdvert((prev) => ({
                        ...prev!,
                        endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Пристрої</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {["desktop", "mobile", "tablet"].map((device) => (
                        <div key={device} className="flex items-center space-x-2">
                          <Checkbox
                            id={`device-${device}`}
                            checked={currentAdvert?.targeting?.devices?.includes(device)}
                            onCheckedChange={(checked) => {
                              const devices = currentAdvert?.targeting?.devices || []
                              if (checked) {
                                updateTargeting("devices", [...devices, device])
                              } else {
                                updateTargeting(
                                  "devices",
                                  devices.filter((d) => d !== device),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`device-${device}`}>{device}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Браузери</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {["chrome", "firefox", "safari", "edge", "opera", "ie"].map((browser) => (
                        <div key={browser} className="flex items-center space-x-2">
                          <Checkbox
                            id={`browser-${browser}`}
                            checked={currentAdvert?.targeting?.browsers?.includes(browser)}
                            onCheckedChange={(checked) => {
                              const browsers = currentAdvert?.targeting?.browsers || []
                              if (checked) {
                                updateTargeting("browsers", [...browsers, browser])
                              } else {
                                updateTargeting(
                                  "browsers",
                                  browsers.filter((b) => b !== browser),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`browser-${browser}`}>{browser}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Мови</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {["uk", "en", "fr", "de", "pl", "ru"].map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${lang}`}
                            checked={currentAdvert?.targeting?.languages?.includes(lang)}
                            onCheckedChange={(checked) => {
                              const languages = currentAdvert?.targeting?.languages || []
                              if (checked) {
                                updateTargeting("languages", [...languages, lang])
                              } else {
                                updateTargeting(
                                  "languages",
                                  languages.filter((l) => l !== lang),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`lang-${lang}`}>{lang}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Дні тижня</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: 0, label: "Неділя" },
                        { value: 1, label: "Понеділок" },
                        { value: 2, label: "Вівторок" },
                        { value: 3, label: "Середа" },
                        { value: 4, label: "Четвер" },
                        { value: 5, label: "П'ятниця" },
                        { value: 6, label: "Субота" },
                      ].map((day) => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day.value}`}
                            checked={currentAdvert?.targeting?.daysOfWeek?.includes(day.value)}
                            onCheckedChange={(checked) => {
                              const days = currentAdvert?.targeting?.daysOfWeek || []
                              if (checked) {
                                updateTargeting("daysOfWeek", [...days, day.value])
                              } else {
                                updateTargeting(
                                  "daysOfWeek",
                                  days.filter((d) => d !== day.value),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Час доби</h3>
                      <Button variant="outline" size="sm" onClick={addTimeRange}>
                        <Plus className="h-4 w-4 mr-1" />
                        Додати діапазон
                      </Button>
                    </div>

                    {currentAdvert?.targeting?.timeOfDay && currentAdvert.targeting.timeOfDay.length > 0 ? (
                      <div className="space-y-2">
                        {currentAdvert.targeting.timeOfDay.map((timeRange, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={timeRange.startTime}
                              onChange={(e) => updateTimeRange(index, "startTime", e.target.value)}
                              className="w-32"
                            />
                            <span>до</span>
                            <Input
                              type="time"
                              value={timeRange.endTime}
                              onChange={(e) => updateTimeRange(index, "endTime", e.target.value)}
                              className="w-32"
                            />
                            <Button variant="outline" size="icon" onClick={() => removeTimeRange(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Немає налаштованих діапазонів часу</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Країни</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {["UA", "US", "GB", "DE", "FR", "PL"].map((country) => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox
                            id={`country-${country}`}
                            checked={currentAdvert?.targeting?.countries?.includes(country)}
                            onCheckedChange={(checked) => {
                              const countries = currentAdvert?.targeting?.countries || []
                              if (checked) {
                                updateTargeting("countries", [...countries, country])
                              } else {
                                updateTargeting(
                                  "countries",
                                  countries.filter((c) => c !== country),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`country-${country}`}>{country}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Скасувати
            </Button>
            <Button onClick={handleSaveAdvert} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Збереження...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Зберегти
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

