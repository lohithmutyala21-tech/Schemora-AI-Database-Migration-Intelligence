"use client"

import { useMemo } from "react"

const KEYWORDS =
  /\b(CREATE|TABLE|TRIGGER|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|DEFAULT|UNIQUE|CHECK|AFTER|BEFORE|INSERT|UPDATE|DELETE|ON|FOR|EACH|ROW|EXECUTE|FUNCTION|OR|AND|SELECT|FROM|WHERE|JOIN|CONSTRAINT|ALTER|ADD)\b/gi
const TYPES =
  /\b(BIGSERIAL|SERIAL|BIGINT|INTEGER|INT|VARCHAR|TEXT|TIMESTAMPTZ|TIMESTAMP|BOOLEAN|NUMERIC|DECIMAL|DATE|UUID|JSONB|JSON)\b/gi

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function highlight(code: string) {
  // Order matters: comments and strings first via placeholder-free approach.
  const lines = code.split("\n")
  return lines
    .map((line) => {
      const commentIdx = line.indexOf("--")
      let codePart = line
      let commentPart = ""
      if (commentIdx >= 0) {
        codePart = line.slice(0, commentIdx)
        commentPart = line.slice(commentIdx)
      }
      let html = escapeHtml(codePart)
      html = html.replace(
        /('[^']*')/g,
        '<span class="text-chart-3">$1</span>',
      )
      html = html.replace(TYPES, '<span class="text-chart-2">$&</span>')
      html = html.replace(
        KEYWORDS,
        '<span class="text-primary font-medium">$&</span>',
      )
      html = html.replace(/\b(\d+)\b/g, '<span class="text-chart-4">$1</span>')
      if (commentPart) {
        html += `<span class="text-muted-foreground italic">${escapeHtml(commentPart)}</span>`
      }
      return html || "&nbsp;"
    })
    .join("\n")
}

export function SqlEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const highlighted = useMemo(() => highlight(value), [value])
  const lineCount = value.split("\n").length

  return (
    <div className="relative flex h-[460px] overflow-hidden rounded-lg border border-border bg-background font-mono text-[13px] leading-6">
      {/* line numbers */}
      <div
        aria-hidden
        className="select-none overflow-hidden border-r border-border bg-card/40 px-3 py-4 text-right text-muted-foreground/50"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <div className="relative flex-1 overflow-auto">
        <pre
          aria-hidden
          className="pointer-events-none m-0 whitespace-pre px-4 py-4"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="absolute inset-0 h-full w-full resize-none whitespace-pre bg-transparent px-4 py-4 text-transparent caret-primary outline-none"
          aria-label="SQL schema editor"
        />
      </div>
    </div>
  )
}
