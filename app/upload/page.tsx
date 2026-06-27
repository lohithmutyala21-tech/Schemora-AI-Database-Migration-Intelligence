import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Workspace } from "@/components/workspace/workspace"

export default function UploadPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Workspace />
      </main>
      <SiteFooter />
    </div>
  )
}
