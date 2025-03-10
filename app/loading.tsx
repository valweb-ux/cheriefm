export default function Loading() {
  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Завантаження...</p>
      </div>
    </div>
  )
}

