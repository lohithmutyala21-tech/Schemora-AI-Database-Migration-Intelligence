"use client"

import { useMemo } from "react"

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

// Single-pass tokenizer so we never re-scan already-injected markup.
const TOKEN =
  /(--.*$)|('[^']*')|\b(BIGSERIAL|SERIAL|BIGINT|INTEGER|INT|VARCHAR|TEXT|TIMESTAMPTZ|TIMESTAMP|BOOLEAN|NUMERIC|DECIMAL|DATE|UUID|JSONB|JSON)\b|\b(CREATE|TABLE|TRIGGER|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|DEFAULT|UNIQUE|CHECK|AFTER|BEFORE|INSERT|UPDATE|DELETE|ON|FOR|EACH|ROW|EXECUTE|FUNCTION|OR|AND|SELECT|FROM|WHERE|JOIN|CONSTRAINT|ALTER|ADD)\b|(\d+)/gi

function highlight(code: string) {
  return code
    .split("\n")
    .map((line) => {
      let html = ""
      let lastIndex = 0
      const re = new RegExp(TOKEN.source, "gi")
      let m: RegExpExecArray | null
      while ((m = re.exec(line)) !== null) {
        html += escapeHtml(line.slice(lastIndex, m.index))
        const [match, comment, str, type, keyword, num] = m
        if (comment) {
          html += `<span class="text-muted-foreground italic">${escapeHtml(comment)}</span>`
        } else if (str) {
          html += `<span class="text-chart-3">${escapeHtml(str)}</span>`
        } else if (type) {
          html += `<span class="text-chart-2">${escapeHtml(type)}</span>`
        } else if (keyword) {
          html += `<span class="text-primary font-medium">${escapeHtml(keyword)}</span>`
        } else if (num) {
          html += `<span class="text-chart-4">${escapeHtml(num)}</span>`
        } else {
          html += escapeHtml(match)
        }
        lastIndex = m.index + match.length
      }
      html += escapeHtml(line.slice(lastIndex))
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
