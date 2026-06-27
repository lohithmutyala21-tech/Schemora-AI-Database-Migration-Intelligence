import Link from "next/link"
import { Database } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Database className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              SchemaShift<span className="text-primary"> AI</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Database migration intelligence for engineering teams moving between
            Aurora DSQL and DynamoDB.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterCol
            title="Product"
            links={[
              { label: "Workspace", href: "/upload" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Roadmap", href: "/roadmap" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { label: "History", href: "/history" },
              { label: "Architecture", href: "/#architecture" },
              { label: "Documentation", href: "/upload" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", href: "/" },
              { label: "Security", href: "/" },
              { label: "Contact", href: "/" },
            ]}
          />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SchemaShift AI. All rights reserved.</p>
          <p>Frontend on Vercel · Backend on Next.js · Aurora PostgreSQL</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
