"use client"

import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioPlayer } from "../../components/radio-player"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Plus, Trash2, Edit, Music } from "lucide-react"
import type { RadioStation } from "../../types"

export default function RadioPlayerSettingsPage() {
  const [stations, setStations] = useState<RadioStation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()

  // Налаштування радіоплеєра
  const [settings, setSettings] = useState({
    showControls: true,
    showVolumeSlider: true,
    showStationsList: true,
    showCoverArt: true,
    defaultVolume: 80,
    autoplay: false,
    defaultStation: "",
    fallbackCoverImage: "/placeholder.svg",
  })

  // Нова станція
  const [newStation, setNewStation] = useState<Partial<RadioStation>>({
    name: "",
    stream_url: "",
    description: "",
    logo_url: "",
    genre: "",
  })

  // Редагування станції
  const [editingStation, setEditingStation] = useState<RadioStation | null>(null)

  useEffect(() => {
    fetchStations()
    fetchSettings()
  }, [])

  const fetchStations = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("radio_stations").select("*").order("name")

      if (error) {
        throw error
      }

      setStations(data || [])
    } catch (error) {
      console.error("Error fetching radio stations:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити список радіостанцій",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("radio_settings").select("*").single()

      if (error) {
        if (error.code !== "PGRST116") {
          // PGRST116 - not found
          throw error
        }
        // Якщо налаштувань немає, використовуємо значення за замовчуванням
        return
      }

      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error("Error fetching radio settings:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити налаштування радіоплеєра",
      })
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)

      const { data, error } = await supabase.from("radio_settings").upsert([settings], { onConflict: "id" }).select()

      if (error) {
        throw error
      }

      toast({
        title: "Успіх",
        description: "Налаштування радіоплеєра збережено",
      })
    } catch (error) {
      console.error("Error saving radio settings:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти налаштування радіоплеєра",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addStation = async () => {
    try {
      if (!newStation.name || !newStation.stream_url) {
        toast({
          title: "Помилка",
          description: "Назва та URL потоку є обов'язковими полями",
        })
        return
      }

      setIsSaving(true)

      const { data, error } = await supabase.from("radio_stations").insert([newStation]).select()

      if (error) {
        throw error
      }

      setStations([...stations, data[0]])
      setNewStation({
        name: "",
        stream_url: "",
        description: "",
        logo_url: "",
        genre: "",
      })

      toast({
        title: "Успіх",
        description: "Радіостанцію додано",
      })
    } catch (error) {
      console.error("Error adding radio station:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося додати радіостанцію",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateStation = async () => {
    try {
      if (!editingStation || !editingStation.name || !editingStation.stream_url) {
        toast({
          title: "Помилка",
          description: "Назва та URL потоку є обов'язковими полями",
        })
        return
      }

      setIsSaving(true)

      const { data, error } = await supabase
        .from("radio_stations")
        .update(editingStation)
        .eq("id", editingStation.id)
        .select()

      if (error) {
        throw error
      }

      setStations(stations.map((station) => (station.id === editingStation.id ? data[0] : station)))
      setEditingStation(null)

      toast({
        title: "Успіх",
        description: "Радіостанцію оновлено",
      })
    } catch (error) {
      console.error("Error updating radio station:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося оновити радіостанцію",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const deleteStation = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю радіостанцію?")) {
      return
    }

    try {
      setIsSaving(true)

      const { error } = await supabase.from("radio_stations").delete().eq("id", id)

      if (error) {
        throw error
      }

      setStations(stations.filter((station) => station.id !== id))

      toast({
        title: "Успіх",
        description: "Радіостанцію видалено",
      })
    } catch (error) {
      console.error("Error deleting radio station:", error)
      toast({
        title: "Помилка",
        description: "Не вдалося видалити радіостанцію",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Налаштування радіоплеєра"
        description="Керуйте налаштуваннями онлайн-радіоплеєра та списком радіостанцій"
        breadcrumbs={[{ label: "Адмінпанель", href: "/admin" }, { label: "Радіоплеєр" }]}
        actions={
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Зберегти налаштування
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminCard>
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="general">Загальні налаштування</TabsTrigger>
                <TabsTrigger value="stations">Радіостанції</TabsTrigger>
                <TabsTrigger value="appearance">Зовнішній вигляд</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Загальні налаштування радіоплеєра</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoplay" className="font-medium">
                        Автоматичне відтворення
                      </Label>
                      <p className="text-sm text-gray-500">
                        Автоматично починати відтворення при завантаженні сторінки
                      </p>
                    </div>
                    <Switch
                      id="autoplay"
                      checked={settings.autoplay}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoplay: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultVolume" className="font-medium">
                      Гучність за замовчуванням
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        id="defaultVolume"
                        min={0}
                        max={100}
                        step={1}
                        value={[settings.defaultVolume]}
                        onValueChange={(value) => setSettings({ ...settings, defaultVolume: value[0] })}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">{settings.defaultVolume}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultStation" className="font-medium">
                      Станція за замовчуванням
                    </Label>
                    <select
                      id="defaultStation"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={settings.defaultStation}
                      onChange={(e) => setSettings({ ...settings, defaultStation: e.target.value })}
                    >
                      <option value="">Виберіть станцію</option>
                      {stations.map((station) => (
                        <option key={station.id} value={station.id.toString()}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stations" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Керування радіостанціями</h3>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {stations.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-md">
                          <Music className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-500">Немає доданих радіостанцій</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {stations.map((station) => (
                            <div key={station.id} className="border rounded-md p-4">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-4">
                                  {station.logo_url ? (
                                    <img
                                      src={station.logo_url || "/placeholder.svg"}
                                      alt={station.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold text-xl">
                                      {station.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">{station.name}</h4>
                                  <p className="text-sm text-gray-500 truncate">{station.genre || "Без жанру"}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingStation(station)}>
                                    <Edit size={16} className="mr-1" />
                                    Редагувати
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteStation(station.id)}
                                    className="text-red-500 hover:bg-red-50"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </div>
                              {editingStation?.id === station.id && (
                                <div className="mt-4 border-t pt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <Label htmlFor="edit-name" className="mb-1 block">
                                        Назва станції
                                      </Label>
                                      <Input
                                        id="edit-name"
                                        value={editingStation.name}
                                        onChange={(e) => setEditingStation({ ...editingStation, name: e.target.value })}
                                        placeholder="Назва станції"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-stream-url" className="mb-1 block">
                                        URL потоку
                                      </Label>
                                      <Input
                                        id="edit-stream-url"
                                        value={editingStation.stream_url}
                                        onChange={(e) =>
                                          setEditingStation({ ...editingStation, stream_url: e.target.value })
                                        }
                                        placeholder="https://example.com/stream"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-genre" className="mb-1 block">
                                        Жанр
                                      </Label>
                                      <Input
                                        id="edit-genre"
                                        value={editingStation.genre || ""}
                                        onChange={(e) =>
                                          setEditingStation({ ...editingStation, genre: e.target.value })
                                        }
                                        placeholder="Поп, Рок, Джаз..."
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-logo-url" className="mb-1 block">
                                        URL логотипу
                                      </Label>
                                      <Input
                                        id="edit-logo-url"
                                        value={editingStation.logo_url || ""}
                                        onChange={(e) =>
                                          setEditingStation({ ...editingStation, logo_url: e.target.value })
                                        }
                                        placeholder="https://example.com/logo.png"
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-4">
                                    <Label htmlFor="edit-description" className="mb-1 block">
                                      Опис
                                    </Label>
                                    <textarea
                                      id="edit-description"
                                      value={editingStation.description || ""}
                                      onChange={(e) =>
                                        setEditingStation({ ...editingStation, description: e.target.value })
                                      }
                                      placeholder="Опис радіостанції"
                                      className="w-full p-2 border border-gray-300 rounded-md"
                                      rows={3}
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setEditingStation(null)}>
                                      Скасувати
                                    </Button>
                                    <Button onClick={updateStation} disabled={isSaving}>
                                      {isSaving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                      )}
                                      Зберегти
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 border-t pt-6">
                        <h4 className="font-medium mb-4">Додати нову радіостанцію</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="new-name" className="mb-1 block">
                              Назва станції
                            </Label>
                            <Input
                              id="new-name"
                              value={newStation.name}
                              onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                              placeholder="Назва станції"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-stream-url" className="mb-1 block">
                              URL потоку
                            </Label>
                            <Input
                              id="new-stream-url"
                              value={newStation.stream_url}
                              onChange={(e) => setNewStation({ ...newStation, stream_url: e.target.value })}
                              placeholder="https://example.com/stream"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-genre" className="mb-1 block">
                              Жанр
                            </Label>
                            <Input
                              id="new-genre"
                              value={newStation.genre || ""}
                              onChange={(e) => setNewStation({ ...newStation, genre: e.target.value })}
                              placeholder="Поп, Рок, Джаз..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-logo-url" className="mb-1 block">
                              URL логотипу
                            </Label>
                            <Input
                              id="new-logo-url"
                              value={newStation.logo_url || ""}
                              onChange={(e) => setNewStation({ ...newStation, logo_url: e.target.value })}
                              placeholder="https://example.com/logo.png"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <Label htmlFor="new-description" className="mb-1 block">
                            Опис
                          </Label>
                          <textarea
                            id="new-description"
                            value={newStation.description || ""}
                            onChange={(e) => setNewStation({ ...newStation, description: e.target.value })}
                            placeholder="Опис радіостанції"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={3}
                          />
                        </div>
                        <Button onClick={addStation} disabled={isSaving}>
                          {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="mr-2 h-4 w-4" />
                          )}
                          Додати станцію
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Налаштування зовнішнього вигляду</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showControls" className="font-medium">
                        Показувати елементи управління
                      </Label>
                      <p className="text-sm text-gray-500">Кнопки відтворення/паузи</p>
                    </div>
                    <Switch
                      id="showControls"
                      checked={settings.showControls}
                      onCheckedChange={(checked) => setSettings({ ...settings, showControls: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showVolumeSlider" className="font-medium">
                        Показувати повзунок гучності
                      </Label>
                      <p className="text-sm text-gray-500">Елемент управління гучністю</p>
                    </div>
                    <Switch
                      id="showVolumeSlider"
                      checked={settings.showVolumeSlider}
                      onCheckedChange={(checked) => setSettings({ ...settings, showVolumeSlider: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showStationsList" className="font-medium">
                        Показувати список станцій
                      </Label>
                      <p className="text-sm text-gray-500">Список доступних радіостанцій</p>
                    </div>
                    <Switch
                      id="showStationsList"
                      checked={settings.showStationsList}
                      onCheckedChange={(checked) => setSettings({ ...settings, showStationsList: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showCoverArt" className="font-medium">
                        Показувати обкладинку
                      </Label>
                      <p className="text-sm text-gray-500">Зображення поточної радіостанції</p>
                    </div>
                    <Switch
                      id="showCoverArt"
                      checked={settings.showCoverArt}
                      onCheckedChange={(checked) => setSettings({ ...settings, showCoverArt: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fallbackCoverImage" className="font-medium">
                      Зображення-заглушка
                    </Label>
                    <p className="text-sm text-gray-500 mb-2">
                      URL зображення, яке буде показано, якщо у радіостанції немає логотипу
                    </p>
                    <Input
                      id="fallbackCoverImage"
                      value={settings.fallbackCoverImage}
                      onChange={(e) => setSettings({ ...settings, fallbackCoverImage: e.target.value })}
                      placeholder="/placeholder.svg"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </AdminCard>
        </div>

        <div>
          <AdminCard title="Попередній перегляд">
            <div className="p-4">
              <RadioPlayer stations={stations} />
            </div>
          </AdminCard>

          <div className="mt-6">
            <AdminCard title="Інформація">
              <div className="p-4 space-y-4">
                <p className="text-sm">
                  Налаштуйте радіоплеєр відповідно до ваших потреб. Ви можете додавати, редагувати та видаляти
                  радіостанції, а також налаштовувати зовнішній вигляд плеєра.
                </p>

                <div className="text-sm">
                  <h4 className="font-medium mb-2">Підтримувані формати потоків:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>MP3 (Icecast/Shoutcast)</li>
                    <li>AAC</li>
                    <li>HLS</li>
                  </ul>
                </div>

                <div className="text-sm">
                  <h4 className="font-medium mb-2">Поради:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Використовуйте прямі URL до аудіопотоків</li>
                    <li>Для логотипів рекомендується використовувати зображення розміром 300x300 пікселів</li>
                    <li>Перевірте працездатність потоку перед додаванням</li>
                  </ul>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </>
  )
}

