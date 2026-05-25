import { useEffect, useState } from 'react'
import { renderMermaid } from '../utils/mermaidRenderer'

export default function Preview({ code, config, themeSettings, onRenderedSvg }) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const timeout = window.setTimeout(async () => {
      try {
        const nextSvg = await renderMermaid({ code, config, themeSettings })
        if (cancelled) {
          return
        }

        setSvg(nextSvg)
        setError('')
        onRenderedSvg(nextSvg)
      } catch (err) {
        if (cancelled) {
          return
        }

        const message = err instanceof Error ? err.message : 'Diagram rendering failed.'
        setError(message)
        setSvg('')
        onRenderedSvg('')
      }
    }, 350)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [code, config, themeSettings, onRenderedSvg])

  return (
    <section className="brutal-panel h-full" aria-label="Diagram preview panel">
      <header className="panel-header">
        <h2>Preview</h2>
        <p>Live render output</p>
      </header>

      {error ? (
        <div className="error-box" role="alert" aria-live="assertive">
          <strong>Syntax error:</strong> {error}
        </div>
      ) : (
        <div className="preview-canvas" aria-live="polite" dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </section>
  )
}
