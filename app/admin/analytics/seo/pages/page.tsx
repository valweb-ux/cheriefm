import { PageSeoManager } from "@/components/admin/analytics/page-seo-manager"

export default function PageSeoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO для сторінок</h1>
        <p className="text-muted-foreground">Керуйте SEO налаштуваннями для окремих сторінок</p>
      </div>

      <PageSeoManager />
    </div>
  )
}

