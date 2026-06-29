import { useState } from 'react'

export default function CopyButton({ text, label = 'کپی' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" className="copy-btn" onClick={handleCopy}>
      {copied ? 'کپی شد ✓' : label}
    </button>
  )
}
