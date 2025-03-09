export async function getMediaFolders() {
  return [
    { id: "1", name: "Зображення", path: "/images" },
    { id: "2", name: "Аудіо", path: "/audio" },
    { id: "3", name: "Відео", path: "/video" },
  ]
}

export async function getMediaFiles(folderId?: string) {
  return [
    {
      id: "1",
      name: "sample-image.jpg",
      type: "image/jpeg",
      size: 1024,
      url: "/placeholder.svg?height=300&width=300",
      folderId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "sample-audio.mp3",
      type: "audio/mpeg",
      size: 2048,
      url: "/sample-audio.mp3",
      folderId: "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

export async function createMediaFolder(name: string, parentId?: string) {
  return { id: Date.now().toString(), name, path: `/${name.toLowerCase()}` }
}

export async function deleteMediaFolder(folderId: string) {
  return { success: true }
}

export async function updateMediaFile(fileId: string, data: any) {
  return { success: true }
}

export async function deleteMediaFile(fileId: string) {
  return { success: true }
}

export async function getMediaFileById(fileId: string) {
  return {
    id: fileId,
    name: "Файл.jpg",
    type: "image/jpeg",
    size: 1024,
    url: "/placeholder.svg?height=300&width=300",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

