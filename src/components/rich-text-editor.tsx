"use client"

import { useMemo, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center rounded-lg border border-stone-200/60 bg-white/40 backdrop-blur-sm">
      <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
    </div>
  ),
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = "",
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        // list buttons still use 'ordered'/'bullet' here — that's OK:
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    []
  )

  // ✅ UPDATED formats: no 'bullet' (or 'ordered'); keep only 'list'
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",        // <-- keep this
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ]

  useEffect(() => {
    const text = value.replace(/<[^>]*>/g, "").trim()
    setCharCount(text.length)
    setWordCount(text.split(/\s+/).filter(Boolean).length)
  }, [value])

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`overflow-hidden rounded-lg border transition-all ${
          isFocused ? "border-amber-300/60 shadow-lg shadow-amber-100/50" : "border-stone-200/60"
        }`}
        style={{ background: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(12px)" }}
      >
        <style jsx global>{`
          .quill { font-family: inherit; }
          .ql-toolbar {
            background: rgba(255, 255, 255, 0.6) !important;
            border: none !important;
            border-bottom: 1px solid rgba(120, 113, 108, 0.2) !important;
            padding: 0.75rem !important;
          }
          .ql-container { border: none !important; font-size: 0.9375rem !important; min-height: 200px !important; }
          @media (min-width: 640px) { .ql-container { min-height: 250px !important; } }
          @media (min-width: 768px) { .ql-container { min-height: 300px !important; } }
          .ql-editor { padding: 1rem !important; min-height: 200px !important; }
          @media (min-width: 640px) { .ql-editor { padding: 1.25rem !important; min-height: 250px !important; } }
          @media (min-width: 768px) { .ql-editor { padding: 1.5rem !important; min-height: 300px !important; } }
          .ql-editor.ql-blank::before { color: rgba(120,113,108,.5) !important; font-style: normal !important; }
          .ql-toolbar button { transition: all .2s !important; }
          .ql-toolbar button:hover { background: rgba(251,191,36,.1) !important; color: rgb(217,119,6) !important; }
          .ql-toolbar button.ql-active { background: rgba(251,191,36,.2) !important; color: rgb(217,119,6) !important; }
          .ql-stroke { stroke: rgb(87,83,78) !important; }
          .ql-fill { fill: rgb(87,83,78) !important; }
          .ql-toolbar button:hover .ql-stroke, .ql-toolbar button.ql-active .ql-stroke { stroke: rgb(217,119,6) !important; }
          .ql-toolbar button:hover .ql-fill, .ql-toolbar button.ql-active .ql-fill { fill: rgb(217,119,6) !important; }
          .ql-picker-label { color: rgb(87,83,78) !important; }
          .ql-picker-label:hover { color: rgb(217,119,6) !important; }
        `}</style>

        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 sm:text-sm">
        <p>Rich text editor with full formatting support</p>
        <div className="flex gap-3 text-xs">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>
    </div>
  )
}
